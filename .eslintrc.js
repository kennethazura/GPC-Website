module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'func-names': 0,
    'prefer-arrow-callback': 0,
    'prefer-template': 0,
    'space-before-function-paren': ['error', 'never'],
    'no-new': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 0,
  },
  globals: {
    gsap: true,
    u: true,
    TweenMax: true,
    ScrollMagic: true,
    Linear: true,
  },
};
