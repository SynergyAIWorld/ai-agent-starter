import baseConfig from "@acme/eslint-config/base";
import reactConfig from "@acme/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["*/.js", "**/*.js", "**/node_modules", "**/dist"],
  },
  ...baseConfig,
  ...reactConfig,
];
