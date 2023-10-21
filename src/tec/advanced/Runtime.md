---
title: Runtime机制

order: 1
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

学习OC，看到的文章中隐约中提到了OC的所谓“函数调用”其实是向持有类/实例发送消息从而达到调用效果，进一步了解OC的内存管理机制后，发现不同于C++，OC的内存管理有ARC、自动释放池这些“魔法”机制，而这些机制的又建立在这个神秘的Runtime机制上。

笔者的这篇文章大部分翻译自苹果，部分参考杨老师的文章，【】和`代码块`中是我添加的想法,或者一些照搬的原文。

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
The Objective-C language defers as many decisions as it can from compile time and 
link time to runtime. Whenever possible, it does things dynamically. This means 
that the language requires not just a compiler, but also a runtime system to 
execute the compiled code. The runtime system acts as a kind of operating system 
for the Objective-C language; it’s what makes the language work。 
—— 摘自苹果官方文档
```

Objective-C 这门语言会尽可能多的决策从编译时和链接时**推迟到运行时**。只要有可能，它就会**动态**地执行操作。这意味着该语言不仅需要编译器，还需要Runtime系统来执行编译后的代码。Runtime机制某种程度上充当了该语言的操作系统，让这门语言能够运作起来。

## 与Runtime交互

与Runtime系统的交互可以分为三个层级

- 通过源代码
- 通过类方法（来自Foundation 框架的NSObject类）
- 对Runtime函数直接调用

现在对这三种方法进行简单的介绍

### Source Code 源代码交互

``“在大部分时候,Runtime系统都自动地运行在幕后，你只需要编写和编译OC”``

OC的编译器会为OC类和方法创造【符合动态特性的】数据结构以及方法

- 数据结构会捕获类以及类的`Category`（分类）的定义、协议（`Protocols`）的声明以及方法选择器`selector`、实例变量模板`instance variable templates`以及其他来自源代码的信息
- 最重要的runtime函数就是**发送消息**的函数`Messaging`，这篇文章的后面也会详细地介绍它

### NSObject 方法交互

大部分类是`NSObject`的子类,同时也继承了它的方法

- 最特殊的例外是 `NSProxy`，它是个抽象超类，它实现了一些消息转发有关的方法，可以通过继承它来实现一个其他类的替身类或是虚拟出一个不存在的类.【这在后面的`message foewarding消息转发`的`Surrogate Objects代理对象`部分会讲到】

NSObject的方法因此为每个子类的实例和类对象建立了固有行为，当然也有些例外，NSObject仅仅定义了模版【一些事情应该怎么去做】而不提供实现代码。【`也就是所谓的抽象接口`】

- 比如说NSObject定义了一个`description`实例方法【返回一个string描述这个类内容物】
  - `重载它并为你定义的类提供描述内容`
  - 这主要用于GDB在debug时【print-object 指令】打印这个从描述方法返回的字符串
    - 这个方法不知道它所要描述的类实际的的「实现」是怎么样的，所以它返回了一个字符串，包含了类名和地址。而NSObject的子类可以通过「重写/实现」这个方法以返回更多详细信息
      - Foundation类NSArray的`description`会返回其包含的对象的描述列表
- NSObject的一些方法仅仅是用于查询Runtime系统的信息
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

### Runtime function 运行时函数

Runtime是一个具有公共接口的**动态共享库**，该接口由 位于目录`/usr/include/objc`中**头文件**中的 一组**函数和数据结构**组成。其中许多函数允许程序员使用普通的C语言来自己实现OC代码编译时编译器的操作。而其他函数则构成了OC的功能基础。这些函数使得程序员能够开发其他接口到Runtime系统，成为增强开发环境的工具。在编写OC代码时，程序员通常通常不需要直接使用这些基础函数。不过有时在编写OC程序时，一些Runtime函数可能会有用。所有这些函数都在"Objective-C Runtime Reference"中有文档记录【苹果的这个链接已经挂掉了哈哈哈（一点都不好笑）】。

【这段怎么写都有点别扭，苹果的在某些方面真的事无巨细】

## Messaging消息函数

### 引子

这一章描述了如何将消息表达式转换为`objc_msgSend`函数调用，如何通过方法名称直接引用方法。解释了如何利用`objc_msgSend`，如果有需要的话还可以通过代码来规避动态绑定。

`动态绑定，熟悉的词，想起C++的虚函数表，感觉这个机制比虚函数离谱多了`

### The objc_msgSend Function 消息发送函数

我们知道OC的底层是由C/C++实现的，而对于编译器来说方括号`[receiver message]`的实现则是以转化为一下形式

`bjc_msgSend(receiver, selector)//不带参数`

`objc_msgSend(receiver, selector, arg1, arg2, ...)//带参数，应该是用可变参数列表实现的`

消息函数执行**动态绑定**所需的操作如下：

- 首先，它查找`selecor`指向的过程`procedure`（方法实际上被实现的地方）。由于不同类实现存在同名函数，具体找到哪个方法取决于`receiver`所在的类【只要有确切的`selector`和`receiver`，就可以找到对应唯一的那个方法(当然是那个方法存在的情况下)】
- 然后，它调用该过程，将接收对象`(receiving object)`（指向其数据的指针）【是不是类似`C++的this指针`】和参数列表传递给该过程。
- 最后，它将过程的返回值传递作为自己的返回值

```
Note: 
The compiler generates calls to the messaging function. 
You should never call it directly in the code you write. 
—— 苹果官方文档

这是提醒你永远不要直接在自己写的代码里尝试直接调用消息函数，不知道有没有好奇的程序员去试过。
```

消息的关键在于编译器为类和对象所构造的数据结构，该数据结构有两个基本元素（这又回到我前面写的OC基础了）

```
- 一个指向超类的指针
- 我们伟大而神秘的isa
```

- `isa `,也就是类分发表
  - 【在我前面的文章中，提到了它指向的数据结构是元类，其实就是类方法被实现的地方】
  - 【在本文中】，类分发表会讲方法`selector`和它们表示的方法的类的特定地址关联起来
    - 例如，`setOrigin`方法的选择器与「`setOrigin`的实现」的地址相关联，`display`方法的选择器与`display`的地址相关联

当创建一个新**对象**【类的实例】时，会分配内存，初始化其实例变量。对象拥有的变量中的第一个就是指向其「类结构」的指针。这个指针被称为`isa`，它使对象可以访问其**类**，通过类可以访问其继承的所有类。

```
Note: While not strictly a part of the language, the isa pointer is required for
an object to work with the Objective-C runtime system. An object needs to be 
“equivalent” to a struct objc_object (defined in objc/objc.h) in whatever fields 
the structure defines. However, you rarely, if ever, need to create your own 
root object, and objects that inherit from NSObject or NSProxy automatically 
have the isa variable.—— 苹果官方文档

注意：虽然isa指针严格来说不属于语言的一部分，但它是对象与Runtime系统一起工作所必需的……
定义一个对象相当于struct objc_object（在objc/objc.h中定义）
从NSObject或NSProxy继承的对象会自动具有isa变量。
```

<img src="https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Art/messaging1.gif" alt="messaging1" style="zoom:70%;" /> <img src="http://yulingtianxia.com/resources/Runtime/class-diagram.jpg" alt="class-diagram" style="zoom:40%;" />

【看图其实还算好懂，前提是你把有关类的数据结构的文章认真看了】

- 当向对象发送消息时，消息函数会按照对象的`isa`指针到达类结构，然后在分发表中查找方法对应的`selector`
  - 如果在类中找不到`selector`，`objc_msgSend`会跟随指向超类的指针，并尝试在其分发表中继续查找。连续的失败会导致`objc_msgSend`遍历类层次结构，直到达到NSObject类
  - 一旦找到`selector`，函数将调用表中输入的方法，并将`接收对象的数据结构`传递给它

以上即是Runtime系统进行动态绑定的实现过程。`用术语来说就是：methods are dynamically bound to messages`

为了加速消息传递过程，`Runtime`系统会缓存使用的`selectors`和方法的地址。每个类都有一个单独的**缓存**，它可以包含继承方法的`selector`以及类中定义的方法的`selector`。在搜索分发表之前，消息例程首**先检查接收对象类的缓存**（理论上，曾经使用过的方法可能会再次使用）。如果方法选择器在缓存中，消息传递只比函数调用略慢。一旦程序运行足够长时间以“热身”其缓存，几乎所有发送的消息都会找到缓存的方法。缓存会动态增长以适应程序运行时的新消息。

### 使用隐藏参数

当`objc_msgSend`找到「实现方法的过程」时，它会**调用**该过程并将消息中的所有参数传递给它。它还会将两个隐藏参数传递给该过程：

- 接收对象`The receiving object`
- 方法的selector `The selector for the method`

这些参数使每个方法的实现都能明确了解调用它的消息所拥有的两个部分。

- 它们被称为**隐藏参数**，因为它们并不在定义方法的源代码中声明。它们是在**编译代码时**插入到实现中的 。

尽管这些参数没有明确声明，源代码仍然可以引用它们（就像它可以引用接收对象`receiving object`的实例变量一样）。一个方法将接收对象引用为`self`(`this指针这不就来了`)，将自己的选择器引用为`_cmd`。

在下面的示例中，`_cmd`引用了`strange`方法的`selector`，`self`引用了接收`strange`消息的对象

```objective-c
- strange
{
    id  target = getTheReceiver();
    SEL method = getTheMethod();
 
    if ( target == self || method == _cmd )
        return nil;
    return [target performSelector:method];
}
```

`self`是这两个参数中更有用的。实际上，它是将接收对象的实例变量提供给方法定义的方式。`这不还是this指针`

#### 补充：SEL是什么？（摘自杨老师的文章）

`objc_msgSend`函数第二个参数类型为`SEL`，它是`selector`在Objc中的表示类型（Swift中是`Selector`类）。`selector`是方法选择器，可以理解为**区分方法的 ID**，而这个 ID 的数据结构是`SEL`:

```
typedef struct objc_selector *SEL;
```

其实它就是个映射到方法的C字符串，你可以用 Objc 编译器命令 `@selector()` 或者 Runtime 系统的 `sel_registerName` 函数来获得一个 `SEL` 类型的方法选择器。

**不同类中相同名字的方法所对应的方法选择器是相同的**，即使方法名字相同而变量类型不同也会导致它们具有相同的方法选择器，于是 Objc 中方法命名有时会带上参数类型(`NSNumber` 一堆抽象工厂方法拿走不谢)，Cocoa 中有好多长长的方法哦。



### 获取方法地址

**规避动态绑定**的唯一方法是获取方法的地址，然后直接调用它，就像它是一个函数一样。这可能适用于当特定方法将会连续地执行多次，并且程序员希望避免每次执行方法时都因为消息传递机制产生额外的开销。

- 使用NSObject类中定义的方法`methodForSelector:`就可以**请求指向实现方法的过程的指针**，然后就能通过使用指针调用该过程。
  - 通过该方法返回的指针必须小心地**强制转换为正确的函数类型**。强制转换应包括返回和参数类型。

`从这里开始，这些方法我就保留了原文方法名中的冒号，而不是只保留方法名，在了解了消息机制后，冒号的存在还真无法忽视`

下面的示例显示了如何直接调用实现`setFilled:`方法的过程：

```objective-c
void (*setter)(id, SEL, BOOL);//声明了函数指针setter，参数分别是两个“隐藏参数”和一个方法原参数
int i;
 
setter = (void (*)(id, SEL, BOOL))[target
    methodForSelector:@selector(setFilled:)];//将获取的指针存入变量setter中
for (i = 0; i < 1000; i++)
    setter(targetList[i], @selector(setFilled:), YES);//在这里调用了一千次setter，不需要消息机制
//@selector(setFilled:)就是用来获取setFilled的SEL的
//请注意，methodForSelector:由Cocoa运行时系统提供，它并不是Objective-C语言本身的特性
```

传递给过程的前两个参数是接收对象（self）和方法选择器（_cmd）。这些参数在方法语法中是隐藏的，但在调用方法作为函数时**必须显式提供**。

## Dynamic Method Resolution 动态方法解析

本章描述了如何可以**动态提供方法的实现**。

![QQ20141113-1@2x](http://yulingtianxia.com/resources/QQ20141113-1@2x.png)

### Dynamic Method Resolution 动态方法解析

有些情况下，程序员可能想要动态地提供方法的实现。

例如，Objective-C中的声明属性特性（参见[The Objective-C Programming Language](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Introduction/introObjectiveC.html#//apple_ref/doc/uid/TP30001163)中的“Declared Properties”）包括`@dynamic`指令

```objective-c
@dynamic propertyName;
```

**这告诉编译器与该属性相关的方法将会以动态方式提供**。

程序员可以通过实现`resolveInstanceMethod:`和`resolveClassMethod:`方法来**动态地**为给定的`selector`所对应的实例方法和类方法**提供实现**。

Objective-C方法本质上是一个接受至少两个参数的C函数（接受`self`和`_cmd`）。

程序员可以使用函数`class_addMethod`将一个函数添加到一个类作为方法。因此，给定以下函数

```objective-c
void dynamicMethodIMP(id self, SEL _cmd) {
    // 实现....
}
```

在这之后，就可以使用`resolveInstanceMethod:`方法将这个实现动态地添加到目的类中一个名为`resolveThisMethodDynamically`的方法，像这样：

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

方法转发`Forwarding`（在后问的"消息转发"`Message Forwarding`中提到的）和动态方法解析`Dynamic Method Resolution`在很大程度上是独立的。

- **在转发机制生效之前**，类有机会**动态解析**方法。如果调用了`respondsToSelector:`或`instancesRespondToSelector:`，则动态方法解析器有机会首先为选择器提供一个`IMP`。
- 如果已经实现了`resolveInstanceMethod:`，**但希望特定选择器实际上通过转发机制进行转发，**则可以为这些选择器返回NO。

【这段的意思也就是说，上面的这种动态方法解析在执行的优先级上是高于消息转发的，在动态解析的方法中，在对应地方返回YES，则对应方法的实现就会由这个方法提供，反之如果返回了NO，则会按照消息机制正常的寻找对应方法的实现】



#### 补充：IMP是什么 (摘自杨老师的文章)

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

`Sending a message to an object that does not handle that message is an error. However, before announcing the error, the runtime system gives the receiving object a second chance to handle the message.`也就是说，如果我们向一个对象发送了错误的消息，消息转发机制能够作为容错了来第二次处理这个消息。引用杨老师的话来说就是“偷梁换柱”。

### Forwarding 转发机制

如果向一个对象发送它不能处理的消息，Runtime系统会在报错之前，发送一个`forwardInvocation:`消息给这个对象【也就是调用这个方法】，附带一个`NSInvocation`对象作为唯一的参数。而`NSInvocation`对象封装了原始消息和随之传递的参数。

程序员可以通过实现`forwardInvocation:`方法来为消息提供**默认响应**，或以其他方式来避免报错。

- 顾名思义，`forwardInvocation:`——用于将消息转发给另一个对象。

为了了解转发的范围和意图，假设以下情景：

- 首先，假设您正在设计一个对象，该对象可以响应一个叫做`negotiate`的消息，**而您希望其响应为另一种对象的响应**。您可以在您实现的`negotiate`方法的**某个地方**将`negotiate`消息**传递给另一个对象**。

- 再进一步，假设您希望您的对象对`negotiate`消息的响应与另一个类中实现的响应**完全相同**。但由于这两个类可能来自不同继承体系的不同位置，导致**无法通过继承来直接实现**完全相同的功能。【OC没有像C++一样能够直接实现多继承的机制】

但是通过消息转发机制，可以借用其他类的方法，该方法只需将消息传递到另一个类的实例：

```objective-c
- negotiate
{
    if ([someOtherObject respondsTo:@selector(negotiate)])
        return [someOtherObject negotiate];
    return self;
}
//看不懂也没事，因为这个方法会被丢掉
```

但是以这种方式处理事情可能会有点麻烦，特别是如果有许多消息都需要转发到其他对象的时候。这样程序员不得不去实现一个方法来处理每个从其他类借用的方法。此外，程序员在编写程序的时候可能**无法包含所有**需要转发消息的情况。该集合（需要转发的消息）可能依赖于Runtime的事件，并且可能随着将来实现新的方法和类而**发生变化**。

【这段意思大概就是讲这种写死的方法很可能无法涵盖所有需要转发消息的情况，更别提Runtime系统还支持边运行边追加类和方法了,~~所以上面这个呆呆的方法基本上可以扔掉了~~】

而`forwardInvocation:`提供了另外一种选择【推荐使用的】，这种方法是动态的，而不是静态的【原文还提到这是个`“less ad hoc”`的解决方案，英文就是绕】【本质上就是通过重写它来解决】

它的工作原理如下：当一个对象因为没有匹配的`selector`而无法响应一个消息时

- Runtime系统通过发送一个「`forwardInvocation:`消息」来通知对象【也就是调用这个方法】。
- 每个对象都从`NSObject`类继承了「`forwardInvocation:`方法」。
  - 但是，`NSObject`的版本只是调用了`doesNotRecognizeSelector:`。【顾名思义找不到选择器，应该就报错了】
- 通过重写`NSObject`的版本并实现自己的版本，程序员就可以利用「`forwardInvocation:`消息」提供的机会来将消息转发给其他对象。

为了转发一个消息，「`forwardInvocation:`方法」只需要做两件事

- 确定消息应该**去哪里**

- 把消息以及原始参数**发到「那个地方」**

- 消息可以通过`invokeWithTarget:`方法」发送

  - ```objective-c
    - (void)forwardInvocation:(NSInvocation *)anInvocation
    {
      //该消息的唯一参数是个NSInvocation类型的对象——该对象封装了原始的消息和消息的参数
        if ([someOtherObject respondsToSelector:[anInvocation selector]])
          //先要判断转发目的地有没有这个selector，不然转了没用就尴尬了
            [anInvocation invokeWithTarget:someOtherObject];//进行转发
        else
            [super forwardInvocation:anInvocation];
    }
    ```

  - 被转发的消息的**返回值将返回给原始发送方**。转发消息的返回值可以是任何类型，包括`id`、结构体和双精度浮点数

  - 在`forwardInvocation:`消息发送前，Runtime系统会向对象发送`methodSignatureForSelector:`消息，并取到**返回**的**方法签名**用于生成`NSInvocation`对象。

  - 所以我们在重写`forwardInvocation:`的同时也要重写`methodSignatureForSelector:`方法，否则会抛异常

`forwardInvocation:`方法可以**作为未被识别的消息的分发中心**，将它们分发给不同的接收者。或者也可以说它是一个传输站，将所有消息发送到对应的目标。同时，它也可以将一个消息翻译成另一个消息，或者只是"吞咽"掉一些消息，使这些被处理掉的消息没有响应或者报错。这个方法还可以将多个消息合并成一个单一的响应，它功能取决于实现者。但是，它为程序设计打开了对象链接在转发链中的可能性。

```
Note: The forwardInvocation: method gets to handle messages only if they don’t 
invoke an existing method in the nominal receiver. If, for example, you want
your object to forward negotiate messages to another object, it can’t have a 
negotiate method of its own. If it does, the message will never reach 
forwardInvocation:
//说白了就是类自己能处理的消息不可能被转发，想要转发就不能有原生解决方案
For more information on forwarding and invocations, see the NSInvocation class 
specification in the Foundation framework reference.
```

### Forwarding and Multiple Inheritance 转发和多继承

【终于到了又一重量级部分——多继承】

通过转发的形式模仿继承能够在OC中实现一些多继承的效果。【这句话原文`Forwarding mimics inheritance, and can be used to lend some of the effects of multiple inheritance to Objective-C programs.`拗口得连GPT都给整不会了】下图即为一种示例，通过一次消息转发，似乎就能实现继承相应方法的功能。

![forwarding](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Art/forwarding.gif)

`In this illustration, an instance of the Warrior class forwards a `negotiate` message to an instance of the Diplomat class. The Warrior will appear to negotiate like a Diplomat. It will seem to respond to the `negotiate` message, and for all practical purposes it does respond (although it’s really a Diplomat that’s doing the work).`

在上图中`Warrior`和`Diplomat`没有继承关系，但是`Warrior`将`negotiate`消息转发给了`Diplomat`后，就好似`Diplomat`是`Warrior`的超类一样。

转发提供了大多数能由多继承实现的功能。但是，它们之间有一个重要的区别：

- 多继承是将不同的功能合并到一个单个对象中。它倾向于制造一个大型、多功能的对象。
- 转发为不同的对象分配了不同的职责。它将问题**分解成更小的对象**，但将这些对象以「**对消息发送者透明的方式**」关联起来。

```
消息转发弥补了 Objc 不支持多继承的性质，也避免了因为多继承导致单个类变得臃肿复杂。
它将问题分解得很细，只针对想要借鉴的方法才转发，而且转发机制是透明的
—— 杨老师
```

### Surrogate Objects 代理对象

转发不仅模拟能多重继承的功能，还使开发轻量级的**代理对象**成为可能，这些代理对象代表或"覆盖"更实质的对象。代理对象代替其他对象，将消息传递给它.

在*[The Objective-C Programming Language](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Introduction/introObjectiveC.html#//apple_ref/doc/uid/TP30001163)*中的“远程消息传递`Remote Messaging`”中讨论的代理就是这样的。代理负责将消息**转发**到远程接收者，确保参数值在连接上被确切地复制和送达。但它其他更复杂的功能；它不会复制远程对象的功能，只是**为远程对象提供了一个本地地址**，一个可以在另一个应用程序中接收消息的地方。

【就像网络代理一样，为本地对象和远程对象的消息转发提供了一个代理桥梁】

以下是苹果文章中的例子，不做更多讲解

- 还有其他种类的代理对象也是可能的。例如，假设您有一个处理大量数据的对象，它可能创建复杂的图像或读取磁盘上文件的内容。设置这个对象可能需要很多时间，因此您可能更喜欢懒加载——当它真正需要时，或当系统资源暂时空闲时。与此同时，为了使应用程序中的其他对象正常运行，您至少需要一个占位符对象。

- 在这种情况下，您可以最初创建一个轻量级的代理对象，而不是完整的对象。这个对象可以独立完成一些事情，例如回答关于数据的问题，但它主要是为较大的对象保留位置，并在需要时将消息转发给它。当代理对象的`forwardInvocation:`方法首次接收到目标其他对象的消息时，它会确保对象存在，如果不存在，它会创建对象。所有传递给较大对象的消息都通过代理进行，因此就其他部分程序而言，代理对象和较大对象将是相同的。

### Forwarding and Inheritance 转发和继承

尽管转发模拟了继承的功能，但`NSObject`类永远不会混淆这两者

- 像`respondsToSelector:`和`isKindOfClass:`这样的原生方法只查看继承层次结构，而**不查看转发链**

例如，如果一个Warrior对象被问及它是否能够响应`negotiate`消息：

```objective-c
if ([aWarrior respondsToSelector:@selector(negotiate)])
    ...
  //答案是NO，尽管它可以接收negotiate消息而不出错并对其做出响应
```

如果想要得到与相应行为对应的回答，苹果提供了方法：

在大部分下，NO应该是正确的答案。但在这种情况下这可能不是【行为上】。如果程序员使用转发来设置代理对象或扩展类的功能，则转发机制应该尽可能透明，就像继承一样。**但如果程序员希望应用了转发机制的对象表现得好像它真正继承了它们转发消息的对象的行为**，则需要重新实现`respondsToSelector:`和`isKindOfClass:`方法，来包括转发算法

```objective-c
- (BOOL)respondsToSelector:(SEL)aSelector
{
    if ([super respondsToSelector:aSelector])
        return YES;
    else {
        /* 在这里，测试aSelector消息是否可以被转发到另一个对象，并且该对象是否能够对其做出响应。如果可以，返回YES。 */
    }
    return NO;
}
```

除了`respondsToSelector:`和`isKindOfClass:`之外，`instancesRespondToSelector:`方法也应该反映转发算法。如果使用协议，那么`conformsToProtocol:`方法也应该加入到列表中。同样，如果一个对象转发它接收到的任何远程消息，那么它应该有一个`methodSignatureForSelector:`的版本，它可以返回对转发消息最终响应的方法的准确描述。例如，如果一个对象能够将消息转发到它的代理对象，那么您将如下实现`methodSignatureForSelector:`：

【意思就是说只要涉及到转发的部分，都应该额外实现】

```objective-c
- (NSMethodSignature*)methodSignatureForSelector:(SEL)selector
{
    NSMethodSignature* signature = [super methodSignatureForSelector:selector];
    if (!signature) {
       signature = [surrogate methodSignatureForSelector:selector];
    }
    return signature;
}
```

您可能会考虑将转发算法放在私有代码的某个地方，使得所有这些方法，包括`forwardInvocation:`在内，都可以调用它。

注意：这是一个高级技术，只适用于没有其他解决方案的情况。它不是继承的替代品。如果您必须使用这种技术，请确保您充分了解执行转发的类和您要进行转发的类的行为。

本节中提到的方法在Foundation框架参考中的`NSObject`类规范中有描述。有关`invokeWithTarget:`的信息，请参阅Foundation框架参考中`NSInvocation`类的规范。

## Type Encodings 类型编码

为了帮助Runtime系统，编译器会将每个方法的返回类型和参数类型编码为一个字符串，并将该字符串与方法选择器关联起来。它使用的编码方案在其他情况下也很有用，因此可以使用`@encode()`编译器指令来公开。给定一个类型规范，`@encode()`返回编码该**类型**的字符串。该类型可以是「基本类型，如int、指针、带标签的结构体或联合体，或类名」 —— 实际上，任何可以用任何适合「作为C语言`sizeof()`运算符的参数」的类型。

有关具体如何编码的相关信息，可以查看这部分的[原文](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html)

【后面的内容大部分都无关运行逻辑，就不多做介绍了（~~其实是不大看得懂+懒~~）】



## 结语

杨老师文章中还有一部分数据结构和实用场景讲解，由于我现阶段能力有限，光是对照翻译和原文想办法搞清楚Runtime的机制就需要很多精力了。所以这篇文章还未完结，等待后续内容的加入。