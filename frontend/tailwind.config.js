module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#2A63F1",
        "blue-dark": "#134AD4",
        "blue-light": "#EAF0FE",
        night: "#1C1917",
        grey: "#A6A09B",
        "pale-100": "#F9F9F9",
        "pale-200": "#F0F0F0",
      },
    },
  },
  safelist: ["border-night"],
  plugins: [],
};
