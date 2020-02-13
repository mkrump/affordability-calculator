import NumberFormat from "react-number-format";
import * as PropTypes from "prop-types";
import React from "react";

function NumberFormatCustom(props) {
  const { inputRef, onChange, prefix, suffix, isAllowed, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.floatValue
          }
        });
      }}
      thousandSeparator
      isNumericString
      isAllowed={isAllowed}
      prefix={prefix}
      suffix={suffix}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export function pctIsAllowed(values) {
  return (
    (values.floatValue <= 100 && values.floatValue >= 0) ||
    values.formattedValue === ""
  );
}

export default NumberFormatCustom;
