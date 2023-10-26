---
title: Working with Protocols 使用协议

order: 4
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-25
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

# Working with Protocols 使用协议

在现实世界中，执行公务的人们经常需要在处理特定情况时遵循严格的程序。例如，执法官员在进行询问或收集证据时需要“按照规程`follow protocol`”操作。

在面向对象编程的世界中，能够定义对象在特定情境中做出被期望的行为是非常重要的。举个例子，表视图（table view）期望能够与数据源对象进行通信，以了解它需要显示什么内容。这意味着**数据源必须能够响应表视图可能发送的一组特定消息**。【很精妙的讲出了一个使用场景，这是其他外部文章所难以见到的】

数据源可以是任何类的实例，比如视图控制器（在OS X上是NSViewController的子类，iOS上是UIViewController）或者专门的数据源类，也许只是继承自NSObject。为了让表视图知道一个对象是否适合作为数据源，很重要一件事就是声明对象实现了必要的方法。

Objective-C 允许你定义协议（`protocols`），**用于声明在特定情境下所期望使用的方法**。本章将描述定义正式协议的语法，以及如何标记一个类接口来符合某个协议，同时，这意味着该类必须实现协议所需的方法。

## Protocols Define Messaging Contracts 协议定义消息契约

类接口用于声明与该类相关的方法和属性。相比之下，协议用于声明与任何特定类无关的方法和属性。

定义协议的基本语法如下：

```objc
@protocol ProtocolName
// 方法和属性的列表 list of methods and properties
@end
```

协议可以包括实例方法` instance methods`、类方法`class methods`以及属性`properties`的声明。

举个例子，考虑一个用于显示饼图的自定义视图类，如下图所示。

![A Custom Pie Chart View](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/piechartsim_2x.png)

为了使视图尽可能可重用，**所有有关信息的决策应该交给另一个对象**，即数据源。这意味着同一视图类的多个实例可以通过与不同数据源通信来显示不同的信息。

饼图视图所需的最少信息包括分段的数量、每个分段的相对大小以及每个分段的标题。因此，饼图的数据源协议可能如下所示：

```objc
@protocol XYZPieChartViewDataSource
- (NSUInteger)numberOfSegments;//分段的数量
- (CGFloat)sizeOfSegmentAtIndex:(NSUInteger)segmentIndex;//每个分段的相对大小
- (NSString *)titleForSegmentAtIndex:(NSUInteger)segmentIndex;//每个分段的标题
@end
  //注意：此协议使用无符号整数标量值的NSUInteger类型。这种类型将在下一章节中进行更详细的讨论。
```

饼图视图类的接口需要一个属性来跟踪数据源对象。这个对象可以是任何类的实例，因此基本属性类型将是`id`。**唯一已知的是该对象符合相关的协议**。【只需要用一个属性来跟踪即可】

声明视图的数据源属性的语法如下：

```objc
@interface XYZPieChartView : UIView
@property (weak) id <XYZPieChartViewDataSource> dataSource;
...
@end
```

Objective-C 使用**尖括号来表示符合协议的情况**。下面的示例声明了一个弱引用属性，该属性是一个通用对象指针，符合XYZPieChartViewDataSource协议：

注意：通常情况下，委托（delegate）和数据源（data source）属性会被标记为弱引用，出于前面避免强引用循环（[Avoid Strong Reference Cycles](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW22)）中所描述的对象图管理原因。

通过在属性上指定符合所需的协议，若尝试将属性设置为不符合协议的对象，即使基本属性类类型是通用的，编译器也会发出警告。无论对象是UIViewController或NSObject的实例都无关紧要。重要的是它符合协议，这意味着饼图视图知道它可以请求所需的信息。

### Protocols Can Have Optional Methods 协议可以包含可选方法

默认情况下，协议中声明的所有方法都是必需的方法。这意味着符合协议的任何类都必须实现这些方法。

但是，也可以在协议中指定可选方法。这些是类只有在需要时才要去实现的方法。

举个例子，你可能会认为饼图上的标题是可有可无的。如果数据源对象没有实现`titleForSegmentAtIndex:`方法，视图中就不再会显示标题。

你可以使用`@optional`指令**将协议方法标记为可选的**，如下所示：

```objc
@protocol XYZPieChartViewDataSource
- (NSUInteger)numberOfSegments;
- (CGFloat)sizeOfSegmentAtIndex:(NSUInteger)segmentIndex;
@optional
- (NSString *)titleForSegmentAtIndex:(NSUInteger)segmentIndex;
@end
```

在这种情况下，只有`titleForSegmentAtIndex:`方法被标记为可选的。之前的方法没有被指明可选，所以仍然被认为是必需的。

`@optional`指令适用于跟随它的任何方法，要么直到协议定义的末尾，要么直到遇到另一个指令，比如`@required`。你可以像下面这样向协议中添加更多方法：

```objc
@protocol XYZPieChartViewDataSource
- (NSUInteger)numberOfSegments;
- (CGFloat)sizeOfSegmentAtIndex:(NSUInteger)segmentIndex;
@optional
- (NSString *)titleForSegmentAtIndex:(NSUInteger)segmentIndex;
- (BOOL)shouldExplodeSegmentAtIndex:(NSUInteger)segmentIndex;
@required
- (UIColor *)colorForSegmentAtIndex:(NSUInteger)segmentIndex;
@end
//这个示例定义了一个协议，其中包含三个必需方法和两个可选方法。
```

#### Check that Optional Methods Are Implemented at Runtime 检查可选方法在运行时是否已实现

如果协议中的一个方法被标记为可选的，**你必须在尝试调用它之前检查对象是否实现了该方法**。

举个例子，饼图视图可以像这样测试分段标题方法：

```objc
    NSString *thisSegmentTitle;
    if ([self.dataSource respondsToSelector:@selector(titleForSegmentAtIndex:)]) {
        thisSegmentTitle = [self.dataSource titleForSegmentAtIndex:index];
    }
```

`respondsToSelector:` 该方法使用一个选择器（selector）作为参数，选择器是在编译后用于标识方法的标识符。你可以通过使用`@selector()`指令并指定方法的名称来提供正确的标识符。

在这个示例中，如果数据源实现了该方法，就会使用标题；否则，标题将保持为nil。

记住：本地对象变量会自动初始化为nil。

如果你尝试在一个符合上述协议的 `id` 对象上调用 `respondsToSelector:` 方法，你将会收到一个编译器错误——没有已知的实例方法。一旦你使用协议对 `id` 进行限定，所有的静态类型检查` static type-checking `都会生效，如果尝试调用未在指定协议中定义的方法都会导致错误。避免编译器错误的一种方法是将自定义协议采用`NSObject`协议（set the custom protocol to adopt the `NSObject` protocol）。

【这段也就是说，如果你的某个类采用了某种协议，那么它只能提供协议中有的方法了，所以在下一文段，苹果建议我们首先符合NSObject的协议，以获得类的基本功能】

### Protocols Inherit from Other Protocols 协议继承自其他协议

与Objective-C类可以继承自超类一样，你也可以指定一个协议符合另一个协议。

举个例子，最佳实践是定义你的协议以符合`NSObject`协议（一些`NSObject`的行为从其类接口中拆分为一个单独的协议；`NSObject`类采用`NSObject`协议）。

通过指定你自己的协议符合`NSObject`协议，你表明采用自定义协议的任何对象也将为`NSObject`协议中的每个方法提供实现。因为你可能在使用`NSObject`的某个子类，所以你不需要担心为这些`NSObject`方法提供自己的实现。然而，协议的采用在上面描述的情况下非常有用。

**要指定一个协议符合另一个协议，你需要使用尖括号提供另一个协议的名称**，如下所示：

```objc
@protocol MyProtocol <NSObject>
...
@end
```

在这个例子中，任何采用`MyProtocol`的对象也实际上采用了`NSObject`协议中声明的所有方法。

## Conforming to Protocols 采用协议

指示一个类采用协议的语法再次使用尖括号，如下所示：

```objc
@interface MyClass : NSObject <MyProtocol>
...
@end
```

这意味着`MyClass`的任何实例**不仅会响应接口中明确定义的方法**，还提供了`MyProtocol`中所需方法的实现。在类接口中不需要重新声明协议方法——采用协议就足够了。

注意：**编译器不会自动合成采用的协议中声明的属性。**

如果需要一个类采用多个协议，可以将它们指定为逗号分隔的列表，如下所示：

```objc
@interface MyClass : NSObject <MyProtocol, AnotherProtocol, YetAnotherProtocol>
...
@end
```

**提示**：如果你发现自己在一个类中采用大量协议，这可能表明你需要通过将必要的行为分布到多个小型类中来重构一个过于复杂的类，每个类都有明确定义的责任。

对于新的OS X和iOS开发人员来说，一个相对常见的陷阱是使用单个应用程序代理类来包含大部分应用程序的功能（管理底层数据结构，为多个用户界面元素提供数据，以及响应手势和其他用户交互）。随着复杂性的增加，该类变得越来越难以维护。

一旦你指示采用协议，该类必须至少为每个必需的协议方法提供方法实现，以及你选择的任何可选方法。如果没有实现任何必需方法，编译器会发出警告。

注意：协议中的方法声明就像任何其他声明一样。实现中的方法名称和参数类型必须与协议中的声明匹配。

### Cocoa and Cocoa Touch Define a Large Number of Protocols Cocoa和Cocoa Touch定义了许多协议

协议被Cocoa和Cocoa Touch对象在各种不同的情况下大量使用。例如，表视图类（OS X上的NSTableView和iOS上的UITableView）都使用数据源对象来提供它们所需的信息。**两者都定义了自己的数据源协议**，它的使用方式类似于上面的XYZPieChartViewDataSource协议示例。两个表视图类还允许你设置一个`delegate object`，该`delegate object`必须符合相关的NSTableViewDelegate或UITableViewDelegate协议。`delegate`负责处理用户交互，或者自定义某些条目的显示。

一些协议用于指示类之间的非层次结构相似性`*non-hierarchical similarities* `。与特定类要求相关联不同，一些协议与更一般的Cocoa或Cocoa Touch通信机制相关，可能会被多个不相关的类采用。

例如，许多框架模型对象（如集合类如NSArray和NSDictionary）都支持NSCoding协议，这意味着它们可以编码和解码其属性以进行存档或分发为原始数据。NSCoding使得相对容易将整个对象图写入磁盘，前提是图中的每个对象都采用了该协议。

一些Objective-C语言级特性也依赖于协议。例如，要使用快速枚举，集合必须采用NSFastEnumeration协议，如在“快速枚举简化了集合的枚举 [Fast Enumeration Makes It Easy to Enumerate a Collection](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/FoundationTypesandCollections/FoundationTypesandCollections.html#//apple_ref/doc/uid/TP40011210-CH7-SW30)”中所述。此外，一些对象可以被复制，比如当使用具有复制属性的属性时，如在“复制属性维护其自己的副本 [Copy Properties Maintain Their Own Copies](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW35)”中所述。你尝试复制的任何对象必须采用NSCopying协议，否则会导致运行时异常。

## Protocols Are Used for Anonymity 协议可用于匿名性

协议还在类的类型未知或需要保持隐藏的情况下非常有用。

举个例子，一个框架的开发人员可能选择不发布框架内部的某个类的接口。因为类的名称未知，框架的用户无法直接创建该类的实例。相反，框架中的另一个对象通常会被指定为返回一个现成的实例，如下所示：

```objc
id utility = [frameworkObject anonymousUtility];
```

为了使这个`anonymousUtility`对象有用，框架的开发人员可以发布一个**揭示它的某些方法的协议**。即使原始类接口没有提供，**这意味着类保持匿名，该对象仍然可以在有限的方式中使用**：

```objc
id <XYZFrameworkUtility> utility = [frameworkObject anonymousUtility];
```

例如，如果你正在编写一个使用Core Data框架的iOS应用程序，你可能会遇到`NSFetchedResultsController`类。这个类旨在帮助数据源对象向iOS的UITableView提供存储的数据，从而方便提供信息，如行数。

如果你正在使用一个内容分成多个部分的表视图，还可以向`NSFetchedResultsController`请求相关的部分信息。而不是返回包含这个部分信息的特定类，`NSFetchedResultsController`类返回一个匿名对象，该对象符合`NSFetchedResultsSectionInfo`协议。这意味着仍然可以查询该对象以获取所需的信息，例如部分中的行数：

```objc
    NSInteger sectionNumber = ...
    id <NSFetchedResultsSectionInfo> sectionInfo =
            [self.fetchedResultsController.sections objectAtIndex:sectionNumber];
    NSInteger numberOfRowsInSection = [sectionInfo numberOfObjects];
```

尽管你不知道`sectionInfo`对象的类，但`NSFetchedResultsSectionInfo`协议规定它可以响应`numberOfObjects`消息。