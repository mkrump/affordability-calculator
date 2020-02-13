import React, { Component } from "react";
import styles from "./index.module.scss";
import {
  axisBottom,
  axisLeft,
  json,
  max,
  scaleBand,
  scaleLinear,
  select,
  selectAll
} from "d3";
import tip from "d3-tip";

class Graph extends Component {
  state = { data: null };
  componentDidMount() {
    const { msa, threshold } = this.props;
    if (msa === "") {
      this.destroy();
      return;
    }
    this.fetchAndRedraw(msa, threshold);
  }

  affordablePercentage = (d, threshold) => {
    if (d.high < threshold) {
      return 0;
    }
    if (d.low < threshold && d.high > threshold) {
      const range = d.high - d.low;
      return Math.round(((d.high - threshold) / range) * 100);
    }
    return 100;
  };

  fetchAndRedraw = (msa, threshold) => {
    const { redraw } = this;
    const setState = this.setState.bind(this);
    json(`/income-dist/${msa}`).then(function(data) {
      setState({ data: data });
      redraw(data, threshold);
    });
  };

  redraw = (data, threshold) => {
    this.destroy();
    this.draw(data, threshold);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { msa, threshold } = this.props;
    if (msa === "") {
      this.destroy();
      return;
    }
    if (msa !== prevProps.msa) {
      this.fetchAndRedraw(msa, threshold);
      return;
    }
    this.redraw(this.state.data, threshold);
  }

  render() {
    return <div id="graph" />;
  }

  destroy = () => {
    selectAll("#graph > *").remove();
  };

  xAxisFormat = s => {
    // reformat <10,000 as <10
    if (s.includes("<")) {
      return "<" + s.replace(/[,<]/g, "").substring(0, s.length - 5);
    }
    // reformat 200,000+ as  200+
    if (s.includes("+")) {
      return s.replace(/[,+]/g, "").substring(0, s.length - 5) + "+";
    }
    // reformat 15,000-20,000 as 15-20
    const range = s.replace(/,/g, "").split("-");
    if (range.length === 2) {
      const [low, high] = range.map(x => Math.trunc((parseInt(x) + 1) / 1000));
      return `${low}-${high}`;
    }
  };
  /**
   * @typedef {Object} data
   * @property {Object} income_distribution
   * @property {string} msa_name
   * @property {number} total_households
   * @property {number} median_income
   * @property {number} mean_income
   * @property {string} msa_number
   *
   * @typedef {Object} income_distribution
   * @property {number} high
   * @property {number} low
   * @property {string} label
   * @property {string} percent
   */
  draw = (data, threshold) => {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 100, left: 100 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let { income_distribution: incomeDistribution, msa_name: msaName } = data;
    if (!incomeDistribution) {
      return;
    }
    incomeDistribution = Object.keys(incomeDistribution)
      .map(i => incomeDistribution[i])
      .sort((a, b) => (a.low > b.low ? 1 : -1));

    const title = select("#graph").append("h2");
    const thresholdText = select("#graph").append("h2");

    // create tooltip using d3-tip
    const toolTip = tip()
      .attr("class", styles.tooltip)
      .offset([-10, 0])
      .html(d => {
        return `<strong> Percent of all Households: ${d.percent}%</strong>`;
      });
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = select("#graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // initialize tooltip
    svg.call(toolTip);

    // Scale the range of the data in the domains
    // set the ranges and scale the date in the domains
    const x = scaleBand()
      .range([0, width])
      .padding(0.1);
    x.domain(
      incomeDistribution.map(function(d) {
        return d.label;
      })
    );
    const y = scaleLinear().range([height, 0]);
    y.domain([
      0,
      max(incomeDistribution, function(d) {
        return d.percent;
      })
    ]);

    // Add name of selected MSA to title
    title.text(msaName);
    const canAfford = incomeDistribution.reduce(function(a, d) {
      if (d.low > threshold) {
        return a + d.percent;
      }
      if (d.high > threshold && d.low < threshold) {
        const range = d.high - d.low;
        const pct = a + ((d.high - threshold) / range) * d.percent;
        return a + pct;
      }
      return a;
    }, 0.0);
    thresholdText.text(
      `Approximately ${canAfford.toFixed(
        2
      )}% population would be approved for this home`
    );

    // append the rectangles for the bar chart
    const bars = svg
      .selectAll(".bar")
      .data(incomeDistribution)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.label);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.percent);
      })
      .attr("height", function(d) {
        return height - y(d.percent);
      })
      .on("mouseover", toolTip.show)
      .on("mouseout", toolTip.hide);
    const noFill = bars.filter(
      d => this.affordablePercentage(d, threshold) === 0
    );
    noFill.attr("class", styles["not-affordable"]);

    const solidFill = bars.filter(
      d => this.affordablePercentage(d, threshold) === 100
    );
    solidFill.attr("class", styles.affordable);

    // Define the gradient for partial fil bar
    const gradient = svg
      .append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    // Define the gradient colors
    gradient
      .append("svg:stop")
      .attr("offset", "0%")
      .attr("class", styles["not-affordable"]);

    const partialFill = bars.filter(d => {
      const x = this.affordablePercentage(d, threshold);
      return x < 100 && x > 0;
    });
    partialFill.attr("fill", d => {
      const pct = this.affordablePercentage(d, threshold);
      gradient
        .append("svg:stop")
        .attr("offset", 100 - pct + "%")
        .attr("class", styles["not-affordable"]);
      gradient
        .append("svg:stop")
        .attr("offset", 100 - pct + "%")
        .attr("class", styles.affordable);
      gradient
        .append("svg:stop")
        .attr("offset", "100%")
        .attr("class", styles.affordable);
      return "url(#gradient)";
    });

    // // add the x Axis
    const xAxisFormat = this.xAxisFormat.bind(this);
    const xAxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        axisBottom(x).tickFormat(function(d) {
          return xAxisFormat(d);
        })
      );
    xAxis.selectAll("text").attr("class", styles.axis);

    // add the y Axis
    const yAxis = svg.append("g").call(
      axisLeft(y).tickFormat(function(d) {
        return d + "%";
      })
    );
    yAxis.attr("class", styles.axis);

    // add label x Axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
      )
      .attr("class", styles["axis-label"])
      .text("Household Income (in thousands)");

    // add label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("class", styles["axis-label"])
      .text("Percent of All Households");
  };
}

export default Graph;
