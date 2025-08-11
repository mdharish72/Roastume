import { Bangers, Open_Sans } from "next/font/google";

// Display font for headings and titles
export const display = Bangers({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Body font for regular text
export const body = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
  display: "swap",
});

// Font class names for easy access
export const fonts = {
  display: display.className,
  body: body.className,
} as const;
