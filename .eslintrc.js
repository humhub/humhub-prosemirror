module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "jquery": true,
        "mocha": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "describe": "readonly",
        "it": "readonly",
        "before": "readonly",
        "after": "readonly",
        "beforeEach": "readonly",
        "afterEach": "readonly"
    },
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": ["mocha"],
    "rules": {
        'no-labels': 'off',
        'no-cond-assign': 'off',
        "no-unused-vars": "off",
        "no-undef": "off",
    }
}
