import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { spy, SinonSpy } from "sinon";

import { Form } from "antd";
import { Root, Message } from "protobufjs";

import { default as compiledProtobufBundle } from "../proto/bundle.json";
import Input from "./Input";
import Int32Field from "./fields/int32/Int32Field";
import OptionalField from "./fields/optional/OptionalField";
import StringField from "./fields/string/StringField";

configure({ adapter: new Adapter() });

class InputTestCase {
  mockCallback: SinonSpy<any[], any>;
  component: ReactWrapper;

  constructor(target: string) {
    this.mockCallback = spy();
    this.component = mount(
      <Input target={target} callback={this.mockCallback} />
    );
  }

  click(type: string, testId: string) {
    const selector = type + '[data-testid="' + testId + '"]';
    this.component.find(selector).simulate("click");
  }

  setValue(type: string, testId: string, value: any) {
    const selector = type + '[data-testid="' + testId + '"]';
    this.component
      .find(selector)
      .simulate("change", { target: { value: value } });
  }

  async submit(): Promise<Message> {
    const selector = "button[data-testid='protostore-submit']";
    this.component.find(selector).simulate("submit");
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    }); // Forces the action queue to run out.
    this.component.update(); // Forces an update to the component.
    expect(this.mockCallback.called).toBeTruthy();
    const result = this.mockCallback.getCalls()[0].args[0];
    return result;
  }
}

const commonBeforeEach = () => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    };
};

describe("OptionalSimpleFields", () => {
  beforeEach(commonBeforeEach);
  afterEach(cleanup);
  const protobufTarget =
    "com.gradybward.protostore.input.test.OptionalSimpleFields";
  const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(
    protobufTarget
  );

  test("empty", async () => {
    const value = "Covfefe";
    const component = new InputTestCase(protobufTarget);

    const actual = await component.submit();

    expect(actual).toEqual(protobufType.create({}));
  });

  test("string field", async () => {
    const fieldName = "stringField";
    const value = "Covfefe";
    const component = new InputTestCase(protobufTarget);
    component.click("button", OptionalField.testId_set + fieldName);
    component.setValue("textarea", StringField.testId + fieldName, value);

    const actual = await component.submit();

    const expected: any = {};
    expected[fieldName] = value;
    expect(actual).toEqual(protobufType.create(expected));
  });

  test("int32 field", async () => {
    const fieldName = "int_32Field";
    const value = 123456789;
    const valueAsStr = "" + value;
    const component = new InputTestCase(protobufTarget);

    component.click("button", OptionalField.testId_set + fieldName);
    component.setValue("input", Int32Field.testId + fieldName, valueAsStr);

    const actual = await component.submit();

    const expected: any = {};
    expected[fieldName] = value;
    expect(actual).toEqual(protobufType.create(expected));
  });
});
