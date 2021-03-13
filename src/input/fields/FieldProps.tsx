import { NamePath } from "./NamePath";

export interface FieldProps {
  key: string;
  // the path to the field ["outer_message", "inner_message", "repeated_field", "0"]
  namePath: NamePath;
  // The name of the field.
  label: string;
  // Whether the field is repeated.
  repeated: boolean;
  // Whether this field is a nested message.
  nested: boolean;
}
