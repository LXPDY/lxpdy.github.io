import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Fuyuyuの小站",
  description: "Fuyuyuの小站",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
