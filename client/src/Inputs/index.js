import React, { Component } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FilledInput from "@material-ui/core/FilledInput";
import NumberFormatCustom from "./NumberFormatCustom";
import { pctIsAllowed } from "./NumberFormatCustom";
import * as PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const defaultPropertyTax = 0.005;
const defaultInsurance = 0.0033;
const defaultPMI = 0.0075;

class MortgageCalculator extends Component {
  initialize = () => {
    const homePrice = 418000;
    const downPayment = 10;

    return {
      interestRate: 3.75,
      homePrice: homePrice,
      downpayment: 10,
      propertyTaxes: Math.round((homePrice * defaultPropertyTax) / 12),
      insurance: Math.round((homePrice * defaultInsurance) / 12),
      pmi: Math.round(this.pmi(homePrice, downPayment)),
      dti: 28,
      loanTerm: 30,
      payment: 0,
      hoa: 0
    };
  };
  state = this.initialize();

  componentDidMount() {
    this.props.onChangeCallback({ target: { value: this.salaryRequired() } });
  }

  paymentCalculator = ({ downpayment, homePrice, interestRate, loanTerm }) => {
    // TODO extract as helper and add test
    // L[i * ((1 + i) ^ n)]/[((1 + i) ^ n)  - 1]
    const loanAmount =
      downpayment > 0 ? homePrice * (1 - downpayment / 100) : homePrice;
    const i = interestRate / 100 / 12;
    const itoN = Math.pow(1 + i, loanTerm * 12);
    const payment = loanAmount * ((i * itoN) / (itoN - 1));
    return Math.round(payment);
  };

  totalPayment = ({
    downpayment,
    homePrice,
    interestRate,
    hoa,
    propertyTaxes,
    insurance,
    pmi,
    loanTerm
  }) => {
    return (
      this.paymentCalculator({
        downpayment,
        homePrice,
        interestRate,
        loanTerm
      }) +
      propertyTaxes +
      insurance +
      pmi +
      hoa
    );
  };

  salaryRequired = () => {
    return Math.round(
      (12 * this.totalPayment(this.state)) / (this.state.dti / 100)
    );
  };

  handleChange = prop => event => {
    if (prop === "homePrice") {
      const newHomePrice = event.target.value;
      return this.setState({
        propertyTaxes: Math.round((newHomePrice * defaultPropertyTax) / 12),
        insurance: Math.round((newHomePrice * defaultInsurance) / 12),
        pmi: Math.round(this.pmi(newHomePrice, this.state.downpayment)),
        homePrice: newHomePrice
      });
    }
    if (prop === "downpayment") {
      const downpayment = event.target.value;
      return this.setState({
        pmi: Math.round(this.pmi(this.state.homePrice, downpayment)),
        downpayment: downpayment
      });
    }
    this.setState({ [prop]: event.target.value });
  };

  pmi(homePrice, downpayment) {
    return downpayment < 20
      ? (this.loanAmount(homePrice, downpayment) * defaultPMI) / 12
      : 0;
  }

  loanAmount(homePrice, downpayment) {
    return downpayment > 0 ? homePrice * (1 - downpayment / 100) : homePrice;
  }

  render() {
    const { classes, onChangeCallback } = this.props;
    const salaryRequired = this.salaryRequired();
    return (
      <div className={classes.root}>
        <div>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <OutlinedInput
              id="outlined-adornment-home-price"
              value={this.state.homePrice}
              onChange={this.handleChange("homePrice")}
              aria-describedby="outlined-home-price-helper-text"
              inputComponent={NumberFormatCustom}
              inputProps={{
                prefix: "$",
                "aria-label": "home price"
              }}
            />
            <FormHelperText id="outlined-home-price-helper-text">
              Home Price
            </FormHelperText>
          </FormControl>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <OutlinedInput
              id="outlined-adornment-interest-rate"
              value={this.state.interestRate}
              onChange={this.handleChange("interestRate")}
              aria-describedby="outlined-interest-rate-text"
              inputComponent={NumberFormatCustom}
              inputProps={{
                suffix: "%",
                isAllowed: pctIsAllowed,
                "aria-label": "interest rate"
              }}
            />
            <FormHelperText id="outlined-interest-rate-helper-text">
              Interest Rate
            </FormHelperText>
          </FormControl>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <OutlinedInput
              id="outlined-adornment-downpayment"
              value={this.state.downpayment}
              onChange={this.handleChange("downpayment")}
              aria-describedby="outlined-downpayment-text"
              inputComponent={NumberFormatCustom}
              inputProps={{
                suffix: "%",
                isAllowed: pctIsAllowed,
                "aria-label": "downpayment"
              }}
            />
            <FormHelperText id="outlined-downpayment-helper-text">
              Downpayment
            </FormHelperText>
          </FormControl>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={this.state.loanTerm}
              onChange={this.handleChange("loanTerm")}
            >
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
            <FormHelperText id="outlined-loanterm-helper-text">
              Loan Term
            </FormHelperText>
          </FormControl>
          <div>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <OutlinedInput
                id="outlined-adornment-property-taxes"
                value={this.state.propertyTaxes}
                onChange={this.handleChange("propertyTaxes")}
                aria-describedby="outlined-property-taxes-text"
                inputComponent={NumberFormatCustom}
                inputProps={{
                  prefix: "$",
                  "aria-label": "property-taxes"
                }}
              />
              <FormHelperText id="outlined-property-taxes-helper-text">
                Property Taxes (monthly)
              </FormHelperText>
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <OutlinedInput
                id="outlined-adornment-insurance"
                value={this.state.insurance}
                onChange={this.handleChange("insurance")}
                inputComponent={NumberFormatCustom}
                aria-describedby="outlined-insurance-text"
                inputProps={{
                  prefix: "$",
                  "aria-label": "insurance"
                }}
              />
              <FormHelperText id="outlined-insurance-helper-text">
                Insurance (monthly)
              </FormHelperText>
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <OutlinedInput
                id="outlined-adornment-pmi"
                value={this.state.pmi}
                onChange={this.handleChange("pmi")}
                inputComponent={NumberFormatCustom}
                aria-describedby="outlined-pmi-text"
                inputProps={{
                  prefix: "$",
                  "aria-label": "pmi"
                }}
              />
              <FormHelperText id="outlined-pmi-helper-text">
                PMI (monthly)
              </FormHelperText>
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <OutlinedInput
                id="outlined-adornment-hoa"
                value={this.state.hoa}
                onChange={this.handleChange("hoa")}
                inputComponent={NumberFormatCustom}
                aria-describedby="outlined-hoa-text"
                inputProps={{
                  prefix: "$",
                  "aria-label": "hoa"
                }}
              />
              <FormHelperText id="outlined-hoa-helper-text">
                HOA (monthly)
              </FormHelperText>
            </FormControl>
            <div>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <OutlinedInput
                  id="outlined-adornment-qualifying-dti"
                  value={this.state.dti}
                  onChange={this.handleChange("dti")}
                  aria-describedby="outlined-qualifying-dti-text"
                  inputComponent={NumberFormatCustom}
                  inputProps={{
                    isAllowed: pctIsAllowed,
                    suffix: "%",
                    "aria-label": "qualifying dti"
                  }}
                />
                <FormHelperText id="outlined-dti-helper-text">
                  DTI (max qualifying DTI)
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <FilledInput
                  id="outlined-adornment-total-payment"
                  value={this.totalPayment(this.state)}
                  readOnly={true}
                  aria-describedby="outlined-qualifying-total-payment-text"
                  inputComponent={NumberFormatCustom}
                  inputProps={{
                    prefix: "$",
                    "aria-label": "total payment"
                  }}
                />
                <FormHelperText id="outlined-total-payment-helper-text">
                  Total Payment: (Mortgage + Property Taxes + Insurance + PMI +
                  HOA)
                </FormHelperText>
              </FormControl>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <FilledInput
                  id="outlined-adornment-salary-required"
                  value={salaryRequired}
                  onChange={onChangeCallback}
                  readOnly={true}
                  aria-describedby="outlined-qualifying-salary-required-text"
                  inputComponent={NumberFormatCustom}
                  inputProps={{
                    prefix: "$",
                    "aria-label": "salary required"
                  }}
                />
                <FormHelperText id="outlined-salary required-helper-text">
                  Salary required for loan (Total Payment / DTI)
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MortgageCalculator.propTypes = { onChangeCallback: PropTypes.any };

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: 200
  }
}));

export default function MortgageCalculatorStyled(props) {
  const classes = useStyles();
  return <MortgageCalculator {...props} classes={classes} />;
}
