/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "vetween-indigo": "#3A86C9",
        "vetween-teal": "#5BC0BE",
        "vetween-blue": "#3A86C9",
      },
    },
  },
  plugins: [],
};
