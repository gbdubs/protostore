import "./StringField.css";

import BasicField from "../BasicField";
import { FieldProps } from "../FieldProps";

import { Input } from "antd";
const { TextArea } = Input;

class StringField extends BasicField<FieldProps> {
  createField(fieldProps: FieldProps): JSX.Element {
    return (
      <TextArea
        autoSize
        className="protostore-input-field-string-input"
        data-testid={StringField.testId + fieldProps.path}
      />
    );
  }

  static testId = "protostore-input-field-string:";
}

export default StringField;
