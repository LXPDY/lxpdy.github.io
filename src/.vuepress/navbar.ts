import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "开发学习日志",
    icon: "laptop-code",
    prefix: "/tec/",
    children: [
      {
        text: "基础学习",
        prefix: "basic/",
        children: ["README", { text: "Programing with OC", link: "programWithOC" }],
      },
      {
        text: "进阶学习",
        prefix: "advanced/",
        children: ["README","Runtime"],
      },
    ],
  },
  "/anime/",
  "/others/",  
  {
    text: "访问站主Bilibili",
    icon: "book",
    link: "https://space.bilibili.com/151955537",
  },
]);
