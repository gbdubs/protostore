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
    this.excludedMessages = [
    
    ];
  }
  handleLog(log: (t?: any, ...p: any[]) => void, template: string, ...optionalParams: any[]): void {
    if (!this.excludedMessages.some((excludedMessage) => template.includes(excludedMessage))) {
      log(template, optionalParams);
    }
  }
  doBeforeAll(): void {
    console.error = (t: string, ...p: any[]) => this.handleLog(this.originalError, t, p);
    console.warn = (t: string, ...p: any[]) => this.handleLog(this.originalError, t, p);
    console.log = (t: string, ...p: any[]) => this.handleLog(this.originalError, t, p);
  }
  doBeforeEach(): void {
    global.matchMedia =
      global.matchMedia || function () {
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
    beforeAll(this.doBeforeAll);
    beforeEach(this.doBeforeEach);
    afterEach(this.doAfterEach);
    afterAll(this.doAfterAll);
  }
}


export class InputTestCaseHelper {
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
