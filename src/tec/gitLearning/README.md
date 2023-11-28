---
title: Git原理及实用技巧
order: 1
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-18
category:
  - 学习
tag:
  - Git
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: true
---

# Git原理及实用技巧

## Git的储存原理

当你使用`git init`创建在一个目录创建一个本地仓库后，会在目录下生成一个`.git`文件夹，而这个文件夹就是git相关的数据库。

#### 当你进行`本地修改-git add - commit - push`时，本地发生了什么？

- `git add a.txt`加入到暂存区
  - `.git/objects`下新生成了一个文件(`object`)，其中存储了我们新添加文件到**哈希值**
    - 该哈希值一般使用前6位即可，后置位为冗余
    - 使用命令`git cat-file -t`查看类型，`git cat-file -p`查看内容
    - 在这个情况下，生成的类型查看为`blob`
- `git commit -m 'init'`
  - `.git/objects`下新生成了一系列`object`
    - 对于类型为`tree`的，其内容为文件快照，包括`文件权限 文件类型 文件哈希值 文件名`的列表
    - 对于类型为`commit`的，其内容为**项目快照**，包括作者信息、提交时间和其他提交信息

Git就是通过这样的哈希值作为指针，来对文件进行管理。

- 对于上面的例子，也就是生成了对应`blob object`储存内容，又生成了一个`tree object`来储存目录的快照，然后通过一个`commit object`来存储提交的信息，并且它们的信息都是通过哈希值作为指针去指向的。

对于当前分支，git在HEAD文件中明文储存，明文指向一个文件，文件中储存着哈希值，指向上一个`commit object`

综合以上存储结构，git形成了一个有向无环图，也就是一颗哈希树/DAG，树根为HEAD，也就是指向当前分支的`refs`指针,树叶为`blob object`

- `Git object`(blob tree commit) 只要文件不被修改，就可以被复用，但是其本身不允许变更
- `refs`指针可以被修改
- 采用`tree object`储存文件名，可以非常方便地复用`blob object`
- 若`blob object`的内容发生改变，其哈希值也发生改变，又由于git分布式的特性，即使能够修改一台机器上的所有对应哈希值，也无法改变其他机器上的内容，所以git不会被轻易篡改

## 可视化Git操作

#### Git的三个分区

- 工作目录（working directory）
  - **操作系统上的文件**，所有代码开发编辑都在这上面完成
- 索引（index or staging area）
  - 一个暂存区域，会在下一次commit被提交到Git仓库
  - 是`tree object`
- Git仓库（git repository）
  - 由`Git object`记录着每一次提交到快照，以及链式结构记录的提交变更历史 

但是，由于每次都生成新的文件快照，是否会影响性能？

- 新快照对比存储变更，能够快速获取读取
- 对于空间，Git拥有一套`git gc`机制，会在空间太大或者网络请求时将变更部分压缩成pack 

`git reset`

- `--soft HEAD~`只更改HEAD指针到上一个commit版本
- `[--mixed] HEAD~`更改HEAD指针到上一个commit版本,并修改index
- `--hard HEAD~`更改HEAD指针到上一个commit版本,修改index和工作区 

## 分支合并

- 举个分支合并造成文件缺失导致bug的例子