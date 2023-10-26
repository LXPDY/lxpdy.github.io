---
title: Working with Objects 使用对象

order: 2
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-23
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

# Working with Objects 使用对象

Objective-C 应用程序中的大部分工作是通过在对象生态系统中来回发送消息来完成的。【苹果好几次提到这句话了】这些对象中的一些是由Cocoa或Cocoa Touch提供的框架类的实例，另一些是你自己编写的类的实例。

[上一章](DefiningClasses.md)描述了定义类的接口和实现的语法，包括实现响应消息的方法的代码的语法。本章解释了如何向对象发送这样的消息，并介绍了一些Objective-C的**动态特性**，包括动态类型`dynamic typing`和能够在运行时确定实际应调用哪个方法的能力。

在对象可以被使用之前，程序员必须正确地创建它:做好为其分配内存，为其属性`properties`和任何必要的内部值进行初始化等一系列动作。本章将描述如何嵌套调用以分配和初始化对象，以确保对象被正确配置。

## Objects Send and Receive Messages 对象发送和接收消息

尽管在Objective-C中发送对象之间的消息有几种不同的方法，但远远最常见的方法是使用方括号的基本语法，如下所示：

```objc
[someObject doSomething];
```

左边的引用（someObject），是消息的接收者。右边的消息（doSomething）是要在该接收者上调用的方法的名称。换句话说，当执行上面的代码行时，someObject将会收到doSomething消息。

上一章描述了如何创建类的接口以及如何创建该类的实现,如下所示：

```objc
@interface XYZPerson : NSObject
- (void)sayHello;
@end
  
@implementation XYZPerson
- (void)sayHello {
    NSLog(@"Hello, world!");
}
@end
```

```
注意：此示例使用了Objective-C字符串literal简写@"Hello, world!"。字符串是Objective-C中允许使用简写literal语法的多种类型之一。@"Hello, world!"在概念上等同于说“一个代表字符串Hello, world!的Objective-C字符串对象”。
literal和对象创建在本章的后面“ Objects Are Created Dynamically 对象是动态创建的”中进一步解释。
```

假设你已经获得了一个XYZPerson对象，你可以这样向它发送sayHello消息：

```objc
 [somePerson sayHello];
```

发送Objective-C消息在概念上非常类似于调用C函数。下图显示了sayHello消息的有效程序流程。

![ Basic messaging program flow](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/programflow1.png)

为了指定消息的接收者，重要的是要理解在Objective-C中**如何使用指针来引用对象**。

### Use Pointers to Keep Track of Objects 使用指针跟踪对象

C语言和Objective-C使用变量来跟踪值，就像大多数其他编程语言一样。标准C语言中定义了一些基本的标量变量类型，包括整数、浮点数和字符，可以像这样声明并分配值：

```c
int someInteger = 42;
float someFloatingPointNumber = 3.14f;
//局部变量，也就是在方法或函数中声明的变量，像这样：
(void)myMethod {
	int someInteger = 42;
}
//在此示例中，someInteger被声明为myMethod内部的局部变量；
//一旦执行到方法的右大括号，someInteger将不再可访问。
//当局部标量变量（例如int或float）消失时，其值也会消失。
```

**与此不同**，Objective-C对象通常以稍微不同的方式分配**。对象通常的生命周期要长于方法调用的简单范围**。特别表现在通常一个对象的寿命**比用于跟踪它的原始变量的寿命更长**，因此**对象的内存是动态分配和释放的**。【“亿”点不同】

```
注意：如果你习惯使用栈stack和堆heap等术语，
局部变量是在栈stack上分配的，而对象是在堆上分配的。
```

这需要你使用C指针（用于保存内存地址）来跟踪它们在内存中的位置，像这样：

```objc
- (void)myMethod {
    NSString *myString = // get a string from somewhere...
    [...]
}
```

- 尽管指针变量myString（星号表示它是一个指针）【苹果它真的担心你看不懂】的范**围仅限于myMethod的范围**，但**它实际上指向内存中的字符串对象可能在该范围之外存在更长的时间**。举个例子，它不仅可能已经存在，或者你可能需要传递对象以在其他地方调用它的方法。【这里就已经和C++的对象不大一样了，C++对象的生命周期由程序员或者指南指针严格控制】

### You Can Pass Objects for Method Parameters 可以将对象作为方法参数传递

如果需要在发送消息时传递对象，可以在方法参数中提供对象指针。因此，声明接受字符串对象的方法的语法如下：

```objc
- (void)saySomething:(NSString *)greeting;
//可以像这样实现saySomething:方法：
- (void)saySomething:(NSString *)greeting {
    NSLog(@"%@", greeting);
}
```

greeting指针的行为类似于局部变量，仅限于saySomething:方法的范围**，即使它指向的实际字符串对象在调用方法之前存在，并且在方法完成后继续存在**。

```
注意：NSLog()使用格式说明符来指示替代标记，就像C标准库printf()函数一样。
打印Log到控制台的字符串是通过合并字符串（第一个参数）以及后续插入的值（其余参数）
所形成结果得到的。

Objective-C中还提供了一个附加的替代标记，%@，用于表示对象。在运行时，
此说明符将被替换为调用所提供对象的descriptionWithLocale:方法（如果存在）
或description方法的结果。description方法由NSObject实现，返回对象的类
以及对象的内存地址，但许多Cocoa和Cocoa Touch类会覆盖它以提供更有用的信息。
对于NSString，description方法只是返回它表示的字符串。

有关在NSLog()和NSString类中可用的格式说明符的更多信息，请参阅文章字符串格式说明符。
```

[String Format Specifiers](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265) 字符串格式说明符

### Methods Can Return Values 方法可以返回值

除了通过方法参数传递值之外，方法还可以返回值。到目前为止，在本章中显示的每个方法的返回类型都是void。C的void关键字表示方法不返回任何内容。

指定返回类型为int表示该方法返回一个标量整数值：

```objc
- (int)magicNumber;
//方法的实现使用C的return语句来指示方法完成后应返回的值，如下所示：
(int)magicNumber {
	return 42;
}
```

如果不需要跟踪方法返回的值，可以像这样调用方法，即使magicNumber方法除了返回一个值之外不执行任何有用的操作也没有问题：

```objc
 [someObject magicNumber];
//如果需要跟踪返回的值，可以声明一个变量并将其分配给方法调用的结果，像这样：
 int interestingNumber = [someObject magicNumber];
```

你也可以以类似的方式从方法返回对象。例如，NSString类提供了一个uppercaseString方法：

```objc
- (NSString *)uppercaseString;
//使用方法返回标量值的方式一样，它需要使用指针来跟踪结果：
  NSString *testString = @"Hello, world!";
  NSString *revisedString = [testString uppercaseString];
//当此方法调用返回时，revisedString将指向一个NSString对象，表示HELLO WORLD!的字符。
```

请记住，当实现方法以返回对象时，如下所示：

```objc
- (NSString *)magicString {
    NSString *stringToReturn = // create an interesting string...
 
    return stringToReturn;
}
```

即使stringToReturn指针超出范围，作为返回值传递时，**字符串对象仍将存在**。【前面提到的生命周期的不同在这里得到体现】

在这种情况下，存在一些内存管理考虑因素：返回的对象（在堆上被创建）需要在原始调用方法被使用足够长时间，不过不是永远——因为那会导致内存泄漏。在很大程度上，Objective-C编译器的自动引用计数（ARC）特性会为你处理这些考虑因素。【这里居然不贴个ARC机制的解释文章】

### Objects Can Send Messages to Themselves 对象可以向自己发送消息

无论在什么时候编写方法的实现，都可以访问一个重要的隐藏值:`self`。从概念上讲，`self`是引用“接收到此消息的对象”的一种方式。它是一个指针，就像上面的greeting值一样，**可以用于在当前接收对象上调用方法**。

你可能决定通过修改sayHello方法，让它使用本章中提到的的saySomething:方法，从而将NSLog()的调用移到单独的方法中。这意味着你可以添加其他方法，例如sayGoodbye，它们都可以调用saySomething:方法来处理实际的问候过程。如果以后要在用户界面中显示每个问候语，只需修改saySomething:方法，而无需逐个调整每个问候方法。

使用`self`来调用当前对象上的消息的新实现如下：【也就是给自己套一层娃实现代码复用】

```objc
@implementation XYZPerson
- (void)sayHello {
    [self saySomething:@"Hello, world!"];
}
- (void)saySomething:(NSString *)greeting {
    NSLog(@"%@", greeting);
}
@end
```

如果发送给XYZPerson对象sayHello消息，那么更新后的实现将如下图所示的有效程序流程一样。

![Program flow when messaging self](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/programflow2.png)

### Objects Can Call Methods Implemented by Their Superclasses 对象可以调用其超类实现的方法

Objective-C中还有一个重要的关键字可供使用，称为`super`。**向**`super`**发送消息**是调用**继承链中**更高级别的超类定义的方法的一种方法。最常见的使用super是在重写`overriding`方法时。

假设你想创建一种新类型的人类【~~New type（无端联想）~~】，一种“大声喊话的人”类，其中每个问候都以大写字母显示。你可以复制整个XYZPerson类并把每个方法中的每个字符串修改成大写形式。但最简单的方法是创建一个继承自XYZPerson的新类，并只重写`overriding` saySomething:方法以将问候以大写字母显示，如下所示：

```objc
@interface XYZShoutingPerson : XYZPerson
@end

@implementation XYZShoutingPerson
- (void)saySomething:(NSString *)greeting {
    NSString *uppercaseGreeting = [greeting uppercaseString];
    NSLog(@"%@", uppercaseGreeting);
}
@end
```

该示例声明了一个额外的字符串指针uppercaseGreeting，并将其分配了从原始greeting对象发送uppercaseString消息的返回值。正如你前面看到的，这将是一个新的字符串对象，将原始字符串中的每个字符转换为大写字母。

因为sayHello由XYZPerson实现，并且XYZShoutingPerson设置为继承自XYZPerson，所以你也可以在XYZShoutingPerson对象上调用sayHello。当你在XYZShoutingPerson上调用sayHello时，[self saySomething:...]将使用被重写的实现，并以大写字母显示问候，结果如下图所示的有效程序流程。

![Program flow for an overridden method](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/programflow3.png)

然而，新实现并不理想，因为如果以后决定修改XYZPerson的saySomething:实现，以便在用户界面元素中显示问候时不采用NSLog()，那么还需要修改XYZShoutingPerson的实现。

更好的方法是将XYZShoutingPerson的saySomething:版本更改为调用超类（XYZPerson）实现来处理实际问候：

```objc
@implementation XYZShoutingPerson
- (void)saySomething:(NSString *)greeting {
    NSString *uppercaseGreeting = [greeting uppercaseString];
    [super saySomething:uppercaseGreeting];
}
@end
```

现在，当发送一个XYZShoutingPerson对象sayHello消息时，将产生下图所示的有效程序流程。

![Program flow when messaging super](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/programflow4.png)

## Objects Are Created Dynamically 对象是动态创建的

正如本章之前所述，为Objective-C对象分配内存的行为是动态的。创建对象的第一步是确保为对象的类定义的属性分配足够的内存，同时也包括其继承链上每个超类定义的属性。

NSObject根类提供了一个**类方法**，`alloc`，来为你处理这个过程：

```objc
+ (id)alloc;//这里是类方法
```

请注意，此方法的返回类型是id。这是Objective-C中用来表示“某种对象”的特殊关键字。**它是一个指向对象的指针**，如（NSObject *），**但特殊之处在于它不使用星号**。更多关于id的信息将在本章后面的“ [Objective-C Is a Dynamic Language](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4-SW18) Objective-C是一种动态语言”中详细描述。

`alloc`方法还有另一个重要任务，那就是通过将属性的内存清零来初始化为对象分配的内存。这避免了通常情况下内存中包含来自之前存储的垃圾的问题，但这不足以完全初始化对象。

需要将`alloc`方法的调用与init方法的调用组合在一起，`init`是NSObject的另一个方法：

```objc
- (id)init;//这里是对象方法
```

`init`方法**用于确保在创建对象时，它的属性具有合适的初始值**，下一章会对它进行了更详细的讨论。

请注意，`init`也返回`id`。

如果一个方法返回一个对象指针，**就可以像下面这样将调用嵌套为另一个方法的调用**，从而将多个消息调用组合在一个语句中。正确分配和初始化对象的方法是将alloc调用嵌套在init调用中，如下所示：

```objc
NSObject *newObject = [[NSObject alloc] init];
```

【终于出现了，这一串的含义】

此示例将newObject变量设置为指向一个新创建的NSObject实例。

首先执行最内部的调用，因此NSObject类将发送`alloc`消息，该消息**返回一个新分配的NSObject实例**。然后将返回的对象用作**init消息的接收者**，**init消息本身将对象返回以分配给newObject指针**，如下图所示。

![Nesting the alloc and init message](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/nestedallocinit.png)

```objc
请注意：使用init返回与alloc创建的对象不同的对象是可能的，
因此最佳的方法是上面所展示的嵌套调用。
如果不给初始化的对象分配指针，请不要初始化对象。例如，不要这样做：
NSObject *someObject = [NSObject alloc];
[someObject init];
如果init调用返回的是另一个对象，
那么你将会得到一个指向最初分配但没有初始化的对象的指针。
```

### Initializer Methods Can Take Arguments 初始化方法可以接受参数

有些对象需要使用所需的值进行初始化。例如，NSNumber对象必须使用它需要表示的数值创建。

NSNumber类定义了几个初始化方法，包括：

```objc
- (id)initWithBool:(BOOL)value;
- (id)initWithFloat:(float)value;
- (id)initWithInt:(int)value;
- (id)initWithLong:(long)value;
```

使用带有参数的初始化方法与普通的init方法是一样的，NSNumber对象是这样分配和初始化的：

```objc
NSNumber *magicNumber = [[NSNumber alloc] initWithInt:42];
```

### Class Factory Methods Are an Alternative to Allocation and Initialization 类工厂方法是用来创建对象的替代方法

如前一章所述，一个类还可以定义**工厂方法**`factory methods`。工厂方法提供了传统的`alloc] init]`过程的替代方法，这样无需嵌套两个方法。

NSNumber**类**定义了几个与其初始化方法相匹配的类工厂方法，包括：

```objc
+ (NSNumber *)numberWithBool:(BOOL)value;
+ (NSNumber *)numberWithFloat:(float)value;
+ (NSNumber *)numberWithInt:(int)value;
+ (NSNumber *)numberWithLong:(long)value;
```

工厂方法的使用方式如下:

```objc
  NSNumber *magicNumber = [NSNumber numberWithInt:42];
```

它的**效率**使用alloc和init来创建对象与之前的示例使用`alloc] initWithInt:]`是**相同**的。类工厂方法通常只是直接调用`alloc`和相关的`init`方法，提供了**便利性**。

### Use new to Create an Object If No Arguments Are Needed for Initialization **使用new来创建对象，如果不需要初始化参数**

还可以使用`new`这个类方法来创建类的实例。**这个方法由NSObject提供**【所以说它这个new和C++里的是两个东西】，不需要在你自己的子类中覆盖。

这实际上与不带参数调用`alloc`和`init`是相同的：

```objc
  XYZObject *object = [XYZObject new];
  // is effectively the same as:
  XYZObject *object = [[XYZObject alloc] init];
```

### Literals Offer a Concise Object-Creation Syntax **使用Literals提供简洁的对象创建语法**

一些类允许您使用更简洁的`Literal`语法来创建实例。【这个`Literals`我实在不知道怎么翻译了】

例如，您可以使用特殊的`literal`表示法来创建一个NSString实例，如下：

```objc
NSString *someString = @"Hello, World!";
```

这实际上与分配和初始化一个NSString（或使用其中一个类工厂方法）是相同的：

```objc
  NSString *someString = [NSString stringWithCString:"Hello, World!"
                                              encoding:NSUTF8StringEncoding];
```

NSNumber类还允许很多其他各种`literal`【发现了它们的特征都是带@】

```objc
    NSNumber *myBOOL = @YES;
    NSNumber *myFloat = @3.14f;
    NSNumber *myInt = @42;
    NSNumber *myLong = @42L;
```

同样，这些示例中的每一个都实际上等同于使用相关的初始化调用或类工厂方法。

您还可以使用包装表达式`boxed expression`创建NSNumber，如下所示：

```objc
NSNumber *myInt = @(84 / 2);
//在这种情况下，表达式会被分析，并创建一个带有结果的NSNumber实例。
```

Objective-C还支持使用`literals`来创建不可变的NSArray和NSDictionary对象；这些将在“数值和集合 [Values and Collections](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/FoundationTypesandCollections/FoundationTypesandCollections.html#//apple_ref/doc/uid/TP40011210-CH7-SW1)”中进一步讨论。

## Objective-C Is a Dynamic Language **Objective-C 是一种动态语言**

正如前面提到的，您需要使用指针来跟踪内存中的对象。由于Objective-C的动态特性，您**使用的指针的具体类类型并不重要**——当您发送消息时，相关对象上将始终调用正确的方法。

`id`类型定义了一个**通用对象指针**。在声明变量时使用`id`是可能的，但您会失去关于对象的编译时`*compile*-time `信息。

思考以下代码：

```objc
    id someObject = @"Hello, World!";
    [someObject removeAllObjects];
```

在这种情况下，`someObject`将指向一个NSString实例，但编译器对该实例一无所知，只知道它是某种类型的对象。`removeAllObjects`消息只由某些Cocoa或Cocoa Touch对象（例如NSMutableArray）定义，在这种情况下，编译器不会发出警告，但这段代码会在运行时生成异常，因为NSString对象无法响应`removeAllObjects`。

将代码重写为使用静态类型：

```objc
NSString *someObject = @"Hello, World!";
[someObject removeAllObjects];
```

在这种情况下编译器将会报错，因为它无法在任何公共NSString接口中找到removeAllObjects`声明。

因为**对象的类是在运行时确定的**，所以在创建或处理实例时，分配变量的类型是无关紧要的。要使用本章前面描述的XYZPerson和XYZShoutingPerson类，您可以使用以下代码：

```objc
XYZPerson *firstPerson = [[XYZPerson alloc] init];
XYZPerson *secondPerson = [[XYZShoutingPerson alloc] init];
[firstPerson sayHello];
[secondPerson sayHello];
```

尽管`firstPerson`和`secondPerson`都被静态类型化为XYZPerson对象，但`secondPerson`将在运行时指向XYZShoutingPerson对象。当在每个对象上调用`sayHello`方法时，都将使用逻辑上正确的实现；对于`secondPerson`，这意味着使用XYZShoutingPerson版本。

### Determining Equality of Objects **确定对象的相等性**

如果需要确定一个对象是否与另一个对象相同，重要的是要记住**你在使用指针**。

标准的C等号运算符`==`用于测试两个变量的值之间的相等性，就像这样：

```c
if (someInteger == 42) {
    // someInteger 的值为 42
}
```

在处理对象时，`==`运算符用于测试两个不同的指针是**否指向同一个对象**：

```objc
 if (firstPerson == secondPerson) {
        // firstPerson is the same object as secondPerson
  }
```

如果需要测试两个对象是否表示**相同的数据**，您需要调用`isEqual:`这样的方法，这是NSObject提供的：

```objc
    if ([firstPerson isEqual:secondPerson]) {
        // firstPerson is identical to secondPerson
    }
```

如果需要比较一个对象是否表示大于或小于另一个对象的值，您不能使用标准的C比较运算符`>`和`<`。相反，基本的Foundation类型，如NSNumber，NSString和NSDate，提供了一个`compare:`方法：

```objc
if ([someDate compare:anotherDate] == NSOrderedAscending) {
        // someDate is earlier than anotherDate
    }

```

### Working with nil **处理nil**

始终在声明时**初始化变量是一个好主意**，否则它们的初始值将包含来自当前栈中的垃圾：

```objc
    BOOL success = NO;
    int magicNumber = 42;
```

这对于**对象指针是不必要的**，因为如果您没有指定任何其他初始值，编译器会**自动**将变量设置为`nil`：

```objc
    XYZPerson *somePerson;
    // somePerson is automatically set to nil
```

如果没有其他值可用，`nil`值是初始化对象指针的最安全方式，因为在Objective-C中，向`nil`发送消息是完全可以接受的。如果向`nil`发送消息，显然什么都不会发生。

```
注意：如果您期望从发送到`nil`的消息中得到返回值，
对于对象返回类型，返回值将为`nil`，
对于数值类型，返回值将为0，
对于`BOOL`类型，返回值将为`NO`。
返回的结构具有所有成员初始化为零。
```

如果需要检查对象不是`nil`（即变量指向内存中的对象），您可以使用标准的C不等号运算符：

```objc
if (somePerson != nil) {
    // somePerson 指向一个对象
}
if (somePerson) {
    // somePerson 指向一个对象
}
//如果somePerson变量为nil，它的逻辑值为0（假）。如果它有一个地址，它不是零，因此计算为真。

//同样，如果需要检查是否为nil变量，可以使用等号运算符：
if (somePerson == nil) {
    // somePerson 不指向一个对象
}
 if (!somePerson) {
        // somePerson does not point to an object
}

```

