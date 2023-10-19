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

笔者的这篇文章大部分翻译自苹果，部分参考杨老师的文章，【】和`代码块`中是我添加的想法。

~~顺便改良了一下苹果的阴间排版。~~

参考文章：

[[Objective-C Runtime](https://yulingtianxia.com/blog/2014/11/05/objective-c-runtime/)

杨老师基本上翻译了苹果的文章，加上的自己的理解，有些部分没有翻译，看的我满头大汗

~~但是直接看感觉还是一知半解，而且全抄了我写什么。~~

[Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008048-CH1-SW1)

苹果这篇来自2009年的文章看的头疼，建议把侧栏关了然后放大看。Google翻译的稀烂，还得是看原文自己来。

~~发现chatGPT翻译的挺好的,这就是时代的进步吗~~

## 为什么要引入Runtime机制

```
The Objective-C language defers as many decisions as it can from compile time and link time to 
runtime. Whenever possible, it does things dynamically. This means that the language requires 
not just a compiler, but also a runtime system to execute the compiled code. The runtime system 
acts as a kind of operating system for the Objective-C language; it’s what makes the language 
work。 —— 摘自苹果官方文档
```

Objective-C 语言将尽可能多的决策从编译时和链接时**推迟到运行时**。只要有可能，它就会**动态**地执行操作。这意味着该语言不仅需要编译器，还需要运行时系统来执行编译后的代码。Runtime机制某种程度上充当了该语言的操作系统，让这门语言能够运作起来。

## 与Runtime交互

与Runtime系统的交互可以分为三个级别

- 通过源代码
- 通过类方法（来自Foundation 框架的NSObject类）
- 对runtime函数直接调用

现在对这三种方法进行简单的介绍

### 源代码交互

``“在大部分时候,Runtime系统都自动地运行在幕后，你只需要编写和编译OC”``

OC的编译器会为OC类和方法创造【符合动态特性的】数据结构以及方法

- 数据结构会捕获类以及类的Category（分类）的定义、协议（Protocols）的声明以及方法选择器、实例变量模板以及其他来自源代码的信息
- 最重要的runtime函数就是**发送消息**的函数`Messaging`，这将在后面的文章提到它的源代码

### NSObject方法交互

大部分类是`NSObject`的子类,同时也继承了它的方法

- 【最特殊的例外是 `NSProxy`，它是个抽象超类，它实现了一些消息转发有关的方法，可以通过继承它来实现一个其他类的替身类或是虚拟出一个不存在的类】

`NSObject`的方法因此为每个子类的实例和类对象建立了固有行为，当然也有些例外，`NSObject`仅仅定义了模版【一些事情应该怎么去做】而不提供实现代码。【`也就是所谓的抽象接口`】

- 比如说`NSObject`定义了一个`description`实例方法【返回一个string描述这个类内容物】
  - `重载它并为你定义的类提供描述内容`
  - 这主要用于GDB在debug时【`print-object` 指令】打印这个从描述方法返回的字符串
    - `NSObject`的这个方法的实现不知道类包含了什么，所以它返回了一个字符串，包含了类名和地址。`NSObject的子类可以实现这个方法以返回更多详细信息
      - `Foundation`类NSArray返回其包含的对象的描述列表
- `NSObject`的一些方法仅仅是用于查询Runtime系统的信息
  - 这些方法允许对象执行内省操作
    - `class`方法
      - 返回一个对象的类
    - `isKindOfClass`和`isMemberOfClass`方法
      - 检查对象是否在指定的类继承体系中
    - `respondsToSelector`
      - 指示对象是否能够相应特定消息
    - `conformsToProtocol`
      - 检查对象是否实现了指定协议类的方法
    - `methodForSelector`
      - 返回指定方法实现的地址

### Runtime函数

Runtime是一个具有公共接口的动态共享库，该接口由位于目录`/usr/include/objc`中的头文件中的一组函数和数据结构组成。其中许多函数允许您使用普通的C语言来重复实现Objective-C代码时编译器的操作。其他函数则构成了OC的功能基础。这些函数使得能够开发其他接口到Runtime系统并生成增强开发环境的工具。在编写Objective-C代码时，通常不需要这些基础函数。然而，有时在编写Objective-C程序时，一些Runtime函数可能会有用。所有这些函数都在"Objective-C Runtime Reference"中有文档记录【苹果的这个链接已经挂掉了哈哈哈（一点都不好笑）】。

# Messaging消息函数

### 引子

这一章描述了如何将消息表达式转换为`objc_msgSend`函数调用，如何通过方法名称引用方法。解释了如何利用`objc_msgSend`，如果有需要的话还可以实现规避动态绑定。

`动态绑定，熟悉的词，想起C++的虚函数表，感觉这个机制比虚函数离谱多了`

#### [receiver message]发送消息

我们知道OC的底层是由C/C++实现的，而对于编译器来说方括号`[receiver message]`的实现则是以转化为一下形式

`bjc_msgSend(receiver, selector)//不带参数`

`objc_msgSend(receiver, selector, arg1, arg2, ...)//带参数，应该是用可变参数列表实现的`

消息函数执行**动态绑定**所需的操作如下：

- 首先，它查找`selecor`指向的`过程procedure`（方法的实现）。由于不同类实现的同名函数的存在，具体找到哪个方法取决于`receiver`所在的类
- 然后，它调用该`过程`，将接收对象（指向其数据的指针）【是不是类似`C++的this指针`】和参数列表传递给该`过程`。
- 最后，它将过程的返回值传递作为自己的返回值

```
Note: The compiler generates calls to the messaging function. You should never call it directly
in the code you write. —— 摘自苹果官方文档

这是提醒你永远不要直接在自己写的代码里尝试调用消息函数，不知道有没有好奇的程序员去试过。
```

消息的关键在于编译器为类和对象所构造的数据结构，该数据结构有两个基本元素（这又回到我前面写的OC基础了）

```
- 一个指向超类的指针
- 我们伟大而神秘的isa
```

- `isa `,也就是类分发表
  - 【在我前面的文章中，提到了它指向的是元类】
  - 【在苹果的文章中】，类分发表会讲方法选择弃和它们表示的方法的类的特定地址关联起来
    - 例如，`setOrigin`方法的选择器与setOrigin`（实现）的地址相关联，`display`方法的选择器与`display`的地址相关联

当创建一个新对象时，会分配内存，初始化其实例变量。对象变量中的第一个是指向其类结构的指针。这个指针被称为`isa`，它使对象可以访问其类，通过类可以访问其继承的所有类。

```
Note: While not strictly a part of the language, the isa pointer is required for an object to 
work with the Objective-C runtime system. An object needs to be “equivalent” to a struct 
objc_object (defined in objc/objc.h) in whatever fields the structure defines. However, you 
rarely, if ever, need to create your own root object, and objects that inherit from NSObject or 
NSProxy automatically have the isa variable.

注意：虽然isa指针严格来说不属于语言的一部分，但它是对象与Runtime系统一起工作所必需的……
定义一个对象相当于struct objc_object（在objc/objc.h中定义）
从NSObject或NSProxy继承的对象会自动具有isa变量。
```

![messaging1](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Art/messaging1.gif) <img src="http://yulingtianxia.com/resources/Runtime/class-diagram.jpg" alt="class-diagram" style="zoom:50%;" />

【看图其实还算好懂，前提是你把文章认真看了】