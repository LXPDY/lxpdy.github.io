import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "番剧/漫画杂谈",
    icon: "lightbulb",
    prefix: "/guide/",
    children: [
      {
        text: "咒术回战",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
      },
      {
        text: "紫罗兰永恒花园",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
      },
    ],
  },
  {
    text: "裴冬柚",
    icon: "book",
    link: "https://space.bilibili.com/151955537",
  },
]);
