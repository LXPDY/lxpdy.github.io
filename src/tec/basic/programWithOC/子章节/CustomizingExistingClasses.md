---
title: Customizing Existing Classes 自定义现有类

order: 4
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-24
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

# Customizing Existing Classes 自定义现有类

对象应具有明确定义的任务，例如为特定信息建立模型、显示视觉内容或控制信息流。正如您已经看到的，类接口定义了通过与对象互动以完成这些任务的方式。

有时，您可能会发现需要通过**添加仅在某些情况下有用的行为**来扩展现有类。举个例子，您可能会发现您的应用程序经常需要在视觉界面中显示一串字符。与其每次需要显示字符串时都创建某个字符串绘制对象，更有意义的做法是使NSString类本身具备在屏幕上绘制其自己字符的能力。

不过在这种情况下，将实用程序行为永久添加到原始的主要类的接口中并不总是有意义的。例如，在应用程序中大多数情况下，不太可能需要绘制能力，并且，对于NSString，你不能修改原始接口或实现，因为它是一个框架类。

此外，为现有类创建子类可能也并不现实，因为您可能希望将您的绘图行为不仅对原始的NSString类可用，还对该类的任何子类（如NSMutableString）也可用。此外，尽管NSString可用于OS X和iOS，但每个平台的绘制代码可能不同，因此您还需要在每个平台上使用不同的子类。

除了通过子类和直接拓展，Objective-C 允许您通过`categories`和类扩展`class extensions`向现有类添加自己的方法。

【讲了这么多其实就一件事，有的事情没法或者不知道在原有类的定义上永久拓展，也不适合继承出个子类来完成它，那么使用`categories`或者类扩展`class extensions`才是这种情况下的最优解】

## Categories Add Methods to Existing Classes Categories——向现有类添加方法

如果您需要向现有类添加方法，也许是为了添加功能以使在您自己的应用程序中操作更容易地执行某些操作，最简单的方法是使用`category`。

声明类别的语法使用 `@interface `关键字，就像标准的 Objective-C 类描述一样，**但不指示从子类继承**。相反，它在括号中指定了`category`的名称，如下所示：

```objc
@interface ClassName (CategoryName)
 
@end
```

category可以为任何类声明，即使您没有原始的实现源代码（比如标准的Cocoa或Cocoa Touch类）。在类别中声明的任何方法将**对原始类的所有实例以及原始类的任何子类可用**。在运行时，通过类别添加的方法与原始类实现的方法之间没有区别。

考虑前几章中的XYZPerson类，该类具有用于存储人的名字和姓氏的属性。如果您正在编写一个记录应用程序，您可能经常需要按姓氏显示人的列表，就像这样：

```
Appleseed, John
Doe, Jane
Smith, Bob
Warwick, Kate
```

与其每次需要显示时编写代码来生成合适的lastName和firstName字符串，您可以向XYZPerson类添加一个category，如下所示：

```objc
#import "XYZPerson.h"
 
@interface XYZPerson (XYZPersonNameDisplayAdditions)
- (NSString *)lastNameFirstNameString;
@end
```

在这个例子中，XYZPersonNameDisplayAdditions category声明了一个额外的方法来返回所需的字符串。

**category通常在单独的头文件中声明，并在单独的源代码文件中实现**。在XYZPerson的情况下，您可以在名为`XYZPerson+XYZPersonNameDisplayAdditions.h`的头文件中声明该类别。【非常简单粗暴的命名风格】

尽管类别添加的任何方法都对该类的所有实例和其子类可用，但您需要在任何希望使用额外方法的源代码文件中导入类别头文件，否则您将遇到编译器警告和错误。

类别的实现可能如下所示：

```objc
#import "XYZPerson+XYZPersonNameDisplayAdditions.h"
 
@implementation XYZPerson (XYZPersonNameDisplayAdditions)
- (NSString *)lastNameFirstNameString {
    return [NSString stringWithFormat:@"%@, %@", self.lastName, self.firstName];
}
@end
```

一旦您声明了一个category并实现了方法，您就可以从该类的任何实例中使用这些方法，就好像它们是原始类接口的一部分一样：

```objc
#import "XYZPerson+XYZPersonNameDisplayAdditions.h"
@implementation SomeObject
- (void)someMethod {
    XYZPerson *person = [[XYZPerson alloc] initWithFirstName:@"John"
                                                    lastName:@"Doe"];
    XYZShoutingPerson *shoutingPerson =
                        [[XYZShoutingPerson alloc] initWithFirstName:@"Monica"
                                                            lastName:@"Robinson"];
 
    NSLog(@"The two people are %@ and %@",
         [person lastNameFirstNameString], [shoutingPerson lastNameFirstNameString]);
}
@end
```

除了向现有类添加方法之外，您还可以使用category将复杂类的实现**拆分为多个源代码文件**。例如，如果几何计算、颜色和渐变等特别复杂的功能，您可能会将自定义用户界面元素的绘图代码放在一个单独的文件中，而将其余部分的实现放在另一个文件中。或者，您可以根据您是为OS X还是iOS编写应用程序来提供category方法的不同实现。

category可用于声明**实例方法或类方法**，但**通常不适用于声明额外的属性**。**在类别接口中包括属性声明是有效的语法，但不可能在类别中声明额外的实例变量**。**这意味着编译器不会合成任何实例变量，也不会合成任何属性访问方法。您可以在类别实现中编写自己的访问方法，但除非原始类已经存储了该属性，否则您将无法跟踪该属性的值。**

**要向现有类添加一个传统属性（由新的实例变量支持），唯一的方法是使用类扩展**，如“ [Class Extensions Extend the Internal Implementation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html#//apple_ref/doc/uid/TP40011210-CH6-SW3) 类扩展扩展内部实现”中所述。

```
注意：Cocoa和Cocoa Touch为一些主要的框架类包包含了各种categories。

本章介绍的字符串绘制功能实际上已经通过OS X的NSStringDrawing类别为NSString提供，
其中包括drawAtPoint:withAttributes:和drawInRect:withAttributes:等方法。
对于iOS，UIStringDrawing类别包括方法，如drawAtPoint:withFont:和drawInRect:withFont:。
```

### Avoid Category Method Name Clashes 避免Category方法名称冲突

由于Category中声明的方法被添加到现有类中，您需要非常小心方法名称的选择。

如果Category中声明的方法名称与原始类中的方法名称相同，或者与同一类的另一个类别（甚至是超类）中的方法名称相同，那么在运行时将无法确定使用哪个方法实现。如果您在自己的类中使用类别，这种情况不太可能发生问题，但在使用类别为标准Cocoa或Cocoa Touch类添加方法时可能就会引发问题。

例如，一个与远程Web服务一起使用的应用程序可能需要一种简单的方法来使用Base64编码对一串字符进行编码。在NSString上定义一个类别以添加一个返回字符串的Base64编码版本的实例方法是合理的，因此您可以添加一个名为base64EncodedString的便捷方法。

如果您链接到另一个同时定义了自己的NSString类别的框架，其中包括自己名为base64EncodedString的方法，**那么在运行时只有一个方法实现会“胜出”并被添加到NSString中**，**但无法确定是哪一个**。【神奇吧】

另一个问题可能会出现在您为Cocoa或Cocoa Touch类添加便捷方法，然后在以后的版本中将这些方法添加到原始类中。例如，NSSortDescriptor类描述了如何对对象集合进行排序，始终具有一个名为initWithKey:ascending:的初始化方法，但在早期的OS X和iOS版本中并未提供相应的类工厂方法。

根据约定，类工厂方法应该称为sortDescriptorWithKey:ascending:，因此您可能选择在NSSortDescriptor上添加一个Category，以提供此便捷方法。在OS X 10.6和iOS 4.0版本发布后，原始的NSSortDescriptor类添加了一个sortDescriptorWithKey:ascending:方法，这意味着在这些或以后的平台上运行应用程序时会出现命名冲突。

为了避免未定义行为，最佳实践是在框架类的类别中为方法名称**添加前缀**，就像您应该为您自己的类名称添加前缀一样。您可以选择使用与类前缀相同的三个字母，但小写以遵循方法名称的通常约定，然后是下划线，然后是方法名称的其余部分。以NSSortDescriptor为例，您的类别可能如下所示：

```objc
@interface NSSortDescriptor (XYZAdditions)
+ (id)xyz_sortDescriptorWithKey:(NSString *)key ascending:(BOOL)ascending;
@end
```

【讲了这么一大段，就是说Category方法的命名最好带前缀，不然你不知道哪天就和苹果官方或者其他开发者撞了】

## Class Extensions Extend the Internal Implementation 类扩展扩展内部实现

**类扩展与类别有一些相似之处，但它只能添加到在编译时具有源代码的类（类在与类扩展同时编译）**。类扩展中声明的方法是在原始类的 @implementation 块中实现的，因此您不能在框架类上声明类扩展，例如Cocoa或Cocoa Touch类，如NSString。

声明类扩展的语法与声明类别的语法类似，如下所示：

```objc
@interface ClassName ()
 
@end
```

因为在括号内没有给出名称，类扩展通常被称为匿名Category。

与常规类别不同，类扩展可以向类添加自己的属性和实例变量。如果您在类扩展中声明一个属性，如下所示：

```objc
@interface XYZPerson ()
@property NSObject *extraProperty;
@end
```

编译器将自动合成相关的访问方法，以及主类实现中的实例变量。

如果在类扩展中添加任何方法，这些方法必须在类的主要实现中实现。

还可以使用类扩展来添加自定义实例变量。这些实例变量在类扩展接口中的大括号内声明：

```objc
@interface XYZPerson () {
    id _someCustomInstanceVariable;
}
...
@end

```

### Use Class Extensions to Hide Private Information 使用类扩展来隐藏私有信息

类的主要接口用于定义其他类与之交互的方式，换句话说，它是类的公共接口。

**类扩展通常用于通过附加私有方法或属性来扩展公共接口**，**以供类的实现内部使用**。例如，通常在接口中将属性定义为只读，但在类扩展中将其定义为可读写，以便类的内部方法可以直接更改属性值。

以XYZPerson类为例，该类可能添加一个名为uniqueIdentifier的属性，用于跟踪类似于美国社会安全号码的信息。

在现实世界中，分配给个体的唯一标识通常需要大量文件工作，因此XYZPerson类接口可能将此属性声明为只读，并提供一些方法，以请求分配一个标识符，如下所示：

```objc
@interface XYZPerson : NSObject
...
@property (readonly) NSString *uniqueIdentifier;
- (void)assignUniqueIdentifier;
@end
```

这意味着不可能直接由另一个对象来设置uniqueIdentifier。如果一个人没有一个唯一标识符，那么必须通过调用assignUniqueIdentifier方法来请求分配一个标识符。

为了使XYZPerson类能够在内部更改属性，**重新声明该属性在类的实现文件的顶部定义的类扩展中是有道理的**：

```objc
@interface XYZPerson ()
@property (readwrite) NSString *uniqueIdentifier;//这里为了表达清晰，显式标注了读写权限为读写，覆盖了原来的只读权限
@end
 
@implementation XYZPerson
...
@end
```

这意味着编译器现在还将合成一个setter方法，因此在XYZPerson**内部**实现的任何方法都可以直接使用setter方法或点语法来设置属性。

**通过在XYZPerson实现的源代码文件中声明类扩展**，信息保持私有于XYZPerson类。如果尝试设置属性的另一种对象类型，编译器将报错。这种方式有助于确保类的私有信息不被外部对象访问或修改。

注意：通过像上面展示的那样添加的类扩展，重新声明uniqueIdentifier属性为可读写属性，将在每个XYZPerson对象上存在一个setUniqueIdentifier:方法，无论其他源代码文件是否了解类扩展。

如果另一个源代码文件中的代码尝试调用私有方法或设置只读属性，编译器将报错，但是，仍然可能通过使用NSObject提供的performSelector:...方法中的一个等其他方式来避开编译器错误并利用动态运行时功能来调用这些方法。您应该遵循避免这种必要性的类层次结构或设计，而是主类接口应始终定义正确的“公共”交互方式。

如果您打算将“私有”方法或属性提供给选定的其他类，比如框架内的相关类，您可以在一个单独的头文件中声明类扩展，并在需要的源文件中导入它。例如，一个类可能有两个头文件，如XYZPerson.h和XYZPersonPrivate.h。当您发布框架时，只发布公共的XYZPerson.h头文件。

## Consider Other Alternatives for Class Customization 考虑其他用于类自定义的替代方法

Category和类扩展使直接向现有类添加行为变得很容易，但有时这其实不是最佳选择。【还有高手？】

面向对象编程的一个主要目标之一是编写可重用的代码，这意味着类应该在尽可能多的情况下可重用。例如，如果您正在创建一个用于描述在屏幕上显示信息的对象的视图类，那么考虑一下该类是否可以在多种情况下使用是个好主意。

**与其将关于布局或内容的决策硬编码，一个替代方法是利用继承，将这些决策留给专门设计为子类覆盖的方法**。尽管这使得相对容易重用类，但每次想要使用原始类时仍然需要创建一个新的子类。

另一种替代方法是让类使用*delegate* object。**可能会限制可重用性的任何决策都可以委托给另一个对象**，在运行时由该对象来做出这些决策。一个常见的例子是标准的表视图类（OS X中的NSTableView和iOS中的UITableView）。为了使通用表视图（一种使用一个或多个列和行来显示信息的对象）有用，它将关于其内容的决策留给另一个对象在运行时做出。Delegation将在下一章《使用协议进行工作 [Working with Protocols](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithProtocols/WorkingwithProtocols.html#//apple_ref/doc/uid/TP40011210-CH11-SW1)》中详细介绍。

### Interact Directly with the Objective-C Runtime 与Objective-C Runtime直接交互

Objective-C通过 Runtime系统提供其动态行为。

许多决策，例如在发送消息时调用哪些方法，不是在编译时做出的，而是在应用程序运行时确定的。Objective-C不仅仅是一种编译成机器代码的语言。相反，它需要一个Runtime系统来执行该代码。

可以直接与此运行时系统进行交互，例如通过向对象添加关联引用。与类扩展不同，关联引用不会影响原始类的声明和实现，这意味着您可以将其用于您无法访问原始源代码的框架类。

关联引用将一个对象与另一个对象链接在一起，类似于属性或实例变量。有关更多信息，请参阅[Associative References](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Chapters/ocAssociativeReferences.html#//apple_ref/doc/uid/TP30001163-CH24)。要了解有关Objective-C运行时的更多信息，请参阅[Runtime机制](/tec/advanced/Runtime.md)。
