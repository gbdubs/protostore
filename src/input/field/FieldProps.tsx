import { NamePath } from "./NamePath";

export interface FieldProps {
  // The definitive path to the field. Can be used in all non-antd contexts, including testing and
  // logging. This field is unique within a form.
  path: NamePath;

  // Form-name of the field. May be truncated if it is on/in an isListField item. Should exclusively
  // be used on the FormItem's name prop: ``<Form.Item name={fieldProps.namePath}>. This may not be
  // unique within a form.
  name: NamePath;

  // The user-facing name of the field.
  label: string;

  // Whether the field is repeated.
  repeated: boolean;

  // Whether this field is a nested message.
  nested: boolean;
}
