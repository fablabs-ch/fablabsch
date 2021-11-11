module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:vue/recommended"],
  plugins: ["gridsome"],
  rules: {
    "gridsome/format-query-block": "error",
    "vue/no-v-html": "off",
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": ["warn", {
      "singleline": {
        "max": 4
      },
      "multiline": {
        "max": 1
      }
    }]
  },
  parser: "vue-eslint-parser",
};
