import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Graph from "../Graph";
import Inputs from "../Inputs";
import SearchBox from "../SelectMSA";
import styles from "./index.module.scss";

class Main extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
      </Router>
    );
  }
}

class App extends Component {
  state = { msa: "", salaryRequired: 0 };
  handleRequiredSalaryChange = event => {
    if (event.target.value) {
      this.setState({ salaryRequired: event.target.value });
    }
  };

  handleMSAChange = (event, values) => {
    if (values && values.msa !== null) {
      this.setState({ msa: values.msa });
    }
  };

  render() {
    return (
      <div style={{ padding: "40px" }}>
        <div className={styles.row}>
          <Text />
        </div>
        <div className={styles.row}>
          <Inputs onChangeCallback={this.handleRequiredSalaryChange} />
        </div>
        <div className={styles.row}>
          <SearchBox
            onChangecallback={this.handleMSAChange}
            msa={this.state.msa}
          />
        </div>
        <Graph msa={this.state.msa} threshold={this.state.salaryRequired} />
      </div>
    );
  }
}

function Text() {
  return (
    <div style={{ width: 800 }}>
      <h1>Affordability Calculator</h1>
      <p>
        Estimate the income required for a particular home by inputting the
        various parameters (mortgage rate, downpayment, loan term, etc.). Then
        based on the qualifying DTI (Debt-to-Income) chosen, a required salary
        will be calculated.
      </p>
      <p>
        Selecting the MSA associated with the home calculates the percentage of
        a given MSAs population would be able to qualify for a loan to buy this
        home.
      </p>
      <p>
        Additionally, you can adjust the loan parameter to better understand the
        sensitivity to various parameters such as interest rates.
      </p>
      <sub>
        1. Based on{" "}
        <a
          href={
            "https://www.nahb.org/News-and-Economics/Housing-Economics/Housings-Economic-Impact/Households-Priced-Out-by-Higher-House-Prices-and-Interest-Rates"
          }
        >
          NAHB's "priced-out"
        </a>{" "}
        analysis
      </sub>
      <br />
      <sub>
        2. Income distribution by MSA generated using{" "}
        <a
          href={
            "https://www.census.gov/data/developers/data-sets/acs-1year.html"
          }
        >
          2018 American Community Survey API{" "}
        </a>
      </sub>
      <br />
      <sub>
        3. A uniform distribution is assumed within income buckets. The 200+
        bucket is assumed to be 200k-1mm.
      </sub>
    </div>
  );
}
export default Main;
