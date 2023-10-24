---
title: Object graph

order: 2
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
# Object graph
In an object-oriented program, groups of objects form a network through their relationships with each other—either through a direct reference to another object or through a chain of intermediate references. These groups of objects are referred to as object graphs. Object graphs may be small or large, simple or complex. An array object that contains a single string object represents a small, simple object graph. A group of objects containing an application object, with references to the windows, menus and their views, and other supporting objects, may represent a large, complex object graph.

Sometimes you may want to convert an object graph—usually just a section of the full object graph in the application—into a form that can be saved to a file or transmitted to another process or machine and then reconstructed. This process is known as archiving.

Some object graphs may be incomplete—these are often referred to as partial object graphs. Partial object graphs have placeholder objects that represent the boundaries of the graph and that may be filled in at a later stage. An example is a nib file that includes a placeholder for the File’s Owner.

# 对象图

在面向对象的程序中，对象的群组通过它们之间的关系形成一个网络，这些关系可以是直接引用其他对象，也可以是通过中间的引用链连接在一起。这些对象的群组被称为对象图。对象图可以小或大，简单或复杂。包含一个字符串对象的数组对象代表一个小而简单的对象图。包含应用程序对象、窗口、菜单以及它们的视图和其他支持对象引用的对象群组可能代表一个大而复杂的对象图。

有时，你可能希望将一个对象图（通常是应用程序中完整对象图的一部分）转换为一个可以保存到文件或传输到另一个进程或机器并进行重建的形式。这个过程被称为归档`archiving`。

有些对象图可能是不完整的，通常被称为部分对象图。部分对象图包含代表图的边界的占位符对象，这些占位符可以在稍后的阶段进行填充。一个例子是一个包括 File's Owner 占位符的 Nib 文件