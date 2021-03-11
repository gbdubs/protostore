import "./StringField.css";

import BasicField from "../BasicField";
import { FieldProps } from "../FieldProps";

import { Input } from "antd";
const { TextArea } = Input;

class StringField extends BasicField<FieldProps> {
  createField(fieldProps: FieldProps): JSX.Element {
    return (
      <TextArea className="protostore-input-field-string-input" autoSize />
    );
  }
}

export default StringField;
