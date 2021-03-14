import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Root, Message } from "protobufjs";

import { default as compiledProtobufBundle } from "../../../proto/bundle.json";
import Input from "../../Input";
import StringField from "./StringField";
import OptionalField from "../optional/OptionalField";
import RepeatedField from "../repeated/RepeatedField";
import { InputTestClassHelper, InputTestCaseHelper } from "../../../../testing/InputTestUtils";

configure({ adapter: new Adapter() });

describe.skip("String", () => {

  describe("Optional String", () => {
    new InputTestClassHelper().addAllSetupAndTearDowns();
    const protobufTarget = "com.gradybward.protostore.input.field.string.TestFieldStringOptional";
    const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(protobufTarget);
    const fieldName = "myString";
    const fieldValue = "Covfefe";

    test("field is missing", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      const actual = await component.submit();

      const expected: any = {};
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("field is empty", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + fieldName);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = undefined;
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("field is set", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + fieldName);
      component.setValue(StringField.testId + fieldName, fieldValue);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = fieldValue;
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("delete button works", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + fieldName);
      component.setValue(StringField.testId + fieldName, fieldValue);
      component.click(OptionalField.testId_delete + fieldName);
      const actual = await component.submit();

      const expected: any = {};
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("delete button clears the content", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + fieldName);
      component.setValue(StringField.testId + fieldName, fieldValue);
      component.click(OptionalField.testId_delete + fieldName);
      component.click(OptionalField.testId_set + fieldName);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = undefined;
      expect(actual).toEqual(protobufType.create(expected));
    });
  });

  describe("Repeated String", () => {
    new InputTestClassHelper().addAllSetupAndTearDowns();
    const protobufTarget = "com.gradybward.protostore.input.field.string.TestFieldStringRepeated";
    const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(protobufTarget);
    const fieldName = "myStrangz";

    test("field is empty", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      const actual = await component.submit();

      expect(actual).toEqual(protobufType.create({}));
    });

    test("empty elements are included", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [undefined, undefined, undefined, undefined, undefined];
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("field has one value", async () => {
      const value = "Guadalajara";
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",0", value);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [value];
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("field has multiple values", async () => {
      const value0 = "Guadalajara";
      const value1 = "TippyTaps";
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",1", value1);
      component.setValue(StringField.testId + fieldName + ",0", value0);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [value0, value1];
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("delete button works", async () => {
      const value0 = "I";
      const value1 = "Don't";
      const value2 = "Love Guaddo with all of my heart";
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",0", value0);
      component.click(RepeatedField.testId_add + fieldName);
      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",2", value2);
      component.setValue(StringField.testId + fieldName + ",1", value1);
      component.click(RepeatedField.testId_delete + fieldName + ",1");
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [value0, value2];
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("deleted content is cleared", async () => {
      const value = "Negative Energy";
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",0", value);
      component.click(RepeatedField.testId_delete + fieldName + ",0");
      component.click(RepeatedField.testId_add + fieldName);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [undefined];
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("change content retains later values", async () => {
      const oldValue = "Donald Trump is the President of the US";
      const newValue = "Joe Biden is the President of the US";
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(RepeatedField.testId_add + fieldName);
      component.setValue(StringField.testId + fieldName + ",0", oldValue);
      component.setValue(StringField.testId + fieldName + ",0", newValue);
      const actual = await component.submit();

      const expected: any = {};
      expected[fieldName] = [newValue];
      expect(actual).toEqual(protobufType.create(expected));
    });
  });
});