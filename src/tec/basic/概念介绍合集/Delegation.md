---
title: Delegation
order: 1
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

这篇文章摘自[OC编程](/tec/basic/programWithOC/README.md)苹果原文的超链接，由于是个弹窗所以贴不了网址

# Delegation 委托机制

【这段GPT翻译的时候，把`delegating object` 和 `delegate` 翻译成“委托对象”和“委托”了,而在实际作用上，称之为“发出委托的对象”和“被委托以任务的对象”或许比较合适，但是拗口又不方便阅读,所以笔者认为英文的动作语态能更好地表达原义，这部分就不做翻译了】

​	`Delegation`是程序中的一个简单而强大的模式，在这个模式下，在程序中的一个对象会代表（`on be half of`）或者协调（`in coordination with`）另一个对象。`delegating object`保持对另一个对象（即 `delegate` ）的引用（`reference`），并在适当的时候向其**发送消息**。该消息（一个事件的委托）通知`delegate` ，说明接下来它将要去处理或已处理的事件。`delegate` 可以**通过更新其自身或应用程序中的其他对象的外观或状态来响应该消息**，并在某些情况下，它可以**返回一个影响即将发生的事件的处理方式的值**。**委托的主要价值在于它允许您轻松地自定义一个中心对象中的多个对象的行为。、**

## Delegation and the Cocoa Frameworks 委托和Cocoa框架

`delegating object` 通常是框架对象，而 `delegate` 通常是控制器`controller`对象。在托管`managed`内存环境中，`delegating object` 维护对其 `delegate` 的**弱引用**；在垃圾回收环境中，接收器`receiver`维护对其 `delegate`的强引用。【这里也涉及到了消息机制，接收器其实就是OC类】在Foundation、UIKit、AppKit和其他Cocoa和Cocoa Touch框架中，Delegation的示例比比皆是。

一个关于`delegating object` 的示例——AppKit框架中的NSWindow类的实例

- NSWindow声明了一个协议`protocol`，协议中有一个方法叫做`windowShouldClose:`。当用户单击窗口中的关闭按钮时，窗口对象向其 `delegate`发送`windowShouldClose:`消息以请求确认窗口的关闭。`delegate`返回一个布尔值，从而控制窗口对象的行为。
- 下图表示了框架对象向其 `delegate`发送消息

<img src="https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Art/delegation_2x.png" alt="delegation_2x" style="zoom:67%;" />

## Delegation and Notifications 委托和通知

大多数Cocoa框架类的 `delegate`都会自动注册为`delegating object`发布的通知`notifications`的**观察者**【好家伙还涉及到观察者模式】。`delegate`只需要实现框架类声明的**通知方法**`notifications method`，以接收特定的通知消息。如上述的示例，窗口对象会向观察者发布一个`NSWindowWillCloseNotification`通知，`but`【这里不知道为什么苹果用了个but，我认为这里不存在转折语意，或许用and会通顺一点】会向其`delegate`发送`windowShouldClose:`消息。

## Data Source 数据源

数据源与`delegate`几乎相同。它们的区别在于它们与`delegating object`的关系。与（`delegate`）被委托控制用户界面不同，数据源被委托控制数据。通常，`delegating object`是视图对象，如`table view`，它保存对其数据源【此处的`date source`应该单纯指的是数据来源，而非“数据源”这整个概念】的引用，并偶尔向其请求应该显示的数据。数据源【此处则是表达整个概念】则像`delegate`一样，必须采用一个**协议**，并实现该协议所需实现的方法。数据源负责管理供给给`delegating view`的`model objects`的内存。【其实就是数据面的`delegate`】

## 苹果官方给的参考文献

有时间把我翻译过的给他标注了

### Prerequisite Articles

- [Class definition](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/ClassDefinition.html#//apple_ref/doc/uid/TP40008195-CH6-SW1)

### Related Articles

- [Notification](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Notification.html#//apple_ref/doc/uid/TP40008195-CH35-SW1)
- [Protocol](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Protocol.html#//apple_ref/doc/uid/TP40008195-CH45-SW1)
- [Controller object](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/ControllerObject.html#//apple_ref/doc/uid/TP40008195-CH11-SW1)

### Definitive Discussion

[Delegates and Data Sources](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/DelegatesandDataSources/DelegatesandDataSources.html#//apple_ref/doc/uid/TP40010810-CH11)

### Sample Code Projects

- [UITableView Fundamentals for iOS](https://developer.apple.com/library/archive/samplecode/TableViewSuite/Introduction/Intro.html#//apple_ref/doc/uid/DTS40007318)