---
title: Key-Value Coding(KVC)

order: 2
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-29
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

# Key-Value Coding Programming Guide

## About Key-Value Coding

`Key-Value Coding（以下简称KVC）`是一种由对象采用非正式协议`NSKeyValueCoding`从而启用的机制，它提供了**对对象的属性的间接访问**。当一个对象是KVC兼容的时，就可以**借助字符串参数**从而用一个简洁统一的**消息接口**来访问它的属性。这种间接访问机制扩展了由实例变量及其相关的访问方法提供的直接访问之外的访问方法。

通常，您使用访问方法`accessor methods`来访问对象的属性。一个获取器`get accessor`（或getter）返回属性的值。一个设置器`set accessor`（或setter）设置属性的值。在Objective-C中，您还可以直接访问属性的基础实例变量。虽然以这些方式访问对象的属性非常直观，但仍需要去调用属性特定名字的方法或获取变量。随着属性列表的增加或更改，访问这些属性的代码也必须随之变化。相比之下，一个兼容KVC的对象提供了一个简单的消息接口，该接口在其所有属性上都保持一致。

KVC是许多其他Cocoa技术底层的基本概念，比如`key-value observing`、`Cocoa bindings`、`Core Data`和`AppleScript-ability`。KVC还可以在某些情况下帮助简化代码。

### Using Key-Value Coding Compliant Objects 使用支持KVC的对象

通常情况下，当对象继承自NSObject（直接或间接继承），它会采用KVC，因为NSObject采用了`NSKeyValueCoding`协议并为基本方法提供了默认实现。**这样的对象可以通过一个紧凑的消息接口使其他对象执行以下操作**：

- **Access object properties.**访问对象属性
  - 该协议规定了方法，如通用的getter方法`valueForKey:`和通用的setter方法`setValue:forKey:`，用于通过名称或key的字符串来访问对象属性。这些和相关方法的默认实现使用key来定位并与底层数据交互，如在「[Accessing Object Properties](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/BasicPrinciples.html#//apple_ref/doc/uid/20002170-BAJEAIEE) 访问对象属性」中所描述的。
- **Manipulate collection properties.** 操作集合属性
  - 访问方法的默认实现与对象的集合属性（如NSArray对象）一样，就像任何其他属性一样。此外，如果一个对象为属性定义了集合访问方法`collection accessor methods `，**它可以启用对集合内容的键-值访问**。**这通常比直接访问更有效**，并允许您通过标准化接口与自定义集合对象一起工作，如在「[Accessing Collection Properties](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/AccessingCollectionProperties.html#//apple_ref/doc/uid/10000107i-CH4-SW1) 访问集合属性」中所描述的。
- **Invoke collection operators on collection objects.**在集合对象上调用集合运算符
  - 在访问支持KVC的对象的集合属性时，您可以在key字符串中插入**集合运算符**` *collection operator* `，如在「[Using Collection Operators](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/CollectionOperators.html#//apple_ref/doc/uid/20002176-BAJEAIEE) 使用集合运算符」中所描述的。集合运算符指示默认的`NSKeyValueCoding getter方法的实现`对集合采取行动，**然后返回集合的新版本、过滤版本，或者代表集合某些特性的单个值**。
- **Access non-object properties.** 访问非对象属性。
  - 协议的默认实现会检测非对象属性，包括标量`scalars`和结构体`structures`，自动将它们包装/解包为对象，以便在协议接口上使用，如在「[Representing Non-Object Values](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/DataTypes.html#//apple_ref/doc/uid/20002171-BAJEAIEE) 表示非对象值」中所描述的。此外，该协议声明了一个方法，允许支持KVC的对象在通过KVC接口设置非对象属性的值为nil时，提供适当的操作。
- **Access properties by key path.** 通过键路径访问属性。
  - 当您有一组支持KVC的对象的层次结构时，可以使用基于key路径的方法调用来深入访问，使用一次调用就可以获取或设置层次结构深处的值。

### Adopting Key-Value Coding for an Object 为对象兼容KVC

要使您自己的对象支持KVC，您需要确保它们使用了`非正式协议NSKeyValueCoding`并实现相应的方法，如`valueForKey:`作为通用的获取器，以及`setValue:forKey:`作为通用的设置器。幸运的是，如上所述，NSObject采用了这个协议并为这些以及其他基本方法提供了默认实现。因此，如果您从NSObject（或其许多子类中的任何一个）派生您的对象，很多工作已经为您完成了。

**为了使默认方法能够正常工作，您需要确保您的对象的访问器方法和实例变量遵循某些明确定义的模式**。这允许默认实现响应KVC的消息来找到您对象的属性。然后，您可以通过提供用于验证和处理某些特殊情况的方法，可选择扩展和自定义KVC的功能。 

### Key-Value Coding with Swift

从NSObject或其子类继承的Swift对象默认情况下对其属性支持键-值编码。与Objective-C不同，Swift中标准的属性声明自动保证了这一点，无需遵循特定的访问器和实例变量模式。另一方面，协议的许多特性要么不相关，要么更好地使用本机Swift构造或在Objective-C中不存在的技术来处理。例如，因为所有Swift属性都是对象，您永远不需要使用默认实现的非对象属性的特殊处理。

因此，尽管键-值编码协议方法可以直接翻译为Swift，但本指南主要关注Objective-C，在那里您需要采取更多措施来确保兼容性，而且键-值编码通常最有用。在Swift中需要显著不同方法的情况在本指南中有所说明。

有关在使用Swift与Cocoa技术的更多信息，请阅读《使用Swift与Cocoa和Objective-C》（Swift 3）。有关Swift的完整描述，请阅读《Swift编程语言》（Swift 3）。【这里苹果居然不带超链，可恶】

### Other Cocoa Technologies Rely on Key-Value Coding

支持KVC的对象可以参与广泛的依赖于这种访问方式的Cocoa技术，包括：

- `Key-value observing，KVO`这个机制允许对象**注册异步通知**，这些通知是由另一个对象的属性变化驱动的，如在《*[Key-Value Observing Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueObserving/KeyValueObserving.html#//apple_ref/doc/uid/10000177i)* KVO编程指南》中所描述。
- Cocoa绑定（Cocoa bindings）。这一系列技术完全实现了模型-视图-控制器（Model-View-Controller，MVC）范式，其中模型封装了应用程序数据`application data`，视图显示`views display`和编辑数据`edit that data`，控制器`controllers`在两者之间进行调解。要了解更多关于Cocoa绑定的信息，请阅读《*[Cocoa Bindings Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CocoaBindings/CocoaBindings.html#//apple_ref/doc/uid/10000167i)* Cocoa绑定编程主题》。
- 核心数据（`Core Data`）。这个框架提供了通用的、自动化的解决方案，用于讲对象生命周期和对象图管理联系起来的常见解决方案，包括持久性`persistence`。您可以在《*[Core Data Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreData/index.html#//apple_ref/doc/uid/TP40001075)* 核心数据编程指南》中了解有关核心数据的更多信息。

- AppleScript。这种脚本语言使您能够直接控制可脚本化的应用程序以及macOS的许多部分。Cocoa的脚本支持利用KVC来获取和设置可脚本化对象中的信息。NSScriptKeyValueCoding非正式协议中的方法提供了与KVC一起使用的附加功能，包括按多值键的索引获取和设置键值，以及将键-值强制转换（或转换）为适当的数据类型。《*[AppleScript Overview](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptX/AppleScriptX.html#//apple_ref/doc/uid/10000156i)* AppleScript概述》提供了AppleScript及其相关技术的高级概述。

## Accessing Object Properties 访问对象属性

通常情况下，一个对象在其接口声明中指定属性`*properties*`，这些属性属于以下几种类别：

- **Attributes.**
  - `这些是简单的值，比如标量、字符串或布尔值。值对象`Value objects`，如NSNumber和其他不可变类型，比如NSColor，也被视为attributes。
- **To-one relationships.**一对一关系.
  - 这些是可变对象，拥有自己的属性`properties`。一个对象的属性可以更改而不会导致对象本身发生变化。例如，一个银行账户对象可能有一个owner属性，该属性是一个Person对象的实例，Person对象本身还具有一个address属性。owner的地址可能会更改，而不会更改由银行账户持有的owner引用。银行账户的所有者没有更改，只是他们的地址发生了变化。
- **To-many relationships.**一对多关系
  - 这些是集合对象`collection objects`。通常使用NSArray或NSSet的实例来保存这样的集合，也可以使用自定义集合类。

在以下代码中声明的BankAccount对象演示了每种属性类型的一个示例。

```objc
@interface BankAccount : NSObject
 
@property (nonatomic) NSNumber* currentBalance;              // An attribute
@property (nonatomic) Person* owner;                         // A to-one relation
@property (nonatomic) NSArray< Transaction* >* transactions; // A to-many relation
 
@end
```

为了维护封装性，一个对象通常为其接口上的属性提供访问器方法。对象的作者可以显式编写这些方法，也可以依赖编译器自动生成它们。无论哪种方式，使用其中一个访问器的代码的作者在编译之前必须将属性名称写入代码中。访问器方法的名称成为使用它的代码的静态部分。例如，对于上面的代码声明的银行账户对象，编译器合成了一个可以用于myAccount实例的setter：

`[myAccount setCurrentBalance:@(100.0)]; `

这是直接的方式，但缺乏灵活性。另一方面，一个支持KVC的对象提供了一种更一般的机制，**可以使用字符串标识符来访问对象的属性**。

### Identifying an Object’s Properties with Keys and Key Paths 使用键和键路径标识对象的属性

键`Key`是一个**字符串**，用于标识特定的属性。通常，按照约定，表示属性的键是属性本身在代码中出现的名称。**键必须使用ASCII编码，不能包含空格，通常以小写字母开头**（尽管也有例外情况，例如在许多类中含有的URL属性）。

因为上述代码中的BankAccount类支持KVC，它识别键`owner`、`currentBalance`和`transactions`，这些是其属性的名称。您可以使用键来设置值，而不是调用setCurrentBalance:方法：

`[myAccount setValue:@(100.0) forKey:@"currentBalance"];`

实际上，您可以使用相同的方法通过不同的键参数设置myAccount对象的所有属性。因为参数是一个字符串，所以它可以在运行时进行操作。

键路径`key path`是一个**由点分隔的键的字符串**，**用于指定要遍历的一系列对象属性**。序列中第一个键的属性是相对于`receiver`的，而每个后续键都相对于前一个属性的值进行评估。键路径对于使用单个方法调用深入到对象层次结构中非常有用。

例如，应用于银行账户实例的键路径`owner.address.street`指的是存储在银行账户所有者的地址中的街道字符串的值，假设Person和Address类也支持KVC。

```
注意
在Swift中，您可以使用#keyPath表达式来表示键或键路径，而不是使用字符串。
这具有编译时检查的优势，如《使用Swift与Cocoa和Objective-C（Swift 3）》
指南中的Keys and Key Paths部分所述。
```

### Getting Attribute Values Using Keys 使用键获取Attribute值

当一个对象采用NSKeyValueCoding协议时，它就支持KVC。继承自[NSObject](https://developer.apple.com/library/archive/documentation/LegacyTechnologies/WebObjects/WebObjects_3.5/Reference/Frameworks/ObjC/Foundation/Classes/NSObject/Description.html#//apple_ref/occ/cl/NSObject)的对象，它提供了协议基本方法的默认实现，会自动采用这个协议并具有某些默认行为。这样的对象至少实现了以下基本基于键的获取方法：

- `valueForKey: `
  - 返回由键参数指定的属性的值。如果无法按照「[Accessor Search Patterns](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/SearchImplementation.html#//apple_ref/doc/uid/20000955-CJBBBFFA) 访问器搜索模式」中描述的规则找到由键指定的属性，那么对象将向自身发送一个valueForUndefinedKey:消息。valueForUndefinedKey:的默认实现会引发一个NSUndefinedKeyException异常，但子类可以覆盖此行为并更加优雅地处理这种情况。
- `valueForKeyPath`
  - 返回相对于接收者的指定键路径的值。在键路径序列中，如果某个对象不支持特定键的KVC，也就是说，valueForKey:的默认实现找不到访问器方法，那么该对象会接收一个valueForUndefinedKey:消息。
- dictionaryWithValuesForKeys: 
  - 返回相对于接收者的键数组的值。该方法为数组中的每个键调用valueForKey:。返回的NSDictionary包含数组中所有键的值。

```
注意
集合对象，比如NSArray、NSSet和NSDictionary，不能包含nil作为值。
相反，您可以使用NSNull对象来表示nil值。NSNull提供了一个表示对象
属性的nil值的单一实例。dictionaryWithValuesForKeys:
和相关的setValuesForKeysWithDictionary:的默认实现会自动在NSNull
（在字典参数中in the dictionary parameter）
和nil（在存储属性中in the stored property)）之间进行转换。
```

当您使用键路径来访问属性时，如果键路径中除了最后一个键以外的任何键都是一对多关系（即它引用一个集合），返回的值将是一个包含**所有位于一对多键右侧的键的值的集合**。例如，请求键路径transactions.payee的值将返回一个包含所有交易的所有收款人对象的数组。这也适用于键路径中的多个数组。键路径accounts.transactions.payee将返回包含所有帐户中所有交易的所有收款人对象的数组。

### Setting Attribute Values Using Keys 使用键设置Attribute值

与获取器类似，支持KVC的对象还提供了一小组通用的设置器，其默认行为基于在NSObject中找到的NSKeyValueCoding协议的实现：

- `setValue:forKey: `
  - 给相对于接收消息的对象的指定键的属性以给定值。setValue:forKey:的默认实现会自动展开NSNumber和NSValue对象，这些对象表示标量`scalars`和结构`structs`，然后将它们赋给属性。有关包装`wrapping`和解包`unwrapping`语义的详细信息，请参阅「[Representing Non-Object Values](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/DataTypes.html#//apple_ref/doc/uid/20002171-BAJEAIEE) 表示非对象值」。
  - 如果指定的键对应于对象（接受到的setter所）不具有的属性，该对象将向自身发送一个setValue:forUndefinedKey:消息。setValue:forUndefinedKey:的默认实现会引发一个NSUndefinedKeyException异常。然而，子类可以覆盖此方法以自定义方式处理请求。
- `setValue:forKeyPath: `
  - 在相对于接收者的指定键路径中设置给定值。在键路径序列中，如果某个对象不支持特定键的KVC，它会接收到一个setValue:forUndefinedKey:消息。
- `setValuesForKeysWithDictionary:`
  - 使用指定字典中的值设置接收者的属性，使用字典键来标识属性。它的默认实现会为每个键-值对调用setValue:forKey:，并根据需要将NSNull对象替换为nil。

在默认实现中，当您尝试将非对象属性设置为nil值时，支持KVC的对象会向自身发送一个setNilValueForKey:消息。setNilValueForKey:的默认实现会引发一个NSInvalidArgumentException异常，但对象可以覆盖此行为以替代默认值或标记值，如「[Handling Non-Object Values](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/HandlingNon-ObjectValues.html#//apple_ref/doc/uid/10000107i-CH5-SW1) 处理非对象值」中所述。

### Using Keys to Simplify Object Access 使用键来简化对象访问

为了了解基于键的getter和setter如何简化您的代码，考虑以下示例。在macOS中，NSTableView和NSOutlineView对象会将标识符字符串与它们的每个列关联起来。如果支持表格的模型对象不符合KVC规范，那么表格的数据源方法必须逐个检查每个列标识符，以找到正确的属性来返回，如下面的代码所示。此外，将来，当您向模型添加另一个属性，比如Person对象的情况，您还必须重新访问数据源方法，添加另一个条件来测试新属性并返回相关值。

```objc
//Implementation of data source method without key-value coding
- (id)tableView:(NSTableView *)tableview objectValueForTableColumn:(id)column row:(NSInteger)row
{
    id result = nil;
    Person *person = [self.people objectAtIndex:row];
 
    if ([[column identifier] isEqualToString:@"name"]) {
        result = [person name];
    } else if ([[column identifier] isEqualToString:@"age"]) {
        result = @([person age]);  // Wrap age, a scalar, as an NSNumber
    } else if ([[column identifier] isEqualToString:@"favoriteColor"]) {
        result = [person favoriteColor];
    } // And so on...
 
    return result;
}
```

另一方面，下面的代码显示了相同数据源` data source`方法的一个更紧凑的实现，它利用了符合KVC规范的Person对象。仅使用valueForKey: getter，数据源方法**使用列标识符作为键**返回适当的值。除了更短之外，它还更加通用，**因为只要列标识符始终与模型对象的属性名称匹配**，它就可以在以后添加新列时继续正常工作，不需要进行更改。

```objc
- (id)tableView:(NSTableView *)tableview objectValueForTableColumn:(id)column row:(NSInteger)row
{
    return [[self.people objectAtIndex:row] valueForKey:[column identifier]];
}
//首先self.people 取出列中的Person类的一个实例对象
//然后向这个对象发生valueForKey:消息，获取对应列的值
```

## Accessing Collection Properties
