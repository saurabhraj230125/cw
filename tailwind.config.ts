import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core ERP Palette
        erp: {
          bg: "#f3f4f6",        // The standard gray background
          surface: "#ffffff",   // White panels
          border: "#cccccc",    // The strict gray borders
          borderLight: "#e0e0e0",
          header: "#f5f5f5",    // Light gray for table headers
        },
        // Brand & Action Colors
        cw: {
          blue: "#0055a5",      // Primary actions / Active states
          blueDark: "#004080",  // Hover states
          red: "#cc0000",       // Unpaid, Delete, Errors
          green: "#008000",     // Paid, Success, Save
        },
        // Financial Pastel Summary Colors
        pastel: {
          blueBg: "#e3f2fd", blueBorder: "#bbdefb",
          greenBg: "#e8f5e9", greenBorder: "#a5d6a7",
          yellowBg: "#fff8e1", yellowBorder: "#ffecb3",
          redBg: "#ffebee", redBorder: "#ffcdd2",
        }
      },
      borderRadius: {
        // Enforcing sharp corners over bubbly SaaS curves
        'erp': '2px',
      },
      fontSize: {
        // Ensuring dense data typography
        'erp-sm': ['11px', '14px'],
        'erp-base': ['12px', '16px'],
        'erp-md': ['13px', '18px'],
        'erp-lg': ['15px', '20px'],
      },
      boxShadow: {
        'erp-inner': 'inset 0 1px 2px rgba(0,0,0,0.05)',
        'erp-button': 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
};
export default config;