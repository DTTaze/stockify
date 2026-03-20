import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    plugins: ["prettier", "simple-import-sort"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
          semi: true,
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "ignore" },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'ImportDeclaration[importKind!="type"][specifiers.0.type="ImportNamespaceSpecifier"]',
          message:
            "Do not use namespace imports (*). Import only what you need to reduce bundle size.",
        },
      ],
      "max-lines": [
        "error",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  }),
];

export default eslintConfig;
