module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'solid'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:solid/recommended'
    ]
  };