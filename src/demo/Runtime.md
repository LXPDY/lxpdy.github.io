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

[Objective-C Runtime](https://yulingtianxia.com/blog/2014/11/05/objective-c-runtime/)

杨老师基本上翻译了苹果的文章，加上的自己的理解，有些部分没有翻译，看的我满头大汗

~~但是直接看感觉还是一知半解，而且全抄了我写什么。~~

[Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008048-CH1-SW1)

苹果这篇来自2009年的文章看的头疼，建议把侧栏关了然后放大看。Google翻译的稀烂，还得是看原文自己来。

~~发现chatGPT翻译的挺好的,这就是时代的进步吗~~

### 为什么要引入Runtime机制

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

Runtime是一个具有公共接口的**动态共享库**，该接口由 位于目录`/usr/include/objc`中**头文件**中的 一组**函数和数据结构**组成。其中许多函数允许程序员使用普通的C语言来自己实现Objective-C代码编译时编译器的操作。而其他函数则构成了OC的功能基础。这些函数使得程序员能够开发其他接口到Runtime系统，成为增强开发环境的工具。在编写Objective-C代码时，程序员通常通常不需要直接使用这些基础函数。不过有时在编写Objective-C程序时，一些Runtime函数可能会有用。所有这些函数都在"Objective-C Runtime Reference"中有文档记录【苹果的这个链接已经挂掉了哈哈哈（一点都不好笑）】。

【这段怎么写都有点别扭】

## Messaging消息函数

### 引子

这一章描述了如何将消息表达式转换为`objc_msgSend`函数调用，如何通过方法名称引用方法。解释了如何利用`objc_msgSend`，如果有需要的话还可以实现规避动态绑定。

`动态绑定，熟悉的词，想起C++的虚函数表，感觉这个机制比虚函数离谱多了`

### The objc_msgSend Function 消息发送函数

我们知道OC的底层是由C/C++实现的，而对于编译器来说方括号`[receiver message]`的实现则是以转化为一下形式

`bjc_msgSend(receiver, selector)//不带参数`

`objc_msgSend(receiver, selector, arg1, arg2, ...)//带参数，应该是用可变参数列表实现的`

消息函数执行**动态绑定**所需的操作如下：

- 首先，它查找`selecor`指向的`过程procedure`（方法的实现）。由于不同类实现的同名函数的存在，具体找到哪个方法取决于`receiver`所在的类
- 然后，它调用该`过程`，将接收对象`(receiving object)`（指向其数据的指针）【是不是类似`C++的this指针`】和参数列表传递给该`过程`。
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

- 当向对象发送消息时，消息函数会按照对象的`isa`指针到达类结构，然后在分发表中查找方法`selector`
  - 如果在类中找不到`selector`，`objc_msgSend`会跟随指向超类的指针，并尝试在其分发表中查找选择器。连续的失败会导致`objc_msgSend`遍历类层次结构，直到达到NSObject类
  - 一旦找到`selector`，函数将调用表中输入的方法，并将`接收对象的数据结构`传递给它

以上即是Runtime系统进行动态绑定的实现过程。`用术语来说就是：methods are dynamically bound to messages`



为了加速消息传递过程，`Runtime`系统会缓存使用的`selectors`和方法的地址。每个类都有一个单独的**缓存**，它可以包含继承方法的`selector`以及类中定义的方法的`selector`。在搜索分发表之前，消息例程首**先检查接收对象类的缓存**（理论上，曾经使用过的方法可能会再次使用）。如果方法选择器在缓存中，消息传递只比函数调用略慢。一旦程序运行足够长时间以“热身”其缓存，几乎所有发送的消息都会找到缓存的方法。缓存会动态增长以适应程序运行时的新消息。

### 使用隐藏参数

当`objc_msgSend`找到实现方法的过程时，它会调用该过程并将消息中的所有参数传递给它。它还会将两个隐藏参数传递给该过程：

- 接收对象
- 方法的`selector`

这些参数使每个方法的实现都能明确了解调用它的消息表达式所拥有的两个部分。它们被称为**隐藏参数**，因为它们并不在定义方法的源代码中声明。它们是在编译代码时插入到实现中的 。

尽管这些参数没有明确声明，源代码仍然可以引用它们（就像它可以引用接收对象的实例变量一样）。一个方法将接收对象引用为`self`(`this指针这不就来了`)，将自己的选择器引用为`_cmd`。在下面的示例中，`_cmd`引用了`strange`方法的`selector`，`self`引用了接收`strange`消息的对象

```objective-c
- (id)strange
{
    id  target = getTheReceiver();
    SEL method = getTheMethod();
 
    if ( target == self || method == _cmd )
        return nil;
    return [target performSelector:method];
}
```

`self`是这两个参数中更有用的。实际上，它是将接收对象的实例变量提供给方法定义的方式。`这不还是this指针`

### 获取方法地址

规避动态绑定的唯一方法是获取方法的地址，然后直接调用它，就像它是一个函数一样。这可能适用于当特定方法将在连续执行多次并且程序员希望避免每次执行方法时的消息传递开销的罕见情况。

使用NSObject类中定义的方法

- `methodForSelector:`，就可以请求指向实现方法的过程的指针，然后就能通过使用指针调用该过程。
  - 通过该方法返回的指针必须小心地**强制转换为正确的函数类型**。强制转换应包括返回和参数类型。

`从这里开始，这些方法我就保留了原文方法名中的冒号，而不是只保留方法名，在了解了消息机制后，冒号的存在还真无法忽视`

下面的示例显示了如何直接调用实现`setFilled:`方法的过程：

```objective-c
void (*setter)(id, SEL, BOOL);//声明了函数指针，参数分别是两个“隐藏参数”和一个方法原参数
int i;
 
setter = (void (*)(id, SEL, BOOL))[target
    methodForSelector:@selector(setFilled:)];
for (i = 0; i < 1000; i++)
    setter(targetList[i], @selector(setFilled:), YES);

//请注意，methodForSelector:由Cocoa运行时系统提供，它不是Objective-C语言本身的特性
```

传递给过程的前两个参数是接收对象（self）和方法选择器（_cmd）。这些参数在方法语法中是隐藏的，但在调用方法作为函数时必须显式提供。

## Dynamic Method Resolution 动态方法解析

本章描述了如何可以动态提供方法的实现。

### Dynamic Method Resolution

有些情况下，您可能希望动态提供方法的实现。例如，Objective-C中的声明属性特性（参见[The Objective-C Programming Language](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Introduction/introObjectiveC.html#//apple_ref/doc/uid/TP30001163)中的“Declared Properties”）包括`@dynamic`指令

```objective-c
@dynamic propertyName;
```

**这告诉编译器与该属性相关的方法将会以动态方式提供**。

程序员可以通过实现`resolveInstanceMethod:`和`resolveClassMethod:`方法来动态地为给定`selector`提供实例方法和类方法的实现。

Objective-C方法本质上是接受至少两个参数的C函数——`self`和`_cmd`。您可以使用函数`class_addMethod`将一个函数添加到一个类作为方法。因此，给定以下函数

```objective-c
void dynamicMethodIMP(id self, SEL _cmd) {
    // 实现....
}
```

然后就可以使用`resolveInstanceMethod:`将它动态添加到类作为一个名为`resolveThisMethodDynamically`的方法，像这样：

```objective-c
@implementation MyClass
+ (BOOL)resolveInstanceMethod:(SEL)aSEL
{
    if (aSEL == @selector(resolveThisMethodDynamically)) {
          class_addMethod([self class], aSEL, (IMP) dynamicMethodIMP, "v@:");
          return YES;
    }
    return [super resolveInstanceMethod:aSEL];
}
@end
```

方法转发（如在"消息转发"中描述）和动态方法解析在很大程度上是独立的。**在转发机制生效之前**，类有机会**动态解析**方法。如果调用了`respondsToSelector:`或`instancesRespondToSelector:`，则动态方法解析器有机会首先为选择器提供一个`IMP`。如果您实现了`resolveInstanceMethod:`，**但希望特定选择器实际上通过转发机制进行转发，您可以为这些选择器返回NO**。



#### 补充：IMP是什么 

摘自杨老师的文章：

`IMP`在`objc.h`中的定义是：

```objective-c
typedef void (*IMP)(void /* id, SEL, ... */ );
```

它就是一个[函数指针](http://yulingtianxia.com/blog/2014/04/17/han-shu-zhi-zhen-yu-zhi-zhen-han-shu/)，这是由编译器生成的。当你发起一个 OC 消息之后，最终它会执行的那段代码，就是由这个函数指针指定的。而 `IMP` 这个函数指针就指向了这个方法的实现。既然得到了执行某个实例某个方法的入口，我们就可以绕开消息传递阶段，直接执行方法，也就是上面提到的动态方法解析。

你会发现 `IMP` 指向的方法与 `objc_msgSend` 函数类型相同，参数都包含 `id` 和 `SEL` 类型。每个方法名都对应一个 `SEL` 类型的方法选择器，而每个实例对象中的 `SEL` 对应的方法实现肯定是唯一的，**通过一组 `id` 和 `SEL` 参数就能确定唯一的方法实现地址；反之亦然**。

### Dynamic Loading 动态加载

注：这段基本照搬GPT翻译

Objective-C程序可以**在运行时加载和链接新的类和分类**。新的代码被合并到程序中，与在启动时加载的类和分类一样对待。

动态加载可以用于执行各种不同的任务。例如，System Preferences应用程序中的各个模块是动态加载的。

在Cocoa环境中，动态加载通常用于允许应用程序进行定制。**其他人可以编写模块，您的程序在运行时加载这些模块**，就像Interface Builder加载自定义调色板和OS X System Preferences应用程序加载自定义首选项模块一样。可加载模块扩展了您的应用程序的功能。它们以「您允许但自己可能没有预期或定义的方式」为其做出贡献。您提供了框架，但其他人提供了代码。【不得不说直译还是看起来别扭】

尽管存在一个执行Objective-C模块动态加载的runtime函数（`objc_loadModules`，在`objc/objc-load.h`中定义），Cocoa的`NSBundle`类提供了一个更为方便的动态加载接口，这是一种面向对象的接口，与相关服务集成在一起。有关`NSBundle`类及其用法的信息，请参阅Foundation框架参考中的`NSBundle`类规范。有关Mach-O文件的信息，请参阅OS X ABI Mach-O文件格式参考。

## Message Forwarding 消息转发

`Sending a message to an object that does not handle that message is an error. However, before announcing the error, the runtime system gives the receiving object a second chance to handle the message.`也就是说，如果我们向一个对象发送了错误的消息，消息转发机制能够作为容错了来第二次处理这个消息。

### Forwarding 转发机制