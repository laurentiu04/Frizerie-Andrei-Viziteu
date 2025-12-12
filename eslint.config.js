import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{js,jsx}"],
		extends: [
			js.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		rules: {
			"no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
		},
	},

	// ==========================================================
	// ADD THIS NEW CONFIG OBJECT FOR THE SERVER/BACKEND FILES
	// ==========================================================
	{
		// 1. Target JavaScript files inside the 'server' directory
		files: ["server/**/*.js"],

		languageOptions: {
			// 2. Enable Node.js environment globals (like 'require')
			globals: globals.node,

			parserOptions: {
				// 3. Use 'script' for CommonJS/require() syntax
				sourceType: "script",
			},
		},

		rules: {
			// 4. Optional: Allow console.log/console.error on the server
			"no-console": "off",
			// 5. Optional: Suppress any unused var errors for server code if needed
			"no-unused-vars": "off",
		},
	},
	// ==========================================================
]);
