---
title: Objective-C编程

order: 2
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-21
category:
  - 学习日记
tag:
  - Programming with Objective-C
  - 进阶学习
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: true
---

# Programming with Objective-C 

## Objective-C 编程 前言

​	为了更好地了解OC这门语言，在通过苹果的文章了解了Runtime系统，并将它的文章系统翻译之后，笔者觉得有必要在已经有了语法和机制学习的基础上，再进一步研究苹果的这篇文章——[Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011210)。这篇文章说新不新，说老不老，是苹果在2014年发布以替换旧的OC编程指南，迄今也已经有了10年的历史。笔者希望通过在翻译阅读这篇文章时，深入了解这门编程语言，系统性地学习它的脉络。

​	这一部分是在我学习了Runtime机制之后学习的。苹果推荐在研究这部分之前去阅读它的编程API，然后直接链接到了它现在的开发者文档，但是那些文档十分零散，我难以直接找到一个入手处，所以还是从这里学起吧。

## 关于Objective-C

​	Objective-C【以下简称OC】是开发OS X和iOS软件时使用的主要编程语言。它是C语言的**超集**，提供了**面向对象**的能力和动态运行时。OC继承了C的语法、基本类型和流控制语句，并**添加了用于定义类和方法的语法**。它在提供了动态类型和动态绑定的同时，也提供了`object graph management`和`object literals`的语言级支持，并将多许职责多推迟到运行时。

### 一览

本文介绍OC语言，并提供了大量的使用示例。您将学习如何创建描述自定义对象的类，并了解如何使用Cocoa和Cocoa Touch提供的一些框架类【Cocoa指的是苹果的操作系统下开发程序的技术框架和各种相关东西的集合，Touch指的是移动端】。尽管**框架类**们和语言是分开的，但它们的使用是紧密地和OC编程结合在一起的，许多语言级的特性依赖于这些类提供的行为。

### An App Is Built from a Network of Objects  APP是由对象网络组成的

在为OS X或iOS构建应用程序时，您大部分时间将与对象一起工作。这些对象是Objective-C类的实例，其中一些由Cocoa或Cocoa Touch为您提供，另一些则需要您自己编写。

如果您要编写自己的类`class`，请首先提供一个类的描述，详细说明类的实例的公共接口`public interface`。此接口包括封装相关数据的公共属性`public properties`【之后这个名词采用原名不翻译】，以及方法`methods`列表。方法声明指示对象可以接收的**消息**【这里就说明了OC类方法的消息机制并不是普通的调用】，并包括每次调用方法时所需的参数信息。您还需要提供一个类的实现`implementation`，其中包括接口中声明的每个方法的可执行代码。

相关章节：[Defining Classes](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/DefiningClasses/DefiningClasses.html#//apple_ref/doc/uid/TP40011210-CH3-SW1)定义类， [Working with Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4-SW1)使用对象，[Encapsulating Data](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW1)封装数据

### Categories Extend Existing Classes 分类——扩展现有类

​	与在现有类的基础上创建全新的类以提供小型的附加功能不同，您可以定义一个分类`category`【之后这个名词采用原名不翻译】来**向现有类添加自定义行为**。您可以使用category向任何类添加方法，包括您没有原始实现源代码的类【意思是即使这个类是已经由源代码编译完成，我们仍然可以在手中没有源代码的情况下向它添加方法，这就是runtime系统的好处】，如NSString等框架类。

如果您具有类的原始源代码，可以使用类扩展`class extensions`来添加新`properties`或修改现有`properties`。类扩展通常用于**隐藏私有行为**，**以便在单个源代码文件或自定义框架的私有实现中使用**。【意思是通过类扩张只在单个代码文件中对一个类进行拓展，通常是`.m`文件】

相关章节：自定义现有类[Customizing Existing Classes](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html#//apple_ref/doc/uid/TP40011210-CH6-SW1)

### Protocols Define Messaging Contracts 协议——定义消息契约

在OC应用程序中，大多数工作都是对象相互发送**消息**所产生的结果。通常，这些消息**由**类接口中明确声明的**方法定义**。然而，有时定义一组**与特定类无直接关联的相关方法**很有用。【所以协议就是为类添加成套方法的一种方法】

Objective-C使用协议来定义一组相关方法，例如对象可能调用其[`delegate`](/tec/advanced/Delegation.md)的方法，这些方法可以是可选的或必需的。任何类都可以指示它采用一个协议，这意味着它还必须为协议中的所有必需方法提供实现。

