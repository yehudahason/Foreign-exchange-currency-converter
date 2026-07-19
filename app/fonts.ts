import localFont from "next/font/local";

export const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono-variable.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
