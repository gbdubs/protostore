import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Input from "./input/Input";

const inputProps = {
  target: "com.gradybward.protostore.input.field.message.TestFieldMessageNestedRepeated",
  callback: console.log,
};

ReactDOM.render(
  <React.StrictMode>
    <div className="input-wrapper">
      <Input {...inputProps} />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
