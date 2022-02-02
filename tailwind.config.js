module.exports = {
  purge: false,
  theme: {
    fontFamily: {
      serif: "'EB Garamond', serif",
      sans: "Lora, serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "1rem",
      base: "1.25rem",
      lg: "1.4rem",
      xl: "1.5rem",
      "2xl": "1.6rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "3.5em",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fff",
      black: "#000",
      "g-1": "#fcfcfc",
      "g-2": "#fafafa",
      "g-3": "#f5f5f5",
      "g-4": "#efefef",
      "g-5": "#dbdbdb",
      "g-6": "#8a8a8a",
      "g-7": "#5d5d5d",
      "g-8": "#2d3748",
      "g-9": "#1a202c",
      beige: "#f4f1ee",
      robin: "#99d9f1",
      blue: "#009edb",
      "blue-darker": "#1982BD",
      "tw-blue": "#99d9f1",
      "fb-blue": "#009edb",
      orange: "#ff6c36",
      green: "#78bc20",
      yellow: "#ffcb05",
      "yellow-darker": "#cda52d",
      darkblue: "#22416e",
    },
    extend: {
      boxShadow: {
        beige: "0 0 0 3px #f4f1ee80",
      },
      lineHeight: {
        normal: "1.6",
        hed: "1.15",
      },
      margin: {
        21: "5.25rem", // for staggered sidebars
      },
      spacing: {
        "16x9": `${(100 * 9) / 16}%`,
        "6x4": `${(100 * 4) / 6}%`,
      },
      screens: {
        md: "850px",
        lg: "1080px",
      },
      maxWidth: {
        content: "730px",
      },
    },
  },
  variants: {
    boxShadow: ["responsive", "hover", "focus", "active", "group-hover"],
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};
