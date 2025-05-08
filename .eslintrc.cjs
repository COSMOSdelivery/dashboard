module.exports = {
	env: {
	  node: true, // Enable Node.js global variables and scoping
	  browser: true, // Enable browser global variables
	  es2020: true, // Enable ES2020 global variables
	},
	root: true,
	extends: [
	  "eslint:recommended",
	  "plugin:react/recommended",
	  "plugin:react/jsx-runtime",
	  "plugin:react-hooks/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parserOptions: {
	  ecmaVersion: "latest", // Use the latest ECMAScript version
	  sourceType: "module", // Use ES modules
	},
	settings: {
	  react: {
		version: "18.2", // Specify the React version
	  },
	},
	plugins: ["react-refresh"],
	rules: {
	  "no-undef": "off", // Disable the no-undef rule
	  "react/prop-types": "off", // Disable prop-types validation
	  "react/no-unescaped-entities": "off", // Allow unescaped entities
	  "react/jsx-no-target-blank": "off", // Allow target="_blank" without rel="noreferrer"
	  "react-refresh/only-export-components": [
		"warn",
		{ allowConstantExport: true },
	  ], // Warn about non-component exports
	},
  };