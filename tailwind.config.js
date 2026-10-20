/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        grape: {
          DEFAULT: '#7624F4',
          hover: '#651cd4',
        },
        volt: {
          DEFAULT: '#C8FF00',
          hover: '#b5e600',
        },
        obsidian: '#03080A',
        cloud: '#FCFCFE',
        panel: {
          dark: '#0b101b',
          light: '#ffffff',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
