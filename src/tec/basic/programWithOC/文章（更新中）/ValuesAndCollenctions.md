---
title: Values and Collections 值和集合

order: 5
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

# Values and Collections 值和集合

尽管Objective-C是一种面向对象的编程语言，但它是C语言的超集，这意味着你可以在Objective-C代码中使用标准的C标量`*scalar*`（非对象）类型，如int、float和char。在Cocoa和Cocoa Touch应用程序中还有其他标量类型可用，如NSInteger、NSUInteger和CGFloat，这些类型根据目标架构的不同有不同的定义。

标量类型用于在不需要使用对象来表示值的情况下。虽然字符串通常表示为NSString类的实例，但数值通常存储在标量本地变量或属性中。

你可以在Objective-C中声明C样式数组，但在Cocoa和Cocoa Touch应用程序中，**集合通常是用类的实例来表示**，比如NSArray或NSDictionary。这些类只能用来收集Objective-C对象，这意味着在将值添加到集合之前，你需要创建类的实例，比如NSValue、NSNumber或NSString。

本指南中的前几章经常使用NSString类及其初始化和类工厂方法，以及Objective-C的`@"string"``literal`，它提供了一种简洁的语法来创建NSString实例。本章将解释如何创建NSValue和NSNumber对象，可以通过方法调用或通过Objective-C值`literal`语法进行。

## Basic C Primitive Types Are Available in Objective-C

Objective-C中可用基本的C标量类型

标准的C标量变量类型在Objective-C中都是可用的：

```objc
int someInteger = 42;
float someFloatingPointNumber = 3.1415;
double someDoublePrecisionFloatingPointNumber = 6.02214199e23;
```

还有标准的C运算符：

```objc
    int someInteger = 42;
    someInteger++;            // someInteger == 43
 
    int anotherInteger = 64;
    anotherInteger--;         // anotherInteger == 63
 
    anotherInteger *= 2;      // anotherInteger == 126
```

如果你在Objective-C属性中使用标量类型，像这样：

```objc
@interface XYZCalculator : NSObject
@property double currentValue;
@end
```

那么当通过点语法访问该属性的值时，也可以使用C运算符，如下所示：

```objc
@implementation XYZCalculator
- (void)increment {
    self.currentValue++;
}
- (void)decrement {
    self.currentValue--;
}
- (void)multiplyBy:(double)factor {
    self.currentValue *= factor;
}
@end
```

点语法只是对访问器方法调用的语法包装，因此在这个示例中的每个操作都等同于首先使用获取访问器方法来获取值，然后执行操作，然后使用设置访问器方法来将值设置为结果。

### Objective-C Defines Additional Primitive Types Objective-C定义了额外的标量类型

Objective-C中定义了`BOOL`标量类型，用于保存布尔值，它要么是`YES`（真）要么是`NO`（假）。正如你所预期的，YES在逻辑上等价于true和1，而NO等价于false和0。

Cocoa和Cocoa Touch对象的许多方法的参数也使用特殊的标量数值类型，如NSInteger或CGFloat。

例如，NSTableViewDataSource和UITableViewDataSource协议（在上一章中描述）都有请求要显示的行数的方法：

```objc
@protocol NSTableViewDataSource <NSObject>
- (NSInteger)numberOfRowsInTableView:(NSTableView *)tableView;
...
@end
```

这些类型，如NSInteger和NSUInteger，根据目标架构的不同而有不同的定义。在构建32位环境（比如iOS）时，它们分别是32位的有符号和无符号整数；在构建64位环境（比如现代的OS X运行时）时，它们分别是64位的有符号和无符号整数。

最佳实践是在跨越API边界传递值时（包括内部和导出的API），例如在应用程序代码和框架之间的方法或函数调用的参数或返回值中，**使用这些特定于平台的类型**。【意思就是跨平台的框架可以用这些平台自适应的变量来写】

对于局部变量，比如循环中的计数器，如果你知道值在标准限制内，使用基本的C类型是可以的。

### C Structures Can Hold Primitive Values C结构体可以保存原始值

一些Cocoa和Cocoa Touch API使用C结构体来保存它们的值。举个例子，可以请求字符串对象的子字符串范围，如下所示：

```objc
NSString *mainString = @"This is a long string";
NSRange substringRange = [mainString rangeOfString:@"long"];
```

**一个NSRange结构保存了位置和长度**。在这种情况下，substringRange将保存一个范围{10,4} - @"long"开头的 "l" 是mainString中基于零的索引10处的字符，@"long"的长度为4个字符。

类似地，如果你需要编写自定义绘图代码，你需要与Quartz互动，Quartz要求以CGFloat数据类型为基础的结构，如OS X上的NSPoint和NSSize以及iOS上的CGPoint和CGSize。同样，CGFloat根据目标架构的不同而有不同的定义。

有关Quartz 2D绘图引擎的更多信息，请参阅Quartz 2D编程指南*[Quartz 2D Programming Guide](https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/Introduction/Introduction.html#//apple_ref/doc/uid/TP30001066)*。

## Objects Can Represent Primitive Values 对象可以表示原始值

如果你需要将标量值表示为对象，比如在使用下一节中描述的集合类时，你可以使用Cocoa和Cocoa Touch提供的基本值类。

字符串由NSString类的实例表示，正如你在前几章中所看到的，NSString用于表示一串字符，如 Hello World。有各种方式可以创建NSString对象，包括标准的分配和初始化、类工厂方法或`literal`语法：

```objc
NSString *firstString = [[NSString alloc] initWithCString:"Hello World!"
                                                 encoding:NSUTF8StringEncoding];
NSString *secondString = [NSString stringWithCString:"Hello World!"
                                            encoding:NSUTF8StringEncoding];
NSString *thirdString = @"Hello World!";
```

这些示例中的每一个都有效地完成了相同的事情，即创建一个表示提供的字符的字符串对象。

基本的NSString类是不可变的，这意味着它的内容在创建时设置，不能后来更改。如果你需要表示不同的字符串，你必须创建一个新的字符串对象，像这样：

```objc
NSString *name = @"John";
name = [name stringByAppendingString:@"ny"];    // 返回一个新的字符串对象
```

NSMutableString类是NSString的可变子类，允许你在运行时使用方法如appendString:或appendFormat:更改它的字符内容，像这样：

```objc
NSMutableString *name = [NSMutableString stringWithString:@"John"];
[name appendString:@"ny"];   // 相同的对象，但现在表示"Johnny"
```

#### Format Strings Are Used to Build Strings from Other Objects or Values 格式字符串用于从其他对象或值构建字符串

如果你需要构建包含变量值的字符串，你需要使用格式字符串。这允许你使用格式说明符来指示如何插入值：

```objc
int magicNumber = ...
NSString *magicString = [NSString stringWithFormat:@"The magic number is %i", magicNumber];
```

可用的格式说明符在[String Format Specifiers](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265)中描述。有关字符串的大致信息，请参阅*[String Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/introStrings.html#//apple_ref/doc/uid/10000035i)*。

### Numbers Are Represented by Instances of the NSNumber Class 数字由NSNumber类的实例表示

NSNumber类用于表示任何基本的C标量类型，包括`char、double、float、int、long、short`以及每个无符号变体，以及Objective-C的布尔类型BOOL。

与NSString一样，你有多种选项来创建NSNumber实例，包括分配和初始化或类工厂方法：

```objc
NSNumber *magicNumber = [[NSNumber alloc] initWithInt:42];
NSNumber *unsignedNumber = [[NSNumber alloc] initWithUnsignedInt:42u];
NSNumber *longNumber = [[NSNumber alloc] initWithLong:42l];

NSNumber *boolNumber = [[NSNumber alloc] initWithBOOL:YES];

NSNumber *simpleFloat = [NSNumber numberWithFloat:3.14f];
NSNumber *betterDouble = [NSNumber numberWithDouble:3.1415926535];

NSNumber *someChar = [NSNumber numberWithChar:'T'];
```

还可以使用Objective-C字面语法创建NSNumber实例：

```objc
NSNumber *magicNumber = @42;
NSNumber *unsignedNumber = @42u;
NSNumber *longNumber = @42l;

NSNumber *boolNumber = @YES;

NSNumber *simpleFloat = @3.14f;
NSNumber *betterDouble = @3.1415926535;

NSNumber *someChar = @'T';
```

这些示例等同于使用NSNumber类的类工厂方法。

创建了NSNumber实例后，可以使用其中一个访问器方法请求标量值：

```objc
int scalarMagic = [magicNumber intValue];
unsigned int scalarUnsigned = [unsignedNumber unsignedIntValue];
long scalarLong = [longNumber longValue];

BOOL scalarBool = [boolNumber boolValue];

float scalarSimpleFloat = [simpleFloat floatValue];
double scalarBetterDouble = [betterDouble doubleValue];

char scalarChar = [someChar charValue];
```

NSNumber类还提供了用于处理其他Objective-C原始类型的方法。如果你需要创建标量NSInteger和NSUInteger类型的对象表示，确保使用正确的方法：

```
NSInteger anInteger = 64;
NSUInteger anUnsignedInteger = 100;

NSNumber *firstInteger = [[NSNumber alloc] initWithInteger:anInteger];
NSNumber *secondInteger = [NSNumber numberWithUnsignedInteger:anUnsignedInteger];

NSInteger integerCheck = [firstInteger integerValue];
NSUInteger unsignedCheck = [secondInteger unsignedIntegerValue];
```

所有NSNumber实例都是不可变的，没有可变的子类；如果你需要不同的数字，只需使用另一个NSNumber实例。

注意：**NSNumber实际上是一个类群（class cluster）。这意味着在运行时创建一个实例时，你将得到一个合适的具体子类来保存提供的值。只需将创建的对象视为NSNumber的实例即可**。【一句话不得了地提了它的实现原理啊】

## Most Collections Are Objects 使用NSValue类的实例表示其他值

NSNumber类本身是基本NSValue类的子类，它提供了一个对象包装器，用于包装单个值或数据项。除了基本的C标量类型，NSValue还可以用于表示指针和结构。

NSValue类提供了各种工厂方法，用于创建具有给定标准结构的值，这使得创建一个实例来表示(例如一个NSRange)很容易，就像本章前面的示例一样：

```objc
NSString *mainString = @"This is a long string";
NSRange substringRange = [mainString rangeOfString:@"long"];
NSValue *rangeValue = [NSValue valueWithRange:substringRange];
```

可以创建NSValue对象来表示自定义结构。如果你有特定的需要，需要使用C结构体（而不是Objective-C对象）来存储信息，就像这样：

```objc
typedef struct {
    int i;
    float f;
} MyIntegerFloatStruct;
```

你可以通过提供结构的指针以及编码的Objective-C类型来创建一个NSValue实例。@encode()编译指令用于创建正确的Objective-C类型，就像这样：

```objc
struct MyIntegerFloatStruct aStruct;
aStruct.i = 42;
aStruct.f = 3.14;

NSValue *structValue = [NSValue value:&aStruct
                         withObjCType:@encode(MyIntegerFloatStruct)];
```

标准的C引用运算符(&)用于为value参数提供aStruct的地址。【神奇】

## Most Collections Are Objects 大多数集合都是对象

虽然可以使用C数组来保存标量值的集合，甚至对象指针的集合，但Objective-C代码中的大多数集合都是Cocoa和Cocoa Touch集合类的实例，比如NSArray、NSSet和NSDictionary。

这些类用于管理对象组，这意味着您希望添加到集合中的任何项都必须是Objective-C类的实例。如果需要添加标量值，您必须首先创建一个合适的NSNumber或NSValue实例来表示它。

与以某种方式维护每个收集对象的单独副本不同，集合类使用强引用来跟踪它们的内容。这意味着您添加到集合的任何对象将至少在集合存在的时间内保持活动，如在《通过拥有和责任来管理对象图 [Manage the Object Graph through Ownership and Responsibility](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW3)》中所述。

除了跟踪它们的内容，每个Cocoa和Cocoa Touch集合类都可以轻松执行某些任务，比如枚举、访问特定项，或查找特定对象是否是集合的一部分。

基本的NSArray、NSSet和NSDictionary类**都是不可变的**，这意味着它们的内容在创建时设置。**每个类还有一个可变子类，允许您随意添加或删除对象**。

有关Cocoa和Cocoa Touch中可用的不同集合类的更多信息，请参阅《*[Collections Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Collections/Collections.html#//apple_ref/doc/uid/10000034i)* 集合编程主题》。

### Arrays Are Ordered Collections 数组是有序集合

NSArray用于表示对象的有序集合。**唯一的要求是每个项目都是Objective-C对象**【可怕的容器特性】，没有要求每个对象都是相同类的实例。

为了在数组中保持顺序，每个元素都存储在以零为基数的索引处，如下图所示。

![An Array of Objective-C Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/orderedarrayofobjects.png)

#### Creating Arrays 创建数组

与本章前面描述的值类一样，您可以通过**分配和初始化、类工厂方法或literal语法**来创建数组。

根据对象数量，提供了各种不同的初始化和工厂方法：

```objc
+ (id)arrayWithObject:(id)anObject;
+ (id)arrayWithObjects:(id)firstObject, ...;
- (id)initWithObjects:(id)firstObject, ...;
```

arrayWithObjects:和initWithObjects:方法**都接受以nil结尾的可变数量的参数**，这意味着您**必须包括nil作为最后一个值**，像这样：

```objc
NSArray *someArray =
  [NSArray arrayWithObjects:someObject, someString, someNumber, someValue, nil];
```

这个示例创建了一个像上图中所示的数组。第一个对象，someObject，将具有索引0；最后一个对象，someValue，将具有索引3。

如果提供的值中有一个是nil，可能会意外地截断项目列表，就像这样：

```objc
id firstObject = @"someString";
id secondObject = nil;
id thirdObject = @"anotherString";
NSArray *someArray =
[NSArray arrayWithObjects:firstObject, secondObject, thirdObject, nil];
```

在这种情况下，someArray只包含firstObject，因为nil secondObject将被解释为项目列表的结尾。

##### Literal Syntax Literal 语法

还可以使用Objective-C Literal语法创建数组，就像这样：

```objc
NSArray *someArray = @[firstObject, secondObject, thirdObject];
```

**在使用这种文字语法时，不应该用nil来终止对象列表**，事实上nil是一个无效值。例如，如果尝试执行以下代码，将在运行时引发异常：

```objc
id firstObject = @"someString";
id secondObject = nil;
NSArray *someArray = @[firstObject, secondObject];
// 异常："尝试插入nil对象"
```

如果确实需要在其中一个集合类中表示nil值，应该使用NSNull单例类，如在“使用NSNull表示nil [Represent nil with NSNull](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/FoundationTypesandCollections/FoundationTypesandCollections.html#//apple_ref/doc/uid/TP40011210-CH7-SW34)”中所述。

#### Querying Array Objects 查询数组对象

创建数组后，您可以查询它以获取诸如对象数量或它是否包含特定项等信息：

```objc
NSUInteger numberOfItems = [someArray count];

if ([someArray containsObject:someString]) {
    ...
}
```

您还可以查询数组以获取给定索引处的项目。如果尝试请求无效的索引，将在运行时获得越界异常，因此应始终首先检查项目数：

```objc
if ([someArray count] > 0) {
    NSLog(@"First item is: %@", [someArray objectAtIndex:0]);
}
```

这个示例检查项目数是否大于零。如果是，它会记录第一个项目的描述，该项目的索引为零。

##### Subscripting 子脚本

还有一个使用下标语法的替代方法，就像访问标准的C数组中的值一样。前面的示例可以像这样重写：

```objc
if ([someArray count] > 0) {
    NSLog(@"First item is: %@", someArray[0]);
}
```

这样的语法更简洁，更容易理解，用于访问数组中的元素。

#### Sorting Array Objects 为数组元素排序

NSArray类还提供了各种方法来对其收集的对象进行排序。**由于NSArray是不可变的，因此每个这些方法都返回一个包含以排序顺序排列的项目的新数组**。

例如，您可以按调用每个字符串上的compare:的结果对字符串数组进行排序，如下所示：

```objc
    NSArray *unsortedStrings = @[@"gammaString", @"alphaString", @"betaString"];
    NSArray *sortedStrings =
                 [unsortedStrings sortedArrayUsingSelector:@selector(compare:)];

```

#### Mutability 可变性

尽管NSArray类本身是不可变的，但这不会影响任何收集的对象。如果您将可变字符串添加到不可变数组中，例如：

```objc
NSMutableString *mutableString = [NSMutableString stringWithString:@"Hello"];
NSArray *immutableArray = @[mutableString];
```

这不会阻止您更改字符串：

```objc
    if ([immutableArray count] > 0) {
        id string = immutableArray[0];
        if ([string isKindOfClass:[NSMutableString class]]) {
            [string appendString:@" World!"];
        }
    }
```

如果您需要在初始创建后能够添加或删除数组中的对象，您需要使用NSMutableArray，它提供了各种方法来添加、删除或替换一个或多个对象：

```objc
    NSMutableArray *mutableArray = [NSMutableArray array];
    [mutableArray addObject:@"gamma"];
    [mutableArray addObject:@"alpha"];
    [mutableArray addObject:@"beta"];
 
    [mutableArray replaceObjectAtIndex:0 withObject:@"epsilon"];
```

这个示例创建了一个数组，最终包含对象@"epsilon"、@"alpha"和@"beta"。

还可以就地对可变数组进行排序，而不创建次要数组：

```objc
 [mutableArray sortUsingSelector:@selector(caseInsensitiveCompare:)];
```

在这种情况下，包含的项目将按照不区分大小写的升序排列 `@"alpha"`, `@"beta"`, `@"epsilon"`.

### Sets Are Unordered Collections set是无序的集合

NSSet类似于数组，但它维护一个无序的不同对象的组，如下图所示。

![A Set of Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/unorderedsetofobjects.png)

因为集合不维护顺序，所以在测试`membership`时【也就是查找性能】，它们相对于数组提供了性能改进。

基本的NSSet类是不可变的，所以它的内容必须在创建时指定，可以使用分配和初始化或类工厂方法，如下所示：

```objc
NSSet *simpleSet =
      [NSSet setWithObjects:@"Hello, World!", @42, aValue, anObject, nil];
```

与NSArray一样，initWithObjects:和setWithObjects:方法都接受以nil结尾的可变参数。可变NSSet子类是NSMutableSet。

**集合只存储对单个对象的一个引用**，即使您尝试多次添加一个对象：

```objc
NSNumber *number = @42;
    NSSet *numberSet =
      [NSSet setWithObjects:number, number, number, number, nil];
    // numberSet only contains one object
```

更多信息详见 [Sets: Unordered Collections of Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Collections/Articles/Sets.html#//apple_ref/doc/uid/20000136).

### Dictionaries Collect Key-Value Pairs 字典收集键-值对

与仅维护一组有序或无序的对象不同，NSDictionary 存储对象与指定的键`key`关联，然后可以用于检索。

最佳实例就是使用字符串对象作为字典的键，如下图所示。

![A Dictionary of Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Art/dictionaryofobjects.png)

注意：**可以使用其他对象作为键，但需要注意的是，字典会复制每个键以供使用，因此作为key的对象必须支持 NSCopying**。

然而，如果您希望能够使用键值编码（Key-Value Coding），如《*[Key-Value Coding Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107i)* 键值编码编程指南》中所描述，那么必须使用字符串键来表示字典对象。

#### Creating Dictionaries 创建字典

你可以使用分配和初始化，或者类工厂方法来创建字典，如下所示：

```objc
NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
               someObject, @"anObject",
         @"Hello, World!", @"helloString",
                      @42, @"magicNumber",
                someValue, @"aValue",
                         nil];

```

请注意，对于 `dictionaryWithObjectsAndKeys:` 和 `initWithObjectsAndKeys:` 方法，**每个对象在其键之前指定**，而且对象和键的列表必须以 nil 结束。

##### Literal Syntax Literal 语法

Objective-C 也提供了用于创建字典的Literal语法，如下所示：

```objc
NSDictionary *dictionary = @{
              @"anObject" : someObject,
           @"helloString" : @"Hello, World!",
           @"magicNumber" : @42,
                @"aValue" : someValue
};
```

请注意，对于字典字面语法，键在其对象之前指定，而且不需要以 nil 结束。

#### Querying Dictionaries 查询字典

一旦你创建了一个字典，你可以使用如下方式查询存储在给定键下的对象：

```objc
NSNumber *storedNumber = [dictionary objectForKey:@"magicNumber"];
```

如果未找到该对象，`objectForKey:` 方法将返回 nil。

还有一种使用下标语法来代替 `objectForKey:` 的查询方法，如下所示：

```objc
NSNumber *storedNumber = dictionary[@"magicNumber"];
```

#### Mutability 可变性

如果你需要在创建后向字典中添加或移除对象，你需要使用 `NSMutableDictionary` 子类，如下所示：

```objc
[dictionary setObject:@"another string" forKey:@"secondString"];
[dictionary removeObjectForKey:@"anObject"];
```

### Represent nil with NSNull 用 NSNull 表示 nil

在本节描述的这些集合类中，无法将 nil 添加到集合中，因为在 Objective-C 中，nil 表示“没有对象”。如果你需要在集合中表示“没有对象”，你可以使用 NSNull 类：

```objc
NSArray *array = @[ @"string", @42, [NSNull null] ];
```

NSNull 是一个单例类，这意味着 null 方法始终会返回相同的实例。这**意味着你可以检查数组中的对象是否等于共享的 NSNull 实例**：

```objc
for (id object in array) {
    if (object == [NSNull null]) {
        NSLog(@"Found a null object");
    }
}
```

## Use Collections to Persist Your Object Graph 使用集合来持久化对象图

NSArray 和 NSDictionary 类使将它们的内容直接写入磁盘变得很容易，如下所示：

```objc
NSURL *fileURL = ...;
NSArray *array = @[@"first", @"second", @"third"];

BOOL success = [array writeToURL:fileURL atomically:YES];
if (!success) {
    // an error occured...
}
```

如果每个包含的对象都是属性列表类型（NSArray、NSDictionary、NSString、NSData、NSDate 和 NSNumber），**则可以从磁盘重新创建整个层次结构**，如下所示：

```objc
NSURL *fileURL = ...;
NSArray *array = [NSArray arrayWithContentsOfURL:fileURL];
if (!array) {
    // an error occurred...
}
```

有关属性列表的更多信息，请参阅《属性列表编程指南 *[Property List Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/PropertyLists/Introduction/Introduction.html#//apple_ref/doc/uid/10000048i)*》。

**如果你需要持久化除上述标准属性列表类之外的其他类型的对象，可以使用一个归档器对象**，比如 NSKeyedArchiver，来创建一个包含收集的对象的归档文件。

创建归档文件的**唯一要求是每个对象必须支持 NSCoding 协议**。这意味着每个对象必须知道如何将自己编码到归档文件中（通过实现 encodeWithCoder: 方法），并在从现有归档文件中读取时解码自己（通过 initWithCoder: 方法）。

NSArray、NSSet 和 NSDictionary 类及其可变子类都支持 NSCoding，这意味着你可以使用归档器来持久化包含对象的复杂层次结构。如果使用界面生成器（Interface Builder）来布局窗口和视图，那么生成的 nib 文件只是你通过可视化方式创建的对象层次结构的归档文件。在运行时，nib 文件会使用相关的类解档为对象层次结构。

有关归档的更多信息，请参阅《归档和序列化编程指南 *[Archives and Serializations Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Archiving/Archiving.html#//apple_ref/doc/uid/10000047i)*》。

## Use the Most Efficient Collection Enumeration Techniques 使用最高效的集合枚举技术

Objective-C和Cocoa或Cocoa Touch提供了各种枚举集合内容的方法。虽然可以使用传统的C for循环来遍历集合的内容，就像这样：

```objc
int count = [array count];
for (int index = 0; index < count; index++) {
    id eachObject = [array objectAtIndex:index];
    ...
}
```

但最好的方法是使用本节中描述的一项技术。

### Fast Enumeration Makes It Easy to Enumerate a Collection 快速枚举使枚举集合变得容易

许多集合类都符合NSFastEnumeration协议，包括NSArray、NSSet和NSDictionary。这意味着你可以使用快速枚举，这是Objective-C语言级别的特性。

**用于枚举数组或集合内容的快速枚举语法如下**：

```objc
    for (<Type> <variable> in <collection>) {
        ...
    }
```

举个例子，你可以使用快速枚举来记录数组中每个对象的描述，就像这样：

```objc
for (id eachObject in array) {
    NSLog(@"对象：%@", eachObject);
}
```

每次循环都会自动将eachObject变量设置为当前对象，因此每个对象都会生成一条日志记录。

如果你使用快速枚举与字典一起，**你会遍历字典的键**，就像这样：

```objc
    for (NSString *eachKey in dictionary) {
        id object = dictionary[eachKey];
        NSLog(@"Object: %@ for key: %@", object, eachKey);
    }
```

快速枚举的行为类似于标准的C for循环，因此你可以使用`break`关键字来中断迭代，或使用`continue`继续到下一个元素。

如果你正在枚举一个有序集合，枚举将按照该顺序进行。对于NSArray，这意味着第一次迭代将是索引为0的对象，第二次是索引为1的对象，依此类推。如果你需要跟踪当前索引，只需在发生迭代时计数即可：

```objc
int index = 0;
for (id eachObject in array) {
    NSLog(@"索引为 %i 的对象是：%@", index, eachObject);
    index++;
}
```

**在快速枚举期间，即使集合是可变的，你也不能对集合进行修改**。**如果你尝试在循环内部添加或移除集合对象，将会生成运行时异常。**【可惜了】

### Most Collections Also Support Enumerator Objects 大多数集合也支持枚举器对象

在Cocoa和Cocoa Touch中，**你还可以使用NSEnumerator对象来枚举许多集合**。

例如，你可以向NSArray请求一个`objectEnumerator`或`reverseObjectEnumerator`。你可以将这些对象与快速枚举一起使用，就像这样：

```objc
for (id eachObject in [array reverseObjectEnumerator]) {
    ...
}
```

在这个示例中，循环将按照相反的顺序迭代收集的对象，因此最后一个对象将首先出现，依此类推。

你还可以通过多次调用枚举器的`nextObject`方法来迭代内容，就像这样：

```objective-c
id eachObject;
while ( (eachObject = [enumerator nextObject]) ) {
    NSLog(@"当前对象是：%@", eachObject);
}
```

在这个示例中，使用while循环将`eachObject`变量设置为每次循环的下一个对象。当没有更多的对象时，`nextObject`方法将返回nil，这会被视为逻辑值false，从而停止循环。

- 注意：因为在条件分支或循环中设置变量时，常见的编程错误是使用C赋值运算符（=），而实际上你可能意图使用相等运算符（==），所以编译器会在这种情况下发出警告：

```objc
if (someVariable = YES) {
    ...
}
```

- 如果你真的打算重新分配一个变量（整个赋值的逻辑值是左边最终值），你可以通过将赋值括在括号中来表示这一点，就像这样：

```objc
if ( (someVariable = YES) ) {
    ...
}
```

与快速枚举一样，**在枚举过程中不能对集合进行修改**。此外，字面上意思，使用快速枚举要比手动使用枚举器对象更快。

### Many Collections Support Block-Based Enumeration 许多集合支持基于块的枚举

你还可以使用块`block`来枚举NSArray、NSSet和NSDictionary。关于块的详细内容将在下一章中介绍。