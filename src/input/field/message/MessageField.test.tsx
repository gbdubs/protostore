import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Root, Message } from "protobufjs";

import { default as compiledProtobufBundle } from "../../../proto/bundle.json";
import Input from "../../Input";
import StringField from "../string/StringField";
import OptionalField from "../optional/OptionalField";
import RepeatedField from "../repeated/RepeatedField";
import { InputTestClassHelper, InputTestCaseHelper } from "../../../../testing/InputTestUtils";

configure({ adapter: new Adapter() });

describe("Nested Messages", () => {

  describe.skip("Optional Nested Messages", () => {
    new InputTestClassHelper().addAllSetupAndTearDowns();
    const protobufTarget = "com.gradybward.protostore.input.field.message.TestFieldMessageNested";
    const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(protobufTarget);
  
    const nestedMessageFieldName = "nested";
    const nestedMessageStringFieldName = "nested,nestedString";
    const nestedNestedMessageFieldName = "nested,nestedNested";
    const nestedNestedMessageStringFieldName = "nested,nestedNested,nestedNestedString";

    test("empty message", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      const actual = await component.submit();

      const expected: any = {};
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("nested field present and empty", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      const actual = await component.submit();

      const expected: any = {};
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("nested field present and populated", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const stringValue = "Hello, World!";

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedMessageStringFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.setValue(StringField.testId + nestedMessageStringFieldName, stringValue);
      const actual = await component.submit();

      const expected = {
        nested: {
          nestedString: stringValue
        }
      };
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("nested nested field present and populated", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const stringValue = "Hello, World!";

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, stringValue);
      const actual = await component.submit();

      const expected = {
        nested: {
          nestedNested: {
            nestedNestedString: stringValue
          }
        }
      };
      expect(actual).toEqual(protobufType.create(expected));
    });
  
    test("fully populated with multiple value changes", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const stringValue0 = "Hello";
      const stringValue1 = "World";

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedMessageStringFieldName, "Throw me away!");
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, "I'm Garbage!");
      component.setValue(StringField.testId + nestedMessageStringFieldName, stringValue0);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, stringValue1);
      const actual = await component.submit();

      const expected = {
        nested: {
          nestedString: stringValue0,
          nestedNested: {
            nestedNestedString: stringValue1
          }
        }
      };
      expect(actual).toEqual(protobufType.create(expected));
    });
    
    test("nested message's field's delete button clears value", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const stringValue0 = "Hello World";
      const stringValue1 = "Best to not see me in the output";

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedMessageStringFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, stringValue0);
      component.setValue(StringField.testId + nestedMessageStringFieldName, stringValue1);
      component.click(OptionalField.testId_delete + nestedMessageStringFieldName);
      
      const actual = await component.submit();

      const expected = {
        nested: {
          nestedNested: {
            nestedNestedString: stringValue0
          }
        }
      };
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("nested message delete button clears values", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const stringValue0 = "Hello World";
      const stringValue1 = "Best to not see me in the output";

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedMessageStringFieldName, stringValue0);
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, stringValue1);
      component.click(OptionalField.testId_delete + nestedNestedMessageFieldName);
      
      const actual = await component.submit();

      const expected = {
        nested: {
          nestedString: stringValue0
        }
      };
      expect(actual).toEqual(protobufType.create(expected));
    });
    
    test("top level delete button gets rid of all content", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      component.click(OptionalField.testId_set + nestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedMessageStringFieldName, "Throw me away!");
      component.click(OptionalField.testId_set + nestedNestedMessageFieldName);
      component.click(OptionalField.testId_set + nestedNestedMessageStringFieldName);
      component.setValue(StringField.testId + nestedNestedMessageStringFieldName, "I'm Garbage!");
      component.click(OptionalField.testId_delete + nestedMessageFieldName);
      const actual = await component.submit();

      const expected = {};
      expect(actual).toEqual(protobufType.create(expected));
    });
  });
  
  describe("Repeated Nested Messages", () => {
    new InputTestClassHelper().addAllSetupAndTearDowns();
    const protobufTarget = "com.gradybward.protostore.input.field.message.TestFieldMessageNestedRepeated";
    const protobufType = Root.fromJSON(compiledProtobufBundle).lookupType(protobufTarget);

    test("empty message", async () => {
      const component = new InputTestCaseHelper(protobufTarget);

      const actual = await component.submit();

      const expected: any = {};
      expect(actual).toEqual(protobufType.create(expected));
    });

    test("single element in all repeated fields", async () => {
      const component = new InputTestCaseHelper(protobufTarget);
      const value0 = "I";
      const value1 = "Really";
      const value2 = "Love";
      const value3 = "To";
      const value4 = "Ski";
      const value5 = "!";

      component.click(RepeatedField.testId_add + "nested");
      component.click(OptionalField.testId_set + "nested,0,myString");
      component.setValue(StringField.testId + "nested,0,myString", value0);
      component.click(RepeatedField.testId_add + "nested,0,repeatedString");
      component.setValue(StringField.testId  + "nested,0,repeatedString,0", value1);
      component.click(OptionalField.testId_set + "nested,0,nestedNested");
      component.click(OptionalField.testId_set + "nested,0,nestedNested,myString");
      component.setValue(StringField.testId + "nested,0,nestedNested,myString", value2);
      component.click(RepeatedField.testId_add + "nested,0,nestedNested,repeatedString");
      component.setValue(StringField.testId + "nested,0,nestedNested,repeatedString,0" ,value3);
      component.click(RepeatedField.testId_add + "nested,0,repeatedNestedNested");
      component.click(OptionalField.testId_set + "nested,0,repeatedNestedNested,0,myString");
      component.setValue(StringField.testId + "nested,0,repeatedNestedNested,0,myString", value4);
      component.click(RepeatedField.testId_add + "nested,0,repeatedNestedNested,0,repeatedString");
      component.setValue(StringField.testId + "nested,0,repeatedNestedNested,0,repeatedString,0", value5);
      
      const actual = await component.submit();

      const expected: any = {
        nested: [
          {
            myString: value0,
            repeatedString: [
              value1,
            ],
            nestedNested: {
              myString: value2,
              repeatedString: [
                value3,
              ],
            },
            repeatedNestedNested: [
              {
                myString: value4,
                repeatedString: [
                  value5
                ],
              },
            ],
          },
        ],
      };
      expect(actual).toEqual(protobufType.create(expected));
    });
  });
});