import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Root, Message } from "protobufjs";

import { default as compiledProtobufBundle } from "../../../proto/bundle.json";
import Input from "../../Input";
import Int32Field from "./Int32Field";
import OptionalField from "../optional/OptionalField";
import {
  InputTestClassHelper,
  InputTestCaseHelper,
} from "../../../../testing/InputTestUtils";

configure({ adapter: new Adapter() });

describe("Optional Int32", () => {
  new InputTestClassHelper().addAllSetupAndTearDowns();
  const protobufTarget =
    "com.gradybward.protostore.input.field.int32.TestFieldInt32";
  const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(
    protobufTarget
  );

  test("field is empty", async () => {
    const component = new InputTestCaseHelper(protobufTarget);

    const actual = await component.submit();

    expect(actual).toEqual(protobufType.create({}));
  });

  test("field is set", async () => {
    const fieldName = "myNumber";
    const value = 123456789;
    const valueAsStr = "" + value;
    const component = new InputTestCaseHelper(protobufTarget);

    component.click(OptionalField.testId_set + fieldName);
    component.setValue(Int32Field.testId + fieldName, valueAsStr);

    const actual = await component.submit();

    const expected: any = {};
    expected[fieldName] = value;
    expect(actual).toEqual(protobufType.create(expected));
  });
});
