import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { spy, SinonSpy } from "sinon";

import { Form } from "antd";
import { Root, Message } from "protobufjs";

import { default as compiledProtobufBundle } from "../src/proto/bundle.json";
import Input from "../src/input/Input";

export class InputTestClassHelper {
  originalError: (message?: any, ...optionalParams: any[]) => void;
  originalWarn: (message?: any, ...optionalParams: any[]) => void;
  originalLog: (message?: any, ...optionalParams: any[]) => void;
  excludedMessages: string[];
  constructor() {
    this.originalError = console.error;
    this.originalWarn = console.warn;
    this.originalLog = console.log;
    this.excludedMessages = ["inside a test was not wrapped in act"];
  }
  handleLog(log: (t?: any, ...p: any[]) => void, template: string, ...optionalParams: any[]): void {
    if (!this.excludedMessages.some((excludedMessage) => template.includes(excludedMessage))) {
      log(template, optionalParams);
    }
  }
  doBeforeAll(): void {
    console.error = (t: string, ...p: any[]) => this.handleLog(this.originalError, t, p);
    console.warn = (t: string, ...p: any[]) => this.handleLog(this.originalWarn, t, p);
    console.log = (t: string, ...p: any[]) => this.handleLog(this.originalLog, t, p);
  }
  doBeforeEach(): void {
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
  }
  doAfterEach(): void {
    cleanup();
  }
  doAfterAll(): void {
    console.error = this.originalError;
    console.warn = this.originalWarn;
    console.log = this.originalLog;
  }
  addAllSetupAndTearDowns(): void {
    const helper = this;
    beforeAll(() => helper.doBeforeAll());
    beforeEach(() => helper.doBeforeEach());
    afterEach(() => helper.doAfterEach());
    afterAll(() => helper.doAfterAll());
  }
}

export class InputTestCaseHelper {
  mockCallback: SinonSpy<any[], any>;
  component: ReactWrapper;

  constructor(target: string) {
    this.mockCallback = spy();
    this.component = mount(<Input target={target} callback={this.mockCallback} />);
  }

  static _clickableTypes = ["button", "a", "icon"];

  click(testId: string) {
    const selector = "[data-testid='" + testId + "']";
    const filter = (rw: ReactWrapper) => InputTestCaseHelper._clickableTypes.includes(rw.name());
    const results = this.component.find(selector).filterWhere(filter);
    if (results.length != 1) {
      throw new Error(`Wanted exactly 1 node, found ${results.length} for selector ${selector}`);
    }
    results.simulate("click");
  }

  static _settableTypes = ["input", "textarea"];
  setValue(testId: string, value: any) {
    const selector = "[data-testid='" + testId + "']";
    const filter = (rw: ReactWrapper) => InputTestCaseHelper._settableTypes.includes(rw.name());
    const results = this.component.find(selector).filterWhere(filter);
    if (results.length != 1) {
      throw new Error(`Wanted exactly 1 node, found ${results.length} for selector ${selector}`);
    }
    results.simulate("change", { target: { value: "" + value } });
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
