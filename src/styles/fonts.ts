import localFont from "next/font/local";

const ttNormsFont = localFont({
  src: "./fonts/TT_Norms_Pro_Trial_Expanded_Regular.ttf",
  variable: "--font-tt-norms-expanded",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
});

export const localFontClassName = ttNormsFont.variable;
export const siteFontClassName = localFontClassName;
