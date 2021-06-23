module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-unused-vars': 0,
    'global-require': 0,
    'consistent-return': 0,
    "no-param-reassign": 0,
  },
};