---
title: Selector
order: 3
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-20
category:
  - 学习日记
tag:
  - Objective-C
  - 基础学习
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: true
---

# Selector

`selector`选择器是用于选择要为对象执行的方法的名称，或者是在**源代码编译时替代名称的唯一标识符**。选择器本身并不执行任何操作，它仅仅标识一个方法。选择器方法名称与普通字符串的区别在于**编译器确保选择器是唯一的**。选择器的实用之处在于它（与运行时一起）充当了一个动态函数指针，对于给定的名称，自动指向适合用于哪个类的方法实现。假设你有一个用于方法 `run` 的选择器，并且有类 `Dog`、`Athlete` 和 `ComputerSimulation`（每个类都实现了一个 `run` 方法）。选择器可以与每个类的实例一起使用，以调用其 `run` 方法，尽管每个类的实现可能不同。

## Getting a Selector


编译后的选择器的变量类型是 `SEL`。有两种常见的获取选择器的方式：

- 在编译时，你可以使用编译器指令 `@selector`。
  - `SEL aSelector = @selector(methodName);`
- 在运行时，你可以使用 `NSSelectorFromString` 函数，其中字符串是方法的名称：
  - `SEL aSelector = NSSelectorFromString(@"methodName");`

你可以使用从字符串创建的选择器，当你的代码需要向某个方法发送一个消息，并且在运行之前你不知道它的名称。

## Using a Selector 

你可以使用选择器来调用方法，使用 `performSelector:` 和其他类似的方法。

```objc
SEL aSelector = @selector(run);
[aDog performSelector:aSelector];
[anAthlete performSelector:aSelector];
[aComputerSimulation performSelector:aSelector];
```

（你会在特殊情况下使用这种技术，比如当你实现一个使用目标-动作`target-action`设计模式的对象时。通常情况下，你会直接调用方法。）

### Prerequisite Articles

- [Message](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Message.html#//apple_ref/doc/uid/TP40008195-CH59-SW1)

### Related Articles

- [Dynamic binding](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/DynamicBinding.html#//apple_ref/doc/uid/TP40008195-CH15-SW1)

### Definitive Discussion

- [Working with Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4) [翻译](/tec/basic/programWithOC/子章节/WorkWithObject.md)