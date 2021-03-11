import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Input from "./input/Input";

ReactDOM.render(
  <React.StrictMode>
    <div className="input-wrapper">
      <Input target="com.gradybward.protostore.OuterMessage" />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
