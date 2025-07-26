import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      keyframes : {
        popIn: {
          '0%' : {
            opacity: '0',
            transform: 'scale(0.9) translateY(-10px)',
          },
          '100%' : {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          }
        },
        popOut : {
          '0%' :{
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
          '100%' : {
            opacity: '0',
            transform: 'scale(0.9) translateY(-10px)',
          },
        }
      },
      animation:{
        popIn: 'popIn 0.4s ease-out forwards',
        popOut: 'popOut 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
