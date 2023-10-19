---
title: Runtime机制

order: 3
icon: file
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10
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

# Runtime

## 引子

学到OC，看到的文章中隐约中提到了OC的所谓“函数调用”其实是向持有类/实例发送消息从而达到调用效果，进一步了解OC的内存管理机制后，发现不同于C++，OC的内存管理有ARC、自动释放池这些“魔法”机制，而这些机制的又建立在这个神秘的Runtime机制上。

#### [receiver message]发送消息

我们知道OC的底层是由C/C++实现的，而对于编译器来说方括号的实现则是以以下形式

`bjc_msgSend(receiver, selector)//不带参数`

`objc_msgSend(receiver, selector, arg1, arg2, ...)//带参数，可以发现是`

参考文章：

[[Objective-C Runtime](https://yulingtianxia.com/blog/2014/11/05/objective-c-runtime/)](https://yulingtianxia.com/blog/2014/11/05/objective-c-runtime/)

杨老师基本上翻译了苹果的文章，加上的自己的理解，省略了一些内容

[Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008048-CH1-SW1)

苹果这篇来自2009年的文章看的头疼，建议把侧栏关了然后放大看。Google翻译的稀烂，还得是看原文自己来。

## 为什么要引入Runtime机制

```
The Objective-C language defers as many decisions as it can from compile time and link time to runtime. Whenever possible, it does things dynamically. This means that the language requires not just a compiler, but also a runtime system to execute the compiled code. The runtime system acts as a kind of operating system for the Objective-C language; it’s what makes the language work。 —— 摘自苹果官方文档
```

Objective-C 语言将尽可能多的决策从编译时和链接时**推迟到运行时**。只要有可能，它就会**动态**地执行操作。这意味着该语言不仅需要编译器，还需要运行时系统来执行编译后的代码。Runtime机制某种程度上充当了该语言的操作系统，让这门语言能够运作起来。

## 与Runtime交互

与Runtime系统的交互可以分为三个级别

- 通过源代码
- 通过类方法（来自Foundation 框架的NSObject类）
- 对runtime函数直接调用

### 源代码交互

``“在大部分时候,Runtime系统都自动地运行在幕后，你只需要编写和编译OC”``

OC的编译器会为OC类和方法创造【符合动态特性的】数据结构以及方法

- 数据结构会捕获类以及类的Category（分类）的定义、协议（Protocols）的声明以及方法选择器、实例变量模板以及其他来自源代码的信息
- 最重要的runtime函数就是**发送消息**的函数`Messaging`