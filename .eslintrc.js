module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/no-unresolved': 'off',
    'eol-last': 'off',
  },
};