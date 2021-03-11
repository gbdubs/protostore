import "./OptionalField.css";

import { FieldProps } from "../FieldProps";

import { Button, Form } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";

interface OptionalFieldProps<T extends FieldProps> {
  fieldProps: T;
  inputFn: (fp: T) => JSX.Element;
}

interface OptionalFieldState {
  set: boolean;
}

class OptionalField<T extends FieldProps> extends React.Component<
  OptionalFieldProps<T>,
  OptionalFieldState
> {
  constructor(props: OptionalFieldProps<T>) {
    super(props);
    this.state = {
      set: false,
    };
  }

  render() {
    if (this.state.set) {
      const name = this.props.fieldProps.nested
        ? undefined
        : this.props.fieldProps.namePath;
      return (
        <Form.Item label={this.props.fieldProps.label} labelCol={{ span: 3 }}>
          <Form.Item name={name} noStyle>
            {this.props.inputFn(this.props.fieldProps)}
          </Form.Item>
          <Button
            type="ghost"
            onClick={() => this.setState({ set: false })}
            icon={<DeleteOutlined />}
            className="protostore-input-delete-btn"
          />
        </Form.Item>
      );
    } else {
      return (
        <div className="protostore-input-optional-omitted-wrapper">
          <Button
            type="dashed"
            onClick={() => this.setState({ set: true })}
            icon={<PlusOutlined />}
            block={true}
          >
            {"Set " + this.props.fieldProps.label}
          </Button>
        </div>
      );
    }
  }
}

export default OptionalField;
