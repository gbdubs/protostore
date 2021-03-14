import { FieldProps } from "./FieldProps";

import OptionalField from "./optional/OptionalField";
import RepeatedField from "./repeated/RepeatedField";

import React from "react";

class BasicField<T extends FieldProps> extends React.Component<T, {}> {
  createField(fieldProps: T): JSX.Element {
    throw new Error("createField must be implemented");
  }

  render() {
    if (this.props.repeated) {
      return <RepeatedField fieldProps={this.props} inputFn={this.createField} />;
    }
    return <OptionalField fieldProps={this.props} inputFn={this.createField} />;
  }
}

export default BasicField;
