import "./Input.css";
import React from "react";
import { Root, Message } from "protobufjs";
import { default as compiledProtobufBundle } from "../proto/bundle.json";
import MessageField from "./field/message/MessageField";
import { Button, Card, Form } from "antd";

type InputProps = {
  target: string;
  callback: (m: Message) => void;
};

function Input(props: InputProps) {
  const protobufRoot = Root.fromJSON(compiledProtobufBundle);
  const formProps = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
    onFinish: (fromForm: any) => {
      props.callback(parseToProto(protobufRoot, props.target, fromForm));
    },
  };
  const messageFieldProps = {
    target: props.target,
    protobufRoot: protobufRoot,
    prefix: [],
  };
  const tailProps = {
    wrapperCol: { offset: 3 },
  };
  return (
    <Card title={"Input for " + props.target} className="protostore-input">
      <Form {...formProps} data-testid="protostore-input">
        <MessageField {...messageFieldProps} />
        <Form.Item {...tailProps}>
          <Button type="primary" htmlType="submit" data-testid="protostore-submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function parseToProto(protobufRoot: Root, target: string, fromForm: any): Message {
  const TargetMessageType = protobufRoot.lookupType(target);
  const properties: any = {};
  for (let key in fromForm) {
    addKeyToRecursiveMap(key, fromForm[key], properties);
  }
  return TargetMessageType.create(properties);
}

function addKeyToRecursiveMap(key: string, value: any, dict: any) {
  const separatorIndex = key.indexOf(".");
  if (separatorIndex === -1) {
    if (!(key in dict)) {
      dict[key] = value;
    }
  } else {
    const prefix = key.substring(0, separatorIndex);
    const suffix = key.substring(separatorIndex + 1);
    if (!(prefix in dict) || dict[prefix].constructor !== Object) {
      dict[prefix] = {};
    }
    addKeyToRecursiveMap(suffix, value, dict[prefix]);
  }
}

export default Input;
