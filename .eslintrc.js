module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    'extends': [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      //'@vue/typescript'
      '@vue/eslint-config-typescript/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'], // ✅ Make sure plugin is included
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {
            argsIgnorePattern: '^_', // ✅ allow unused args starting with _
        }],
    },
    
    /* Plugin here */
    //plugins: ['vue'],
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
    }
}
