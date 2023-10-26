---
title: 进阶学习日志

order: 0
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-18
category:
  - 学习日记
tag:
  - Objective-C
  - 进阶学习
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: true
---

# 站在前辈肩膀上——iOS开发进阶日记

## 2023.10.18

### 写在前面

​	借由和[**ynyyn**](https://iyn.me)（~~一年又一年先辈！~~）聊天的契机，了解到了[**玉令天下**](https://yulingtianxia.com/)杨老师的主页。说来也是神奇，当我第一次投递鹅厂，秋招第一场面试就是他给我面的（~~当时是不知道的，看了脉脉上的照片而后知后觉~~）。虽然第一面通过了，却**被总监挂掉**，遗憾无缘手Q，但是几轮面试积累的经验和自信给了我**很大帮助**，（~~最后还是拿了鹅厂的意向~~）

​	看了博客后，我对这位同样是工大毕业的学长充满了**敬畏**，不论是他鹅厂实习入职第一个月写的[blog](https://yulingtianxia.com/blog/2015/11/13/Summary-of-the-first-month-in-the-internship-of-Tencent/)，还是他博客中的技术文章，其深度广度让我佩服的同时，又感到深深的压力以及自卑（~~虽然他实习时已经是研究生了，而且好像在其他地方也实习过，而我只是个小本科~~）。从完成[公司的需求](https://yulingtianxia.com/blog/2014/04/09/iosgua-gua-qia-de-shi-xian/)、各种设计模式到IOS运行的各种[底层机制](https://yulingtianxia.com/blog/2014/11/05/objective-c-runtime/)，到开发[小工具](https://yulingtianxia.com/blog/2016/11/28/pbxprojHelper/)、[逆向微信](https://yulingtianxia.com/blog/2017/03/06/How-to-hook-the-correct-method-in-reverse-engineering/)，以及和各种其他[技术博客](https://blog.sunnyxx.com/archives/page/3/)的联动，博客的评论区，都让我感到他**对技术的热爱**，以及当时苹果开发者社区的美好氛围。（~~虽然这些博客的主要精华都停在了13-16年~~），即使如此，其中大部分文章都十分值得学习，我会将这位学长的博客以及其中用到相关知识作为这一阶段的主要学习目标（~~心里还是希望能接触一些新的技术，不过难找好又看得懂的资源~~）。

​	想起自己大一卖掉游戏本换mac（~~还是intel的，49年入国军~~），（~~为了双系统和显卡打游戏~~）为了性能配置自己的（~~i7+32G+6600xt~~）黑苹果台式，还曾经幻想自己开发一个iOS版本的HIT助手（~~这个软件是不是已经似了~~），结果碍于课业和当时的学习能力，最终放弃了这条路线，没想到如今又捡了起来，甚至成为自己的工作，我觉得十分**感慨**（~~这何尝不是一种纯爱~~）。

​	ynyyn学长的博客有许多**友链**，出于好奇，我访问了其中的几个，发现它们有些已经挂掉（~~悲~~），有的没有装修，有的写了一些博文，但是更新愈发稀少，它们用的框架也是当年的新兴框架，虽然从今天来看有些陈旧，但内容不失精华。对比一下我的个人站用的比较新的框架的效果，不经感到时代变迁（~~前端人真不容易，这才几年就迭代得面目全非~~）。或许未来，我也会因为工作忙碌而减少甚至放弃这个博客的更新，但是我希望现在这份热衷于学习的感觉能够维持下去吧。（~~开发果然还是太难了，不如早点回家种茶叶吧~~）

## 2023.10.19 - 10.20

### [Runtime](Runtime.md)

主要是翻译，希望有朝一日能更细致地看懂

## 2023.10.21

在翻译OC编程文章时，发现了很多有趣的文章，比如
[KVC](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107-SW1)
[KVO](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueObserving/KeyValueObserving.html#//apple_ref/doc/uid/10000177i)
[Xcode实用指南](https://developer.apple.com/documentation/xcode#//apple_ref/doc/uid/TP40010215)
先记录一下之后再翻译。

## 2023.10.22

今天进一步翻译了OC编程中有关class的部分

## 2023.10.23

今天进一步翻译了OC编程中有关[对象](/tec/basic/programWithOC/子章节/WorkWithObject.md)的部分

## 2023.10.24
先在这里标记一下未来的翻译计划,斜体为重点
*[Advanced Memory Management Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/MemoryMgmt.html#//apple_ref/doc/uid/10000011i)* 内存控制
*[Concepts in Objective-C Programming](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/Introspection/Introspection.html#//apple_ref/doc/uid/TP40010810-CH9-SW1)* 设计模式（哲学编程？）
*[Concurrency Programming Guide](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008091)* 并发编程
*[Threading Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Multithreading/Introduction/Introduction.html#//apple_ref/doc/uid/10000057i)* 线程编程
想读的东西真的越来越多了靠北

# 2023.10.25
*[Quartz 2D Programming Guide](https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/Introduction/Introduction.html#//apple_ref/doc/uid/TP30001066)* 2D绘制引擎
[String Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/introStrings.html#//apple_ref/doc/uid/10000035i) 字符串编程指南
[String Format Specifiers](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265) 字符串相关速查
*[Collections Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Collections/Collections.html#//apple_ref/doc/uid/10000034i)* 集合编程主题
*[Sets: Unordered Collections of Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Collections/Articles/Sets.html#//apple_ref/doc/uid/20000136)* 集合编程：set
*[Archives and Serializations Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Archiving/Archiving.html#//apple_ref/doc/uid/10000047i)* 存档和序列化编程指南
*[Property List Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/PropertyLists/Introduction/Introduction.html#//apple_ref/doc/uid/10000048i)* 属性列表编程指南

# 2023.10.26
*[Blocks Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html#//apple_ref/doc/uid/TP40007502)* 块编程主题
*[Operation Queues](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/OperationObjects/OperationObjects.html#//apple_ref/doc/uid/TP40008091-CH101)* 操作队列
*[Dispatch Queues](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/OperationQueues/OperationQueues.html#//apple_ref/doc/uid/TP40008091-CH102)* 调度队列
*[Error Handling Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ErrorHandlingCocoa/ErrorHandling/ErrorHandling.html#//apple_ref/doc/uid/TP40001806)* 错误处理编程指南
*[Exception Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Exceptions/Exceptions.html#//apple_ref/doc/uid/10000012i)* 异常编程主题
 [Acceptable Abbreviations and Acronyms](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CodingGuidelines/Articles/APIAbbreviations.html#//apple_ref/doc/uid/20001285) 可接受的缩写列表