---
title: Defining Classes

order: 1
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-22
category:
  - 文章翻译
tag:
  - Programming with Objective-C
  - 进阶学习
footer: 努力努力再努力
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: true
---

# Defining Classes 定义类

当你为OS X或iOS编写软件时，你大部分时间都在与对象一起工作。Objective-C中的对象与其他面向对象的编程语言中的对象类似：它们将数据与相关行为封装在一起。【对象`object`】

一个应用程序构建为一个大型的相互连接的对象生态系统，这些对象相互通信以解决特定问题，比如显示视觉界面、响应用户输入或存储信息。对于OS X或iOS开发，你不需要从头开始创建对象来解决每一个可想象的问题；相反，你可以使用由Cocoa（用于OS X）和Cocoa Touch（用于iOS）提供的大量现有**对象库**。

其中一些对象可以立即使用，例如**基本数据类型**——字符串和数字等，或**用户界面元素**`user interface elements`如按钮和表视图。有些对象则被设计成可以通过你自己的代码进行自定义，以使其按照你的要求工作。应用程序开发过程涉及到决定如何最好地设计和组合底层框架提供的对象以及你自己的对象，从而为你的应用程序提供独特的特性和功能。

从面向对象的编程角度来看，对象是类的实例。本章将演示如何通过声明一个接口`interface`来定义Objective-C中的类，该接口描述了你打算如何使用类及其实例。这个接口包括类可以接收的消息列表，因此你还需要提供类的实现`implementation`，其中包含要在响应每个消息时执行的代码【消息，也就是所谓“类方法”】。

## Classes Are Blueprints for Objects 类——对象的蓝图

一个类描述了任何特定类型的对象`object`的行为`behavior`和属性`properties`。

- 对于字符串对象（在Objective-C中，这是NSString类的一个实例），该类提供了各种方法来检查和转换它表示的内部字符。类似地，用于描述数字对象（NSNumber）的类提供了围绕内部数值的功能，比如将该值转换为不同的数值类型。

就像从同一蓝图构建的多栋建筑在结构上是相同的，每个类的每个实例与该类的所有其他实例共享相同的属性和行为。无论它包含什么内部字符，每个NSString实例都以相同的方式进行工作。

任何特定对象都被设计为以特定的方式使用。你可能知道一个字符串对象代表一些字符的字符串，但你不需要知道用于存储这些字符的确切内部机制。你不知道对象本身用于直接与其字符一起工作的内部实现逻辑，但你需要知道你被期望与对象互动的方式，举个例子，也许是要求它返回特定的字符，或向它请求一个新的对象，其中所有原始字符都被转换为大写。

在Objective-C中，类接口`*class interface*`明确指定了给定类型的对象应该如何被其他对象使用。换句话说，它定义了类的实例与外界之间的公共接口`public interface`。

### Mutability Determines Whether a Represented Value Can Be Changed 可变性——决定了表示的值是否可以更改

有些类定义的对象是**不可变**的。这意味着对象在创建时必须初始化其内部内容，并且不能再被其他对象更改。在Objective-C中，所有基本的NSString和NSNumber对象都是**不可变的**。如果你需要表示不同的数字，你必须使用一个新的NSNumber实例。

但是**有些不可变类还提供了可变版本**。如果你需要在运行时明确更改字符串的内容，例如通过在网络连接中向收到的信息追加字符，你可以使用NSMutableString类的实例。这个类的实例的功能就像NSString对象一样，但它们还提供了更改对象表示的字符串的功能。

尽管NSString和NSMutableString是不同的类，但它们有许多相似之处。与其从头开始编写两个完全不同但具有一些相似行为的类，不如使用继承`inheritance`。

### Classes Inherit from Other Classes 类——从其他类继承

【此处略去一段苹果用自然界物种分层分类的方法来介绍继承概念的例子和图片】

在面向对象编程的世界中，对象也被分类到**层次结构**中。与区分不同层次级别的不同术语，如属或种，不同，对象只是被组织成类。就像人类作为人科的成员继承某些特征一样，一个类可以被设置为继承父类的功能。

当一个类从另一个类继承时，子类**继承了父类定义的所有行为和属性**。它还可以定义自己的额外行为和属性，或者**重写**`override`父类的行为。

- 以Objective-C字符串类举个例子，NSMutableString的类描述指定该类从NSString继承，如下图所示。NSString提供的所有功能在NSMutableString中都可用，例如查询特定字符或请求新的大写字符串，但NSMutableString添加了允许你追加、插入、替换或删除子串以及单个字符的方法。

- ![nsstringmutablestring](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/nsstringmutablestring.png) 

### The Root Class Provides Base Functionality 根类——提供基本功能

就像所有生物都共享一些基本的“生命”特征一样，Objective-C中的所有对象都共享某些基本特性。

当一个Objective-C对象需要与另一个类的实例一起工作时，它需要另一个类提供某些基本特性和行为。因此，Objective-C定义了一个根类，绝大多数其他类都继承自它，它就是NSObject。当一个对象遇到另一个对象时，它至少能够使用NSObject类中定义的基本行为来进行交互。

当你定义自己的类时，你必需先从NSObject继承。实际上，你应该找到一个**最接近你需要的功能**的Cocoa或Cocoa Touch对象，并从中继承。

- 举个例子，如果你想为iOS应用程序定义一个自定义按钮，而框架提供的UIButton类没有足够的可自定义属性能够满足你的需求，那么创建一个从UIButton继承的新类比直接从NSObject继承更有意义。如果你直接继承自NSObject，则需要复制UIButton类定义的所有复杂的视觉交互和通信，而仅仅只是为了使你的按钮按照用户的期望进行工作。此外，通过继承UIButton，你的子类将在未来**自动获得**应用于UIButton内部行为的任何增强或错误修复。

- UIButton类本身被定义为继承自UIControl，它描述了iOS上所有用户界面控件的**基本行为**。UIControl类又继承自UIView，使其具有常见于显示在屏幕上的对象的功能。UIView继承自UIResponder，允许它响应用户输入，比如点击、手势或晃动。最后，在继承链的根部，UIResponder继承自NSObject，如图1-3所示。

- ![buttoninheritance](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/buttoninheritance.png)

- 这个继承链意味着任何UIButton的自定义子类将不仅继承UIButton本身声明的功能，还会继承依次从每个父类继承的功能。你最终会得到一个具有像按钮一样行为的对象类，可以显示在屏幕上，响应用户输入，并与任何其他基本的Cocoa Touch对象进行通信。

对于你需要使用到的任何类，记住继承链时很重要的，这样你就能方便地确定它能够做什么。例如，Cocoa和Cocoa Touch提供的类参考文档**允许从任何类导航到每个超类**。如果你在一个类的接口或参考中找不到你要找的内容，**很可能会在链中的更高级别超类中找到**。

## The Interface for a Class Defines Expected Interactions 类的接口——定义了预期的交互方式

面向对象编程有许多好处，其中之一就是前面提到的概念——为了使用一个类，你**只需要**知道如何与它的**实例**交互。更具体地说，一个对象应该被设计地隐藏其内部实现的细节。

例如，如果你在iOS应用中使用标准的UIButton，你不需要担心像素是如何被操作使得按钮能出现在屏幕上。你只需要知道你可以更改某些属性，如按钮的标题和颜色，并相信当你将它添加到视觉界面`visual interface`时，它将正确显示并按照你的期望行为。

当你定义自己的类时，你需要首先确定这些公共属性`public attributes`和行为`behaviors`。决定哪些属性可以公开访问，是否应该允许更改这些属性以及其他对象如何与你的类的实例进行交互。

这些信息包含在类的接口`interface`中，它定义了你设计的「其他对象与你类的实例进行交互的方式」。公共接口`public interface`通常是从类的内部`*internal*`行为中分开描述的，内部行为构成了类的实现`implementation`。在Objective-C中，接口和实现`interface and implementation`通常放在**单独的文件中**，**以便你只需要公开接口**。

### Basic Syntax 基本语法

用于声明类接口的Objective-C语法如下：

```objc
@interface SimpleClass : NSObject
 
@end
```

这个示例声明了一个名为SimpleClass的类，它继承自NSObject。

**公共**属性和行为都在@interface声明内部定义。在这个示例中，除了超类之外没有指定任何内容，因此现在SimpleClass的实例上可用的唯一功能是从NSObject继承的功能。

### Properties Control Access to an Object’s Values 属性——控制对对象值的访问

【非常重要的`Properties`概念，它不同于上面声明接口时声明的`attributes`，虽然丢进翻译里都是属性的，但是`Properties`是对外的，而`attributes`应该更侧重于内部使用】

对象通常具有供公开访问的`properties`。

- 例如，如果你定义一个用于表示记录应用程序中的人的类，你可能会决定需要用于表示人的名字和姓的属性。

这些属性的声明应该在接口内部添加，如下所示：

```objc
@interface Person : NSObject
 
@property NSString *firstName;
@property NSString *lastName;
 
@end

```

在这个示例中，Person类声明了两个公共属性`public properties`，它们都是NSString类的实例。

这些属性都是Objective-C对象，所以它们使用`*`表示为C指针。它们与C中的任何其他变量声明语句一样，需要在末尾加上分号。

你可以决定添加一个属性来表示一个人的出生年份，这样你就可以按年龄对人进行排序。你可以使用一个数字对象来表示一个属性：

```objc
@property NSNumber *yearOfBirth;
```

但是对于用来存储一个简单的数值来说这可能是一种过度使用。使用C提供的标量值可以作为替代方案，比如整数：

```objc
@property int yearOfBirth;
```

#### Property Attributes Indicate Data Accessibility and Storage Considerations Property属性——指示数据的可访问性和存储注意事项

【套娃的】

到目前为止所示的示例都声明的都是完全公开访问的属性。这意味着其他对象既可以读写属性的值。

在某些情况下，你可能会声明一个属性并且不打算更改它。在现实世界中，一个人必须填写大量的文件才能更改他们的名字。如果你正在编写一个官方记录应用程序，你可能会选择将一个人的名字的公共属性声明为**只读**`readonly`，要求任何更改需要通过负责验证是否允许更改的中间对象进行。

Objective-C属性声明可以包括`Property Attributes`，用于指示属性是否打算为只读。在官方记录应用程序中，Person类的接口可能如下所示：

```objc
@interface Person : NSObject
@property (readonly) NSString *firstName;
@property (readonly) NSString *lastName;
@end
  //Property Attributes在@property关键字之后的括号内指定，并用于指示属性是否为只读或其他特性。
```

### Method Declarations Indicate the Messages an Object Can Receive 方法声明——指示对象可以接收的消息

到目前为止，本文所涉及的类只是用于描述典型模型对象的类，或者是主要用于封装数据的对象。在Person类的情况下，除了能够访问声明的两个属性之外，可能不需要任何其他功能。然而，大多数类除了声明的属性之外，还声明了额外的行为。

鉴于Objective-C软件是从大量对象网络中构建的，重要的是要注意这些对象可以通过发送消息相互交互。在Objective-C中，**一个对象通过调用对象上的方法来向另一个对象发送消息**。

Objective-C方法在概念上类似于C和其他编程语言中的标准函数，尽管语法相当不同。C函数声明如下：

```c
void SomeFunction();
```

等效的Objective-C方法声明如下：

```objc
- (void)someMethod;
```

在这种情况下，方法没有参数`parameters`。C中的void关键字在声明的开始处用括号括起来，以指示方法在完成后不返回任何值。

方法名前面的减号（-）表示它是一个**实例方法**`instance method`，**可以在类的任何实例上调用**。这将它与**类方法**`class methods`区分开来，类方法可以在**类本身上**调用，如章节「[Objective-C Classes Are also Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/DefiningClasses/DefiningClasses.html#//apple_ref/doc/uid/TP40011210-CH3-SW18) Objective-C类也是对象」中所述。【这里讲到了实例方法与类方法的区别，这对于初学者来说是很容易混淆的】

与C函数原型类似，Objective-C类接口内的方法声明就像C语句中的任何其他声明一样，需要分号来终止。

#### Methods Can Take Parameters 方法可以带参数

如果需要声明一个接受一个或多个参数的方法，语法与典型的C函数非常不同。

对于C函数，参数在括号内指定，如下所示：

```c
void SomeFunction(SomeType value);
```

Objective-C方法声明包括参数作为方法名的一部分，使用冒号，如下所示：

```objc
- (void)someMethodWithValue:(SomeType)value;
```

与返回类型一样，参数类型在括号中指定，就像标准的C类型转换`type-cast`。

如果需要提供多个参数，OC的语法则与C完全不同。C函数的多个参数在括号内指定，并用逗号分隔；在Objective-C中，具有两个参数的方法的声明如下所示：

```objc
- (void)someMethodWithFirstValue:(SomeType)value1 secondValue:(AnotherType)value2;
```

在这个示例中，value1和value2是在调用方法时用于访问传递的值的名称，就像它们是变量一样。

某些编程语言允许使用所谓的命名参数`*named arguments*`的函数定义；需要重点关注的是，这在Objective-C中并不适用。**方法调用中的参数顺序必须与方法声明匹配**，**事实上，方法声明的secondValue:部分是方法名称的一部分**：

```objc
someMethodWithFirstValue:secondValue:
```

【很神奇吧，OC】这是Objective-C如此可读的语言之一的特点，因为方法调用传递的值是内联指定的，就像章节「[You Can Pass Objects for Method Parameters](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4-SW13) 对象作为方法参数」所说一样。

##### 注意

上面示例中使用的value1和value2**值名称不是方法声明的一部分**，这意味着在声明中使用的名称与实现中使用的名称不完全相同。**唯一的要求是签名`signature`匹配**，这意味着**方法的名称以及参数和返回类型必须完全相同**。

- 举个例子，这个方法与上面示例的方法具有**相同的签名**：

  - ```objc
    - (void)someMethodWithFirstValue:(SomeType)info1 secondValue:(AnotherType)info2;
    ```

    

- 这些方法与上面的方法具有不同的签名：

  - ```objc
    - (void)someMethodWithFirstValue:(SomeType)info1 anotherValue:(AnotherType)info2;
    - (void)someMethodWithFirstValue:(SomeType)info1 secondValue:(YetAnotherType)info2;
    ```

### Class Names Must Be Unique 类名——必须是唯一的

需要注意的是，每个类的名称必须在应用程序中是**唯一的**，即使跨库或框架也是如此。如果你尝试在项目中创建一个与现有类相同的名称的新类，你将收到一个编译器错误。

因此，建议给你定义的任何类的名称**添加前缀**，使用**三个或更多字母**。这些字母可以与你当前正在编写的应用程序相关，或者可以与可重用代码的框架名称相关，**或者可以只是你的缩写**。

在本文档的其余部分提供的所有示例都使用类名前缀，如下所示：

```objc
@interface XYZPerson : NSObject
@property (readonly) NSString *firstName;
@property (readonly) NSString *lastName;
@end
```

```
历史背景：
如果你想知道为什么你会遇到许多类都有NS前缀，这来源于 Cocoa 和 Cocoa Touch 的历史。
Cocoa最初是用于构建NeXTStep操作系统应用程序的集成框架。当苹果于1996年收购NeXT时，
将NeXTStep的许多部分整合到了OS X中，包括现有的类名称。Cocoa Touch被引入作为iOS
上的Cocoa，虽然某些类在Cocoa和Cocoa Touch中都可用，但每个平台上也有许多独有的类。

像NS和UI（用于iOS上的用户界面元素）这样的两个字母前缀是由苹果保留以供使用。
```

而**方法和属性名称**只需要在定**义它们的类中是唯一的**。尽管应用程序中的**每个C函数必须有唯一的名称**，但允许（并且通常是可取的）多个Objective-C类定义具有相同名称的方法。但是，**不能在同一类声明内多次定义一个方法**，但**如果要覆盖从父类继承的方法，则必须使用原始声明中使用的确切名称**。

与方法一样，对象的属性`properties`和实例变量`instance variables`（在章节「大多数情况下属性由实例变量支持」[Most Properties Are Backed by Instance Variables](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW6)中描述的）只需要在定义它们的类中是唯一的。但是，如果使用全局变量，则这些变量必须在应用程序或项目中具有唯一的名称。

有关更多的命名约定和建议，请参考命名规范 [Conventions](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Conventions/Conventions.html#//apple_ref/doc/uid/TP40011210-CH10-SW1)。

## The Implementation of a Class Provides Its Internal Behavior 类的实现 —— 提供了它的内部行为

一旦你定义了一个类的接口，包括为公共访问而设计的属性和方法，你需要编写代码来实现类的行为。

如前文所述，类的接口通常放在一个**专用文件**中，通常称为头文件，通常具有扩展名`.h`,而您在一个扩展名为`.m`的源代码文件中编写Objective-C类的实现。

每当接口在头文件中定义时，你需要告诉编译器在尝试编译源代码文件中的实现之前阅读它。Objective-C提供了一个预处理指令＃import，用于此目的。它类似于C的＃include指令，**但确保在编译期间只包含文件一次**。【这比起C和C++算是优点】

请注意，预处理指令不同于传统的C语句，**不需要使用分号终止**。

### Basic Syntax 基本语法

提供类的实现的基本语法如下：

```objc
#import "XYZPerson.h"
 
@implementation XYZPerson
 
@end
```

如果在类接口中声明了任何方法，那么你需要在该文件中实现它们。

### Implementing Methods 实现方法 

对于一个简单的类接口，比如这样：

```objc
@interface XYZPerson : NSObject
- (void)sayHello;
@end
```

实现可能如下所示：

```objc
#import "XYZPerson.h"
 
@implementation XYZPerson
- (void)sayHello {
    NSLog(@"Hello, World!");
}
@end
```

此示例使用NSLog()函数将消息记录到控制台。它类似于标准的C库printf()函数，需要不定数量的参数，**其中第一个参数必须是Objective-C字符串**。

方法的实现类似于C函数定义，因为它们使用大括号包含相关代码。此外，方法的名称必须与其原型相同，并且参数和返回类型必须完全匹配。

Objective-C从C继承了大小写敏感性，因此此方法：

```objc
- (void)sayhello {
}
```

将被编译器视为与前面示例中的sayHello方法完全不同。

总的来说，**方法名称应以小写字母开头**。Objective-C的约定是，方法名称应该比你在典型C函数中看到的方法名称更具描述性。如果方法名称涉及多个单词，**请使用驼峰命名法（每个新单词首字母大写）**以便于阅读。

还要注意，Objective-C中的空格使用是灵活的。习惯上，使用制表符或空格缩进代码块中的每一行，通常会看到左大括号在单独的一行上，就像这样：

```objc
- (void)sayHello
{
    NSLog(@"Hello, World!");
}
```



Xcode，苹果用于创建OS X和iOS软件的集成开发环境（IDE），将根据一组可自定义的用户首选项自动缩进您的代码。有关更多信息，请参阅*[Xcode Workspace Guide](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/XcodeWorkspace/000-Introduction/Introduction.html#//apple_ref/doc/uid/TP40006920)*中的[Changing the Indent and Tab Width](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/XcodeWorkspace/100-The_Text_Editor/text_editor.html#//apple_ref/doc/uid/TP40002679-SW41) 【这篇文章也退休了】

在章节「使用对象工作」[Working with Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4-SW1)中，您将看到更多关于方法实现的示例

## Objective-C Classes Are also Objects Objective-C类也是对象

在Objective-C中，类本身也是`Class`这个不透明类型的对象。`Classes`不能使用先前在实例中显示的声明语法定义属性，但它们**可以接收消息**。【也就是类方法】

类方法的典型用途是**作为工厂方法**，这是创建对象的**分配和初始化**过程的替代方法，如「对象是动态创建的」[Objects Are Created Dynamically](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4-SW7)中所述。例如，NSString类具有多种工厂方法，可用于创建空字符串对象或使用特定字符初始化的字符串对象，包括：

```objc
+ (id)string;
+ (id)stringWithString:(NSString *)aString;
+ (id)stringWithFormat:(NSString *)format, …;
+ (id)stringWithContentsOfFile:(NSString *)path encoding:(NSStringEncoding)enc error:(NSError **)error;
+ (id)stringWithCString:(const char *)cString encoding:(NSStringEncoding)enc;
```

【id也就是类实例的唯一标识】

正如这些示例所示，**使用+号标识类方法**，**它们与-号标识的实例方法不同**。

类方法的原型**可以包含在类接口中**，就像实例方法的原型一样。**类方法的实现方式与实例方法相同，都在类的@implementation块中实现**。



## 练习

此部分略

## 小结

苹果的文档在事无巨细的同时，兼顾了一些后续开发用到的实例和知识点，虽然文章对于单纯写出一个OC类来说本身有些冗长，我们可能只需要学习语法部分即可，但是这篇文章中对于相应概念深入浅出的描述，能够大大提高对OC这门语言的理解，并且理解苹果这么做的原因。在清晰基本概念时避免后续开发的时候因为概念模糊而产生混淆。