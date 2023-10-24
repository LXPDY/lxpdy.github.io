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

待翻译