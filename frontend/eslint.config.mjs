import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },

    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

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

      "react/react-in-jsx-scope": "off",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "ignore" },
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      "no-unused-vars": "off",
      "prefer-const": "off",

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
  },
];
