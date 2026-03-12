module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15000,
  testMatch: ["**/src/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};