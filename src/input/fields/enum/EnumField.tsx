import "./EnumField.css";

import BasicField from "../BasicField";
import { FieldProps } from "../FieldProps";

import { Select } from "antd";
import { Root } from "protobufjs";

interface EnumFieldProps extends FieldProps {
  protobufRoot: Root;
  target: string;
}

class EnumField extends BasicField<EnumFieldProps> {
  createField(fieldProps: EnumFieldProps): JSX.Element {
    const optionsMap = fieldProps.protobufRoot.lookupEnum(fieldProps.target)
      .valuesById;
    const options = [];
    for (let i in optionsMap) {
      const option = optionsMap[i];
      options.push(<Select.Option value={option}>{option}</Select.Option>);
    }
    return (
      <Select showSearch className="protostore-input-field-enum-input">
        {options}
      </Select>
    );
  }
}

export default EnumField;
