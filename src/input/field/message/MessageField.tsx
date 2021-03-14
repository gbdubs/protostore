import "./MessageField.css";

import { FieldProps } from "../FieldProps";
import { NamePath } from "../NamePath";

import EnumField from "../enum/EnumField";
import Int32Field from "../int32/Int32Field";
import StringField from "../string/StringField";
import OptionalField from "../optional/OptionalField";
import RepeatedField from "../repeated/RepeatedField";

import { Card } from "antd";
import React from "react";
import { Field, Root } from "protobufjs";

type MessageFieldProps = {
  protobufRoot: Root;
  target: string;
  path?: NamePath;
  name?: NamePath;
};

function MessageField(messageFieldProps: MessageFieldProps) {
  const TargetMessage = messageFieldProps.protobufRoot.lookupType(
    messageFieldProps.target
  );

  const fields = TargetMessage.fieldsArray;
  const fieldsToRender: JSX.Element[] = [];
  for (let i in fields) {
    const field = fields[i];
    const namePrefix = messageFieldProps.name
      ? messageFieldProps.name
      : [];
    const name = [...namePrefix, field.name];
    const pathPrefix = messageFieldProps.path
      ? messageFieldProps.path
      : [];
    const path = [...pathPrefix, field.name];
    fieldsToRender.push(
      renderField(i, name, path, field, messageFieldProps.protobufRoot)
    );
  }
  return <>{fieldsToRender}</>;
}

function renderField(
  index: string,
  path: NamePath,
  name: NamePath,
  field: Field,
  protobufRoot: Root
): JSX.Element {
  const itemProps: FieldProps = {
    label: field.name,
    name: name,
    path: path,
    repeated: field.repeated,
    nested: false,
  };
  if (field.type === "string") {
    return <StringField {...itemProps} key={index} />;
  } else if (field.type === "int32") {
    return <Int32Field {...itemProps} key={index} />;
  } else if (isEnum(protobufRoot, field.type)) {
    return (
      <EnumField
        {...itemProps}
        target={field.type}
        protobufRoot={protobufRoot}
        key={index}
      />
    );
  } else if (isNestedMessage(protobufRoot, field.type)) {
    itemProps.nested = true;
    const fn = (fps: FieldProps) => (
      <Card
        type="inner"
        className="protostore-input-field-message-nested-message-card"
      >
        <MessageField
          target={field.type}
          name={fps.name}
          path={fps.path}
          protobufRoot={protobufRoot}
        />
      </Card>
    );

    return (
      <div className="nested-message-wrapper" key={index}>
        {field.repeated ? (
          <RepeatedField fieldProps={itemProps} inputFn={fn} />
        ) : (
          <OptionalField fieldProps={itemProps} inputFn={fn} />
        )}
      </div>
    );
  } else {
    return <p key={index}> Unsupported Type: {field.type} </p>;
  }
}

function isNestedMessage(protobufRoot: Root, typePath: string): boolean {
  try {
    protobufRoot.lookupType(typePath);
    return true;
  } catch (e) {
    return false;
  }
}

function isEnum(protobufRoot: Root, typePath: string): boolean {
  try {
    protobufRoot.lookupEnum(typePath);
    return true;
  } catch (e) {
    return false;
  }
}

export default MessageField;
