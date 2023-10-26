---
title: Encapsulating Data 封装数据

order: 3
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

# Encapsulating Data 封装数据

除了[前一章节](WorkWithObject.md)中介绍的消息传递行为之外，一个对象还通过其属性`properties`来封装数据。

本章描述了用于声明对象属性的Objective-C语法，并解释了这些属性如何默认**通过访问器方法`accessor methods`与实例变量`instance variables`的结合**来实现的。如果一个属性由实例变量支持，那么在任何初始化方法中必须正确设置该变量。

如果一个对象需要通过属性来维护与另一个对象的链接，那么考虑两个对象之间关系的性质是很重要的。尽管Objective-C对象的内存管理大部分由自动引用计数（ARC）处理，但知道如何**避免像强引用循环**这样的问题同样重要【ARC机制的弱点——循环引用】，这种情况会导致内存泄漏。本章**解释了对象的生命周期**，并描述了通过关系来管理对象图的思考方式。

## Properties Encapsulate an Object’s Values 属性封装了对象的值

大多数对象需要保持跟踪信息来执行其任务。一些对象旨在模拟一个或多个值，比如Cocoa的NSNumber类用于保存数值，或自定义的XYZPerson类用于模拟具有名字的人。一些对象的范围更广泛，比如说处理用户界面与其显示的信息之间的交互。但即使是这些对象，也需要跟踪用户界面元素或相关的模型对象。【这段意思其实是说即使管理显示的对象，也需要持有数据并进行数据交互】

### Declare Public Properties for Exposed Data 声明公共属性以暴露数据

Objective-C属性`properties`提供了一种定义类封装的信息的方式。如在前文「[Properties Control Access to an Object’s Values](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/DefiningClasses/DefiningClasses.html#//apple_ref/doc/uid/TP40011210-CH3-SW7) 属性控制对对象值的访问」中所提到的的，属性声明包含在类的接口中，如下所示：

```objc
@interface XYZPerson : NSObject
@property NSString *firstName;
@property NSString *lastName;
@end
```

在这个示例中，XYZPerson类声明了字符串属性来保存一个人的名字和姓氏。

鉴于面向对象编程的主要原则之一是对象应该将其内部工作隐藏在其公共接口之后，重要的是要**使用对象公开的行为来访问对象的属性**，而不是尝试直接访问内部值

### Use Accessor Methods to Get or Set Property Values 使用访问器方法获取或设置属性值

您可以通过访问器方法来访问或设置对象的属性：

```objc
    NSString *firstName = [somePerson firstName];//获取属性
    [somePerson setFirstName:@"Johnny"];//设置属性
```

默认情况下，**编译器会自动为您合成这些访问器方法**，因此您不需要做任何额外的工作，只**需在类接口中使用@property声明属性即可。**

合成的方法遵循特定的命名约定：

- 用于访问值（getter方法）的方法与属性具有**相同的名称**。例如，名为firstName的属性的getter方法也将被命名为firstName。
- 用于设置值（setter方法）的方法以单词“set”开始，然后**使用大写的属性名称**。例如，名为firstName的属性的setter方法将被命名为setFirstName:。

如果您不希望通过setter方法允许更改属性，可以在属性声明中添加一个属性，指定它为readonly：

```objc
@property (readonly) NSString *fullName;
//除了向其他对象展示它们应该如何与属性交互之外，
//属性还告诉编译器如何合成相关的访问器方法。
//在这种情况下，编译器将合成一个fullName的getter方法，
//但不会合成setFullName:方法。
```

```
注意：readonly的反义词是readwrite。无需显式指定readwrite属性，因为它是默认的。
```

**如果您想为访问器方法指定不同的名称，可以通过添加属性来指定自定义名称**。在布尔属性（具有YES或NO值的属性）的情况下，通常是getter方法以单词“is”开头。例如，名为finished的属性的getter方法应该被命名为isFinished。

同样，您可以在属性上添加属性：

```objc
@property (getter=isFinished) BOOL finished;
```

如果需要指定多个属性，只需将它们包含为逗号分隔的列表，如下所示：

```objc
@property (readonly, getter=isFinished) BOOL finished;
```

在这种情况下，编译器只会合成一个isFinished方法，但不会合成setFinished:方法。

```
注意：通常情况下，属性访问器方法应该符合键-值编码（KVC）规范，
这意味着它们遵循显式的命名约定。有关更多信息，请参阅键-值编码编程指南。
```

*[Key-Value Coding Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107i)*

### Dot Syntax Is a Concise Alternative to Accessor Method Calls 点语法是一种简洁的替代访问器方法调用的方式

除了显式调用访问器方法之外，Objective-C还提供了一种替代的点语法来访问对象的属性。

点语法允许您像这样访问属性：

```objc
    NSString *firstName = somePerson.firstName;//获取属性值
    somePerson.firstName = @"Johnny";//设置属性值
```

点语法**纯粹是对访问器方法调用的便捷封装**。当您使用点语法时，属性仍然通过上面提到的getter和setter方法来访问或更改：

使用somePerson.firstName获取值与使用`[somePerson firstName]`相同 使用somePerson.firstName = @"Johnny"设置值与使用`[somePerson setFirstName:@"Johnny"]`相同 这意味着通过点语法访问属性也受属性属性的控制。如果属性标记为readonly，如果尝试使用点语法设置它，您将会收到编译器错误。

### Most Properties Are Backed by Instance Variables 大多数属性都由实例变量支持

默认情况下，可读写（readwrite）属性将由一个实例变量支持，**该实例变量将由编译器自动合成**。

实例变量是**一个在对象的生命周期内存在并保存其值的变量**。用于实例变量的内存在对象第一次创建（通过`alloc`）时分配，并在对象被释放时释放。

**除非另有指定，合成的实例变量与属性具有相同的名称**，**但前面带有下划线前缀**。

- 例如，对于一个名为firstName的属性，合成的实例变量将被命名为_firstName。

尽管最佳实践是对象应该使用访问器方法或点语法来访问自己的属性，但可以从类实现中的任何实例方法直接访问实例变量。下划线前缀使其清楚地表明您正在访问一个实例变量，而不是例如局部变量：

```objc
- (void)someMethod {
    NSString *myString = @"An interesting string";
 
    _someString = myString;
}
```

在这个示例中，很明显myString是一个局部变量，而_someString是一个实例变量。

通常情况下，**即使从对象的实现内部访问对象的属性，您也应该使用访问器方法或点语法来进行属性访问**，在这种情况下，您应该使用self：

```objc
- (void)someMethod {
    NSString *myString = @"An interesting string";
 
    self.someString = myString;
    // 或者
    [self setSomeString:myString];
}
```

这个规则的例外是在编写初始化、释放或自定义访问器方法时，后面将在本节中描述。

#### You Can Customize Synthesized Instance Variable Names 您可以自定义合成实例变量的名称

【这一@Synthesized已经被弃用了】

如前所述，可写属性的默认行为是借助使用一个名为_propertyName的实例变量来实现的。

如果您希望使用不同的名称来命名实例变量，您需要在实现中使用以下语法指示编译器来合成变量：

```
@implementation YourClass
@synthesize propertyName = instanceVariableName;
...
@end
```

#### You Can Define Instance Variables without Properties 您可以在不使用属性的情况下定义实例变量

在任何时候需要跟踪值或另一个对象时，最佳实践是在对象上使用属性。

**如果确实需要定义自己的实例变量而不声明属性，可以将它们添加在类接口或实现的顶部的大括号内**，如下所示：

```objc
@interface SomeClass : NSObject {
    NSString *_myNonPropertyInstanceVariable;
}
...
@end
  //或者
@implementation SomeClass {
    NSString *_anotherCustomInstanceVariable;
}
...
@end
```

注意：您您还可以在类扩展的顶部添加实例变量，如在“类扩展扩展内部实现”中所描述的那样[Class Extensions Extend the Internal Implementation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html#//apple_ref/doc/uid/TP40011210-CH6-SW3)

### Access Instance Variables Directly from Initializer Methods 在初始化方法中直接访问实例变量

Setter方法可能会产生附加的副作用。它们可能触发KVC通知`KVC notifications`，或者执行进一步的任务，如果您编写了自己的自定义方法的话。

在初始化方法中，您应该总是**直接访问实例变量**，因为在属性被设置时，对象的其余部分可能尚未完全初始化。即使您不提供自定义的访问器方法或已经了解任何来自您自己类内的副作用，未来的子类也很可能会覆盖现在的行为。【这段意思是你在初始化中使用实例变量的时候，就不应该使用[]或者点语法来访问了，因为即使这些方法现在保持了正常访问的特性，但是在之后还是有被更改的风险，导致行为超出预期】

一个典型的初始化方法看起来像这样：

```objc
- (id)init {
    self = [super init];
 
    if (self) {
        // initialize instance variables here
    } 
    return self;
}
```

在执行自己的初始化之前，初始化方法应将self赋给调用父类初始化方法的结果。父类可能会在初始化对象时失败并返回nil，因此在执行自己的初始化之前，您应该始终检查self是否为nil。

通过在方法中的第一行调用[super init]，对象是按顺序从其根类初始化的，依次通过每个子类的init实现。图3-1显示了初始化XYZShoutingPerson对象的过程。

![The initialization process](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/initflow.png)

正如您在前一章节中所看到的，对象可以通过调用init方法或调用一个使用特定值初始化对象的方法来进行初始化。

对于XYZPerson类，提供一个初始化方法来设置人的初始名字和姓氏是有意义的：

```objc
- (id)initWithFirstName:(NSString *)aFirstName lastName:(NSString *)aLastName;
```

您可以像这样实现该方法：

```objc
- (id)initWithFirstName:(NSString *)aFirstName lastName:(NSString *)aLastName {
    self = [super init];
 
    if (self) {
        _firstName = aFirstName;
        _lastName = aLastName;
    }
 
    return self;
}
```

#### The Designated Initializer is the Primary Initialization Method 指定初始化方法是最主要的初始化方法

如果一个对象声明了一个或多个初始化方法，**您应该决定哪个方法是指定的初始化方法**。通常，这个方法提供了最多的初始化选项（比如具有最多参数的方法），并且可以被您编写的其他方法便捷的调用。通常情况下，您应该重写`init`方法，以调用具有合适默认值的指定初始化方法。

如果XYZPerson还具有出生日期的属性，指定的初始化方法可能如下：

```objc
- (id)initWithFirstName:(NSString *)aFirstName lastName:(NSString *)aLastName
                                            dateOfBirth:(NSDate *)aDOB;

```

这个方法会设置相关的实例变量，就像之前所示的一样。如果您仍希望提供一个仅包含名字和姓氏的便捷初始化方法，您可以实现该方法以调用指定的初始化方法，如下所示：

```objc
- (id)initWithFirstName:(NSString *)aFirstName lastName:(NSString *)aLastName {
    return [self initWithFirstName:aFirstName lastName:aLastName dateOfBirth:nil];
}
//这里将 dateOfBirth设为nil，感觉这个部分不如c++可以有默认参数列表
```

您还可以实现一个标准的init方法以提供合适的默认值：

```objc
- (id)init {
    return [self initWithFirstName:@"John" lastName:@"Doe" dateOfBirth:nil];
}
```

如果需要在继承使用多个init方法的类时编写初始化方法，您应该要么重写超类的指定初始化方法以执行自己的初始化，要么添加自己的附加初始化方法。无论哪种方式，您都应该在执行任何自己的初始化之前调用超类的指定初始化方法（而不是使用`[super init]`）。

### You Can Implement Custom Accessor Methods 您可以实现自定义访问器方法

属性并不总是必须由它们自己的实例变量支持。

例如，XYZPerson类可以为人的全名定义一个只读属性：

```objc
@property (readonly) NSString *fullName;
```

而不是每次名字或姓氏发生变化时都更新fullName属性，**更容易的方法是编写一个自定义访问器方法，根据需要构建完整的名字字符串**：

```objc
- (NSString *)fullName {
    return [NSString stringWithFormat:@"%@ %@", self.firstName, self.lastName];
}
```

这个简单的示例使用了一个格式化字符串和格式说明符（如前一章所述）来构建一个包含名字和姓氏之间以空格分隔的字符串。

**如果需要为使用实例变量的属性编写自定义访问器方法，您必须在方法内部直接访问该实例变量**。例如，通常可以延迟属性的初始化，直到首次请求属性，使用“延迟访问器”，如下所示：

```objc
- (XYZObject *)someImportantObject {
    if (!_someImportantObject) {
        _someImportantObject = [[XYZObject alloc] init];
    }
 
    return _someImportantObject;
}
```

在返回值之前，该方法首先检查_someImportantObject实例变量是否为nil；如果是，它会分配一个对象。

```
注意：编译器会在所有情况下自动合成一个实例变量，
其中至少合成一个访问器方法。如果您为可读写属性同时实现了getter和setter，
或者为只读属性实现了getter，编译器将假定您正在控制属性的实现，不会自动合成一个实例变量。
```

如果仍然需要一个实例变量，您需要请求合成一个：

```objc
@synthesize property = _property;
```

【很明显，这一大段现在基本上也不适用了】

### Properties Are Atomic by Default 属性默认是原子性的

默认情况下，Objective-C属性是原子性的：

```objc
@interface XYZObject : NSObject
@property NSObject *implicitAtomicObject;          // 默认是原子性的
@property (atomic) NSObject *explicitAtomicObject; // 明确标记为原子性
@end
```

这意味着合成的访问器确保值总是通过getter方法完全检索或通过setter方法完全设置,即使从不同线程同时调用访问器也是这样【这里有个陷阱，仅仅只是对单个方法来说保持原子性，但是如果同时读写还是会造成内存泄漏的】。

由于原子访问器方法的内**部实现和同步是私有的**，因此不可能将合成的访问器与您自己实现的访问器方法结合在一起。例如，**如果您尝试为一个原子性的可读写属性提供自定义setter，但让编译器合成getter，您将会得到一个编译器警告**。

您可以使用nonatomic属性属性来**指定合成的访问器只是直接设置或返回一个值**，而**不保证如果从不同线程同时访问相同的值会发生什么**。因此，访问nonatomic属性要比原子性属性更快，而且可以将合成的setter与您自己的getter实现结合使用，例如：

```objc
@interface XYZObject : NSObject
@property (nonatomic) NSObject *nonatomicObject;
@end

@implementation XYZObject
- (NSObject *)nonatomicObject {
    return _nonatomicObject;
}
// setter将自动合成
@end
```

```
注意：属性的原子性并不等同于对象的线程安全性。
考虑一个XYZPerson对象，其中一个人的名字和姓氏都使用原子访问器从一个线程更改。
如果另一个线程同时访问这两个名字，那么原子性的getter方法将返回完整的字符串（
而不会崩溃），但不能保证这些值相对于彼此是正确的名字。
如果在更改之前访问了名字，但在更改之后访问了姓氏，那么您将得到不一致的、不匹配的名字对
```

这个示例相当简单，但在考虑跨相关对象网络时，线程安全性问题变得更加复杂。线程安全性将在《*[Concurrency Programming Guide](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008091)*并发编程指南》中更详细地介绍。

## Manage the Object Graph through Ownership and Responsibility 通过所有权和责任来管理对象图

正如您已经看到的，Objective-C对象的内存是动态分配的（在堆上），这意味着您需要使用指针来跟踪对象的地址。与标量值不同，你大多数时候无法通过一个指针变量的作用域来确定对象的生命周期。与之相反，只要其他对象需要某个对象，这个对象必须在内存中保持活动状态。

与其试图手动管理每个对象的生命周期，不如考虑对象之间的关系。【出现了，苹果的断言】

例如，对于XYZPerson对象，firstName和lastName两个字符串属性实际上是由XYZPerson实例“拥有”的。这意味着只要XYZPerson对象在内存中，它们应该保持在内存中。

当一个对象以这种方式依赖于其他对象，有效地拥有那些其他对象时，第一个对象被认为对其他对象具有**强引用**`*strong references* `。在Objective-C中，**只要另一个对象有至少一个强引用指向它，对象就会保持活动状态**。XYZPerson实例与两个NSString对象之间的关系如下图所示。

![Strong Relationships](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongpersonproperties.png)

当一个XYZPerson对象从内存中被释放时，假设没有其他强引用指向它们，这两个字符串对象也将被释放。

为了增加这个示例的复杂性，考虑一个应用程序的对象图，如下图所示

![The Name Badge Maker application](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/namebadgemaker.png)

当用户点击“Update”按钮时，`badge`界面会使用相关的姓名信息进行更新。

第一次输入个人详细信息并点击“Update”按钮时，简化的对象图可能如下图所示。

![Simplified object graph for initial XYZPerson creation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/simplifiedobjectgraph1.png)

当用户修改了个人的名字时，对象图将发生变化，如下图所示![Simplified object graph while changing the person’s first name](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/simplifiedobjectgraph2.png)

`badge`显示视图与原始的@"John"字符串对象保持强引用关系，尽管XYZPerson对象现在具有不同的firstName。这意味着@"John"对象仍然保留在内存中，由`badge`视图用于打印姓名。

一旦用户第二次点击“Update”按钮，`badge`视图被告知更新它的内容。

![Simplified object graph after updating the badge view](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/simplifiedobjectgraph3.png)

在这一点上，原始的@"John"对象不再有任何强引用，因此它被从内存中移除。

默认情况下，Objective-C属性和变量都会保持对它们的对象的强引用。这对于许多情况来说是合适的，但它确实可能导致强循环引用的潜在问题。

### Avoid Strong Reference Cycles

尽管强引用在对象之间的单向关系中工作得很好，但在处理一组相互关联的对象时需要小心。如果一组对象通过强关系的循环连接在一起，它们会保持彼此活动，即使在组外没有强引用。

有一个明显的潜在引用循环的例子存在于表视图对象（iOS中的UITableView和OS X中的NSTableView）和它的`delegate`之间。为了使通用的表视图` table view`类在多种情况下都能派上用场，它将一些决策[委托](/tec/basic/概念介绍合集/Delegation.md)给外部对象。这意味着它依赖于另一个对象来决定它显示什么内容，或者当用户与表视图中的特定条目进行交互时应该执行什么操作。

常见的情况是，表视图具有对其`delegate`的引用，`delegate`又引用回表视图，如下图所示

![Strong references between a table view and its delegate](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongreferencecycle1.png)

如果其他对象放弃了它们与表视图和`delegate`的强引用关系，问题就会发生，如下图所示。

![A strong reference cycle](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongreferencecycle2.png)

即使这些对象不需要被保留在内存中，因为除了表视图或`delegate`之间互相的强引用关系，没有其他的强引用了，而这两个对象之间的强引用关系使它们保持活动状态。这被称为强引用循环。

解决这个问题的方法是用弱引用`*weak reference*`替代其中一个强引用。弱引用并不代表着两个对象之间的所有权或责任关系，也不会保持对象的活动状态。

如果将表视图修改为使用对其`delegate`的弱关系（实际上UITableView和NSTableView就是这样解决这个问题的），则初始的对象图现在如下图所示。

![The correct relationship between a table view and its delegate](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongreferencecycle3.png)

当图中的其他对象再次放弃与表视图和`delegate`的强引用关系时，如下图，这次就不再有强引用指向委托对象

![Avoiding a strong reference cycle](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongreferencecycle4.png)

这意味着`delegate`对象将被释放，从而释放了对表视图的强引用，如下图所示

![Deallocating the delegate](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/strongreferencecycle5.png)

一旦`delegate`被释放，就不再有对表视图的强引用，所以表视图也会被释放。

### Use Strong and Weak Declarations to Manage Ownership 使用强引用和弱引用声明来管理所有权

默认情况下，像这样声明的对象属性：

```objc
@property id delegate;
```

**会对其合成的实例变量使用强引用**。要声明一个弱引用，可以在属性上添加属性，像这样：

```objc
@property (weak) id delegate;
```

```
注意：与弱引用相对的是强引用。无需显式指定强引用属性，因为它是默认的。
```

默认情况下，局部变量`Local variables`（和非属性实例变量`non-property instance variables`）也会维护对对象的强引用。这意味着以下代码将按您的预期工作：

```objc
    NSDate *originalDate = self.lastModificationDate;
    self.lastModificationDate = [NSDate date];
    NSLog(@"Last modification date changed from %@ to %@",
                        originalDate, self.lastModificationDate);
```

在这个示例中，局部变量`originalDate`维护对原本`lastModificationDate`对象的强引用。当`lastModificationDate`属性发生更改时，属性不再保持对原始日期的强引用，但该日期仍由`originalDate`强引用变量保持活动状态。【也就是我持有了原来属性的对象，并不会因为属性的更改而更改】

```
注意：一个变量只在其作用域内、或直到它被重新分配了另一个对象或nil前，保持对这个对象的强引用。
//这么简单的东西讲的这么拗口，就是变量作用域内持有对象时保持强引用
```

**如果不希望变量保持强引用**，可以将其声明为`__weak`，如下所示：

```objc
NSObject * __weak weakVariable;
```

为弱引用不会保持对象的活动状态，所以在引用的对象仍在使用时，引用的对象可能被释放。**为了避免指向已释放对象的危险悬空指针，当其对象被释放时，弱引用会自动设置为nil。**【是不是该夸它贴心】

这意味着如果在上一个日期示例中使用弱变量：

```objc
NSDate * __weak originalDate = self.lastModificationDate;
self.lastModificationDate = [NSDate date];
```

`originalDate`变量可能被设置为nil。当`self.lastModificationDate`重新分配时，该属性不再保持对原始日期的强引用。如果没有其他强引用指向它，原始日期将被释放，并`originalDate`将被设置为nil。

弱变量可能会引发混淆，尤其是在像下面这样的代码中：

```objc
NSObject * __weak someObject = [[NSObject alloc] init];
```

在这个示例中，新分配的对象没有对它的强引用，因此它会立即被释放，并且`someObject`会设置为nil。

```
注意：与__weak相对的是__strong。同样，无需显式指定__strong，因为它是默认的。
```

**如果需要多次访问弱属性的方法，要特别考虑**，如下所示：

```objc
- (void)someMethod {
    [self.weakProperty doSomething];
    ...
    [self.weakProperty doSomethingElse];
}
```

在这种情况下，**您可能希望将弱属性缓存在一个强变量中，以确保它在您需要使用它的时间内保持在内存中：**

```objc
- (void)someMethod {
    NSObject *cachedObject = self.weakProperty;
    [cachedObject doSomething];
    ...
    [cachedObject doSomethingElse];
}
```

【还想的挺周到】

在这个示例中，`cachedObject`变量维护对原始弱属性值的强引用，以便只要`cachedObject`仍在作用域内（且尚未被重新分配另一个值），它就不会被释放。

**如果需要确保弱属性在使用之前不为nil**，尤其需要牢记这一点。**仅仅测试它是不够的**，如下所示：

```objc
  if (self.someWeakProperty) {
        [someObject doSomethingImportantWith:self.someWeakProperty];
    }
```

因为在多线程应用程序中，属性可能在测试和方法调用之间被释放，从而使测试变得无效。相反，您需要声明一个强局部变量来缓存值，如下所示：

```
NSObject *cachedObject = self.someWeakProperty;           // 1
if (cachedObject) {                                       // 2
    [someObject doSomethingImportantWith:cachedObject];   // 3
}                                                         // 4
cachedObject = nil;                                       // 5

```

在这个示例中，强引用是在第1行创建的，这意味着对象保证在测试和方法调用期间保持活动状态。在第5行，`cachedObject`被设置为nil，从而放弃了强引用。如果原始对象此时没有其他强引用，它将被释放，而`someWeakProperty`将被设置为nil。

### Use Unsafe Unretained References for Some Classes 对某些类使用不安全的非持有引用

有一些Cocoa和Cocoa Touch中的类尚不支持弱引用，这意味着您无法声明一个弱属性或弱局部变量来跟踪它们。这些类包括`NSTextView`，`NSFont`和`NSColorSpace`等；有关完整列表，请参阅“*[Transitioning to ARC Release Notes](https://developer.apple.com/library/archive/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011226)*”。

如果需要使用弱引用引用这些类中的一个，必须使用不安全的引用。对于属性，这意味着使用`unsafe_unretained`属性：

```
@property (unsafe_unretained) NSObject *unsafeProperty;
```

对于变量，需要使用`__unsafe_unretained`：

```objc
NSObject * __unsafe_unretained unsafeReference;
```

不安全引用类似于弱引用，因为它不会使其相关的对象保持活动状态，**但如果目标对象被释放，它不会被设置为nil**。这意味着您将得到一个指向原始被释放对象的内存的悬空指针，因此称为“不安全”。**向悬空指针发送消息将导致崩溃**。【前面提到了，像nil发送消息时被允许的，且不会发生其他事情】

### Copy Properties Maintain Their Own Copies 复制属性维护它们自己的副本

在某些情况下，一个对象可能希望保留其属性设置的对象的副本。

举个例子，之前在图3-4中显示的XYZBadgeView类的类接口可能如下所示：

```objc
@interface XYZBadgeView : NSView
@property NSString *firstName;
@property NSString *lastName;
@end
```

声明了两个NSString属性，它们都隐式保持对其对象的强引用。

考虑如果另一个对象创建一个字符串来设置为`badge`视图属性之一的情况，如下所示：

```objc
    NSMutableString *nameString = [NSMutableString stringWithString:@"John"];
//创建一个可变字符串对象
    self.badgeView.firstName = nameString;
//将可变字符串设置到窗体的delegate
```

上述是完全有效的，因为`NSMutableString`是`NSString`的子类。尽管`badge`视图认为它正在处理`NSString`实例，但实际上它正在处理`NSMutableString`。

这意味着字符串可以更改：

```objc
[nameString appendString:@"ny"];
```

在这种情况下，尽管最初为`badge`视图的`firstName`属性设置的时候是“John”，但现在它是“Johnny”，因为可变字符串已更改【发送了消息进行了修改】。【这段就是说，控件的显示值一般情况下会跟随delegate的修改而修改，也就是捕获变化并展示】

您可以选择让`badge`视图维护其`firstName`和`lastName`属性的任何字符串的自己的副本，以便它在设置属性的时候有效的捕获字符串。通过在两个属性声明中添加`copy`属性

```objc
@interface XYZBadgeView : NSView
@property (copy) NSString *firstName;
@property (copy) NSString *lastName;
@end
```

视图现在维护这两个字符串的副本。即使设置了可变字符串并随后更改，`badge`视图会保持它在被设置时捕获的值。例如：

```objc
NSMutableString *nameString = [NSMutableString stringWithString:@"John"];
self.badgeView.firstName = nameString;
[nameString appendString:@"ny"];
```

这一次，`badge`视图的`firstName`将是最初的“John”字符串的**未受影响的副本**。

`copy`属性意味着该属性将使用强引用，因为它必须保留它创建的新对象。

注意：您希望为`copy`属性设置的任何对象必须支持`NSCopying`，这意味着它应该符合`NSCopying`协议。有关协议的信息，请参阅“[Protocols Define Messaging Contracts](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithProtocols/WorkingwithProtocols.html#//apple_ref/doc/uid/TP40011210-CH11-SW2) 协议定义消息传递契约”。有关`NSCopying`的更多信息，请参阅`NSCopying`[NSCopying](https://developer.apple.com/library/archive/documentation/LegacyTechnologies/WebObjects/WebObjects_3.5/Reference/Frameworks/ObjC/Foundation/Protocols/NSCopying/Description.html#//apple_ref/occ/intf/NSCopying)或高级内存管理编程指南*[Advanced Memory Management Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/MemoryMgmt.html#//apple_ref/doc/uid/10000011i)*。

如果需要在初始化方法中直接设置`copy`属性的实例变量，例如，在初始化方法中，请不要忘记设置原始对象的副本：

```objc
- (id)initWithSomeOriginalString:(NSString *)aString {
    self = [super init];
    if (self) {
        _instanceVariableForCopyProperty = [aString copy];
    }
    return self;
}
```

