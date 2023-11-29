---
title: Git原理及实用技巧
order: 1
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-11-28
category:
  - 学习
tag:
  - Git
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 本文禁止转载
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

## 可视化Git操作

综合以上存储结构，git形成了一个有向无环图，也就是一颗哈希树/DAG，树根为HEAD，也就是指向当前分支的`refs`指针,树叶为`blob object`

- `Git object`(blob tree commit) 只要文件不被修改，就可以被复用，但是其本身不允许变更
- `refs`指针可以被修改
- 采用`tree object`储存文件名，可以非常方便地复用`blob object`
- 若`blob object`的内容发生改变，其哈希值也发生改变，又由于git分布式的特性，即使能够修改一台机器上的所有对应哈希值，也无法改变其他机器上的内容，所以git不会被轻易篡改

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
  - A<-C<-E<-E'(master) ;A<-B<-D
    - 小明在A的分支B上进行开发，添加了一个文件http.js，然后合并进入C形成E
    - E有bug，回滚为E'
    - 小明在B的基础上继续开发,添加了main,js，import了http.js，然后尝试将D合并到master上
    - 合并没有报错，尝试运行master分支，发现缺少了http.js这个文件无法运行
  - 合并前文件还在，合并后不见了

#### 如何合并两个文件内容

- Three-way merge 三向合并

  - <img src="https://marsishandsome.github.io/images/2019-7-24-Three_Way_Merge/three-way.png" alt="three-way" style="zoom:50%;" />

  - `Three-way merge`是在`Two-way merge`的基础上又增加了一个信息，即两个需要合并的文件修改前的版本。如下图所示，merge算法现在知道三个信息：
    - `Mine`：需要合并的一个文件
    - `Yours`：另一个需要合并的文件
    - `Base`：两个文件修改前的版本
  - 引入三向合并，Git就能知道哪些部分修改了，哪些部分添加了，哪些部分冲突了（三向都不一样）

#### Git merge策略

- `Fast-forward`
  - 对于两天没有分叉的分支的默认行为
  - 使用`-no-ff`关闭
- `Recursive`**（重点）**递归合并
  - 找到最短路径的共同祖先节点作为base节点，然后做三向合并
  - 在复杂情况下，若出现多个同路径长的祖先节点（A和B）
    - 则继续对同路径长的祖先节点进行递归查找，直到找到唯一共同祖先
    - 使用这个共同祖先，对A和B进行合并，获得一个临时节点C
    - 再向上做三向合并，直到合并完成
- `Ours`/`Theirs`
  - 只用一个分支的内容
- `Octopus`
  - 多分支合并时使用
  - 多在测试时使用

正常情况下，Git会自动选择最合适的策略，若需要手动选择，则使用如下命令

- `git merge -s [策略名]`

`git rebase`

- 会生成一个新的`commit object`节点
- `git rebase -i [commit节点]`
  - 使用后可以修改之前的提交记录、做压缩

#### rebase or merge

- merge会保留完整的分支情况、真实commit时间等等
- rebase则可以调整出清晰的代码修改历史记录
- 可以根据团队习惯来选择更合适的方法
- 但是有一点需要注意：**不可以对已经处于远端的分支做rebase**
- 前辈的习惯
  - 在自己本地或者是确定只有一个人使用的分支下，使用rebase
  - 其他情况使用merge

## Git实用技巧

#### 误操作导致分支不见了，如何恢复

- 使用`git reflog master`查看master指针指过的地方
  - 也就是版本控制的版本控制

- 寻找对应节点的哈希值，使用git reset还原

#### 获得干净的工作目录

`git -reset --hard HEAD`

`git checkout -f`

这两个都会导致丢失文件

建议：使用`git stash push [-u]`

#### 禁止修改远端分支的历史

若发生了修改远端分支的历史，如何解决（这里用到了上面说过的合并问题的例子）

`git cherry-pick E`//在master分支把E这个提交应用到master分支上

或

`git rebase --onto C' C E`//在C'上把C-E的commit合并

#### 撤销一个本地合并

使用`git reset`

#### 撤销一个远端合并

`git revert -m 1 E`//新建一个节点回滚

#### 从历史中删除一个文件

敏感信息、不需要版本控制的超大文件

`git filter -branch --tree-filter 'rm -f password.txt' HEAD`

高危操作，需要所有人一起

#### 其他

- `git commit --amend`
  - 用新的commit覆盖你上次的commit
- `git show-branch`
  - 快捷查看分支
- `git blame`
  - 看看代码是谁写的
  - ~~用于甩锅~~
- `git bisect`
  - 通过二分查找寻找出问题的那个commit

