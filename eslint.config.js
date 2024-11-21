import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...compat.extends(
		"plugin:react/recommended",
		"plugin:unicorn/recommended",
		"prettier",
		"plugin:jsx-a11y/recommended",
		"plugin:react-hooks/recommended"
	),
	{
		ignores: [
			"cdk.out/*",
			"server/build/*",
			"coverage/*",
			"lambdas/**/*.js",
			"build/*",
			"**/node_modules",
			"public/build",
			"build",
			"**/.idea",
			"**/__snapshots__/*",
			"**/.cdk.staging",
			"**/cdk.out",
			"**/postman",
			"**/package-lock.json",
			"coverage",
			"test-results/",
			"playwright-report/",
			"playwright/.cache/",
			"e2e-tests/.auth/",
			"eslint.config.js",
			"postcss.config.js",
		],
	},
	{
		languageOptions: {
			globals: {
				...globals.jest,
			},
		},
	},
	{
		plugins: {
			"unused-imports": unusedImports,
			import: fixupPluginRules(_import),
			"jsx-a11y": jsxA11Y,
			unicorn,
			"sort-keys-fix": sortKeysFix,
			// "testing-library": fixupPluginRules({
			//   rules: testingLibrary.rules,
			// }),
			// TODO add again package supports eslint 9
		},
		rules: {
			"import/order": [
				"warn",
				{
					"newlines-between": "always",
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			], // auto sort imports
			"no-console": [
				"error",
				{
					allow: ["dir", "info", "warn", "error"],
				},
			], // prevent debugging console.log statements
			"max-params": ["warn", 5], // prevent functions with too many parameters
			complexity: ["warn", 13], // prevent complex functions
			"import/no-unresolved": "off", // IDE is recognizing it already
			"unicorn/number-literal-case": "off", // prettier and unicorn collide here.
			"react/jsx-uses-react": "error", // necessary to remove unused imports
			"react/jsx-uses-vars": "error", // necessary to remove unused imports
			"arrow-body-style": ["error", "always"], // always have a return in functions
			"unused-imports/no-unused-imports": "error", // necessary to remove unused imports
			"testing-library/render-result-naming-convention": "off", // conflicting with args variable from setup function on tests
			"@typescript-eslint/require-await": "error", // avoid async functions without await
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_" },
			],
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			"unicorn/prevent-abbreviations": "off", // abbreviations like props or fn are wanted
			"unicorn/prefer-ternary": "off", // ternary is not always better
			"unicorn/no-useless-undefined": "off", // not working properly
			"unicorn/no-null": "off", // not working properly
			"unicorn/prefer-module": "off", // __dirname is not working with import.meta.url
			"unicorn/consistent-function-scoping": "off", // makes code less readable
			"unicorn/no-array-for-each": "off", // performance should only be improved until it causes problems
			"unicorn/better-regex": "off", // more efficient regex may be less clear to read
			"unicorn/prefer-query-selector": "off", // automatic fix breaks some queries
			"unicorn/text-encoding-identifier-case": "off", // it is colliding with TypeScript types
			"@typescript-eslint/restrict-template-expressions": "off", // not useful always
			quotes: [
				"error",
				"double",
				{
					allowTemplateLiterals: false,
				},
			], // don't allow backticks if it's not a template literal

			"react/react-in-jsx-scope": "off", // not necessary on React 18
			"testing-library/no-await-sync-events": "off", // userEvents without async are not always working
			"jest/no-export": "off", // export necessary for files with dynamic imports for mocks
			"unicorn/prefer-node-protocol": "off", // not working with remix
			"jest/no-mocks-import": "off", // necessary for prisma client
			"playwright/missing-playwright-await": "off", // Rule collides with unit testing
			"unicorn/expiring-todo-comments": "off", // Rule has a bug
			"unicorn/filename-case": [
				"error",
				{
					case: "kebabCase",
					ignore: [
						/\.\$[a-z]/, // ignore files with URL variables .$var - they need to be in camelCase for Remix
						/_\./, // ignore files _. for remix routes
					],
				},
			],
			"@typescript-eslint/prefer-nullish-coalescing": [
				"error",
				{
					ignoreConditionalTests: true,
					ignoreMixedLogicalExpressions: true,
				},
			], // ?? is different from || when the value is 0 or false
		},
	},
	{
		files: ["e2e-tests/*"],

		plugins: {
			playwright,
		},

		rules: {
			"testing-library/prefer-screen-queries": "off", // Playwright is fine with queries outside of screen
			"playwright/missing-playwright-await": "warn", // Playwright needs await for some functions
			"playwright/no-standalone-expect": "off", // false positives on Playwright setup functions
		},
	},
	{
		files: ["src/locales/*"],

		rules: {
			"sort-keys-fix/sort-keys-fix": "warn", // sort keys in locales
		},
	},
	{
		settings: {
			react: {
				version: "detect", // necessary for eslint-plugin-react
			},
		},
	},
	{
		files: ["**/*.test.*"],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	}
);
