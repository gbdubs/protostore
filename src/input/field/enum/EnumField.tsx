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
      const testId = EnumField.testId_option + fieldProps.path + ":" + option;
      options.push(
        <Select.Option key={i} value={option} data-testid={testId}> 
          {option}
        </Select.Option>
      );
    }
    return (
      <Select
        showSearch
        className="protostore-input-field-enum-input"
        data-testid={EnumField.testId_select + fieldProps.path}
      >
        {options}
      </Select>
    );
  }
  static testId_select = "protostore-input-field-enum-select:";
  static testId_option = "protostore-input-field-enum-option:";
}

export default EnumField;
