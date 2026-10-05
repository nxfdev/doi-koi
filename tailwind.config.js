/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FCE08B",
          brown: "#763C1E",
          "brown-dark": "#502813",
          "brown-light": "#96522C",
          cream: "#FFF9E6",
          terracotta: "#A34E26",
          sand: "#F4D272",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      animation: {
        "hypnotic-spin": "spin 60s linear infinite",
        "hypnotic-slow": "spin 90s linear infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
