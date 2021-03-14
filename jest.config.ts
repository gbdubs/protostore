/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  roots: ["<rootDir>/src"],

  clearMocks: true,

  collectCoverage: true,
  coverageProvider: "v8",
  coverageDirectory: "coverage",

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/testing/styleMock.js",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
