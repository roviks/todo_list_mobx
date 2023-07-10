module.exports = {
  plugins: {
    "postcss-flexbugs-fixes": {},
    "tailwindcss/nesting": "postcss-nesting",
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 0,
      features: {
        "custom-properties": false,
        "nesting-rules": true,
      },
    },
  },
};
