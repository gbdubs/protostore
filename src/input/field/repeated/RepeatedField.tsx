import "./RepeatedField.css";

import { FieldProps } from "../FieldProps";

import { Button, Form } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";

interface RepeatedFieldProps<T extends FieldProps> {
  fieldProps: T;
  inputFn: (fp: T) => JSX.Element;
}

class RepeatedField<T extends FieldProps> extends React.Component<RepeatedFieldProps<T>> {
  render() {
    return (
      <Form.Item label={this.props.fieldProps.label} className="repeated-field-item-wrapper">
        <Form.List name={this.props.fieldProps.name}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                const modifiedFieldProps = Object.assign({}, this.props.fieldProps);
                // Also probably a bad line here for the repeated nested case.
                modifiedFieldProps.name = [index];
                modifiedFieldProps.path = [...this.props.fieldProps.path, index];
                modifiedFieldProps.repeated = false;
                return (
                  <div key={field.key} className="repeated-field-item">
                    {/* This right here is the line that needs modification for repeated */}
                    <Form.Item name={modifiedFieldProps.name} noStyle isListField>
                      {this.props.inputFn(modifiedFieldProps)}
                    </Form.Item>
                    <Button
                      className="protostore-input-delete-btn"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                      data-testid={RepeatedField.testId_delete + modifiedFieldProps.path}
                    />
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  data-testid={RepeatedField.testId_add + this.props.fieldProps.path}
                >
                  {"Add " + this.props.fieldProps.label}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }

  static testId_add = "protostore-input-field-repeated-add:";
  static testId_item = "protostore-input-field-repeated-item:";
  static testId_delete = "protostore-input-field-repeated-delete:";
}

export default RepeatedField;
