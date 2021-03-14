import "./RepeatedField.css";

import { FieldProps } from "../FieldProps";

import { Button, Form } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";

interface RepeatedFieldProps<T extends FieldProps> {
  fieldProps: T;
  inputFn: (fp: T) => JSX.Element;
}

class RepeatedField<T extends FieldProps> extends React.Component<
  RepeatedFieldProps<T>
> {
  render() {
    return (
      <Form.Item
        label={this.props.fieldProps.label}
        className="repeated-field-item-wrapper"
      >
        <Form.List name={this.props.fieldProps.namePath}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                const modifiedFieldProps = Object.assign(
                  {},
                  this.props.fieldProps
                );
                modifiedFieldProps.namePath = [index];
                modifiedFieldProps.repeated = false;
                return (
                  <div key={field.key} className="repeated-field-item">
                    {this.props.inputFn(modifiedFieldProps)}
                    <Button
                      className="protostore-input-delete-btn"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
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
}

export default RepeatedField;
