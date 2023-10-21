import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "开发学习日志",
      icon: "laptop-code",
      prefix: "tec/",
      link: "tec/",
      children: "structure",
    },
    {
      text: "番剧/动漫杂谈",
      icon: "book",
      prefix: "anime/",
      children: "structure",
    },
    {
      text: "记录日常",
      icon: "book",
      prefix: "others/",
      children: "structure",
    },
    
  ],
});
