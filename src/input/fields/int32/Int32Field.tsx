import "./Int32Field.css";

import BasicField from "../BasicField";
import { FieldProps } from "../FieldProps";

import { InputNumber } from "antd";

class Int32Field extends BasicField<FieldProps> {
  createField(fieldProps: FieldProps): JSX.Element {
    return <InputNumber className="protostore-input-field-int32-input" />;
  }
}

export default Int32Field;
