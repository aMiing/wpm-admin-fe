module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:jsx-a11y/recommended',
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['vue'],
  rules: {
    'no-unused-vars': 0,
    'global-require': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'vue/multi-word-component-names': 0,
    'vue/html-self-closing': 0,
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5,
        },
        multiline: {
          max: 1,
        },
      },
    ],
  },
};
