---
title: Conventions 约定

order: 9
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-26
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

# Conventions 约定

在使用框架类时，您会注意到Objective-C代码非常易于阅读【这算不算苹果自卖自夸】。类和方法的名称比通用C代码函数或C标准库中的名称要更具描述性，多个单词的名称使用驼峰命名法。当您编写自己的类时，应遵循Cocoa和Cocoa Touch使用的相同约定，以使您的代码更易阅读，无论是对您自己还是对可能需要使用您项目的其他Objective-C开发人员，以及使代码库保持一致。

此外，许多Objective-C和框架特性要求您遵循严格的命名约定，以确保各种机制能够正常工作。例如，为了与键-值编码（KVC ）或键-值观察（KVO）等技术一起使用，访问器方法的名称必须遵循约定。

本章涵盖了Cocoa和Cocoa Touch代码中使用的一些最常见的约定，并阐释了名称在整个应用项目（包括其链接的框架）中必须唯一的情况。

## Some Names Must Be Unique Across Your App 一些名称必须在整个应用程序中唯一

每当您创建新类型、符号或标识符时，您应首先考虑名称必须唯一的范围。有时，这个范围可能是整个应用程序（包括其链接的框架）；有时，范围仅限于封闭的类，甚至仅限于代码块。

### Class Names Must Be Unique Across an Entire App 类名必须在整个应用程序中唯一

Objective-C类名必须在您项目中编写的代码中具有唯一性，还必须在您可能包括的任何框架或捆绑包中具有唯一性。举例来说，您应该避免使用通用的类名，如ViewController或TextParser，因为您所包括在应用程序中的框架可能不遵循约定并创建具有相同名称的类。

为了保持类名的唯一性，约定是在所有类上使用前缀。您可能已经注意到，Cocoa和Cocoa Touch类名通常以NS或UI开头。这些两个字母的前缀由苹果保留，供框架类使用。当您更多地了解Cocoa和Cocoa Touch时，您将遇到与特定框架相关的各种其他前缀：

| Prefix | Framework                                            |
| :----- | :--------------------------------------------------- |
| `NS`   | Foundation (OS X and iOS) and Application Kit (OS X) |
| `UI`   | UIKit (iOS)                                          |
| `AB`   | Address Book                                         |
| `CA`   | Core Animation                                       |
| `CI`   | Core Image                                           |

**您自己的类应该使用三个字母的前缀**。这些前缀可能与您公司的名称和应用程序的名称的组合相关，或者与应用程序中的特定组件相关。例如，如果您的公司叫做Whispering Oak，而您正在开发一款名为Zebra Surprise的游戏，您可以选择WZS或WOZ作为您的类前缀。

您还应该为类命名使用一个名词，以清晰地表示类代表什么，就像Cocoa和Cocoa Touch中的这些示例一样：

| `NSWindow` | `CAAnimation` | `NSWindowController` | `NSManagedObjectContext` |
| ---------- | ------------- | -------------------- | ------------------------ |

如果类名需要由多个单词组成，应使用驼峰命名法，**即将每个后续单词的首字母大写**。

### Method Names Should Be Expressive and Unique Within a Class 方法名应具有表达力，并在类内部保持唯一

**一旦您为一个类选择了唯一的名称，您声明的方法只需在该类内部保持唯一**。通常情况下，可以在另一个类中使用与方法同名的名称，例如，要么覆盖超类方法，要么利用多态性。在多个类中执行相同任务的方法应具有相同的名称、返回类型和参数类型。

方法名没有前缀，**应以小写字母开头**；多个单词之间使用驼峰命名法，就像NSString类中的这些示例一样：

| `length` | `characterAtIndex:` | `lengthOfBytesUsingEncoding:` |
| -------- | ------------------- | ----------------------------- |

如果一个方法接受一个或多个参数，方法的名称应指示每个参数：

| `substringFromIndex:` | `writeToURL:atomically:encoding:error:` | `enumerateSubstringsInRange:options:usingBlock:` |
| --------------------- | --------------------------------------- | ------------------------------------------------ |

**方法名的第一部分应指示调用方法的主要意图或结果**。例如，如果一个方法返回一个值，第一个单词通常指示将返回什么，就像上面所示的length、character...和substring...方法。如果需要指示有关返回值的重要信息，可以使用多个单词，就像NSString类中的mutableCopy、capitalizedString或lastPathComponent方法一样。如果一个方法执行一个动作，比如写入磁盘或枚举内容，第一个单词应指示该动作，就像write...和enumerate...方法所示。

**如果一个方法包括一个错误指针参数，用于在发生错误时设置错误，这个参数应该是方法的最后一个参数**。如果一个方法接受一个块参数，**块参数应该是最后一个参数**，**以使任何方法调用在内联指定块时尽可能易于阅读**。出于同样的原因，最好尽量避免使用多个块参数的方法，如果可能的话。

此外，追求清晰但简洁的方法名也很重要。清晰并不一定意味着冗长，但简洁也不一定能实现清晰，因此最好追求一个折衷的平衡：

| `stringAfterFindingAndReplacingAllOccurrencesOfThisString:withThisString:` | 过于冗长 |
| ------------------------------------------------------------ | -------- |
| `strReplacingStr:str:`                                       | 过于简洁 |
| `stringByReplacingOccurrencesOfString:withString:`           | 恰到好处 |

在方法名中避免缩写单词，除非您确定该缩写在多种语言和文化中广泛已知。常见的缩写列表请参阅「可接受的缩写和首字母缩写 [Acceptable Abbreviations and Acronyms](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CodingGuidelines/Articles/APIAbbreviations.html#//apple_ref/doc/uid/20001285)」。

#### Always Use a Prefix for Method Names in Categories on Framework Classes 在对框架类进行分类以添加方法时，应始终使用方法名前缀

在为框架类的分类添加方法时，应始终使用方法名前缀，以避免冲突，如在「避免分类方法名称冲突 [Avoid Category Method Name Clashes](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html#//apple_ref/doc/uid/TP40011210-CH6-SW4)」中所述。

### Local Variables Must Be Unique Within The Same Scope 本地变量在相同范围内必须是唯一的

由于Objective-C是C语言的超集，因此C语言的变量作用域规则也适用于Objective-C。本地变量的名称不得与在相同范围内声明的任何其他变量冲突：

```objc
- (void)someMethod {
    int interestingNumber = 42;
    ...
    int interestingNumber = 44; // 不允许
}
```

虽然C语言允许您使用与封闭范围内已声明的变量相同的名称来声明新的本地变量，例如：

```objc
- (void)someMethod {
    int interestingNumber = 42;
    ...
    for (NSNumber *eachNumber in array) {
        int interestingNumber = [eachNumber intValue]; // 不建议
        ...
    }
}
```

但这会使代码变得混乱和难以阅读，**因此最好的做法是尽量避免这种情况。**

## Some Method Names Must Follow Conventions

除了考虑唯一性外，一些重要的方法类型还必须遵循严格的约定。这些约定被Objective-C的一些基础机制、编译器和Runtime系统所使用，同时也被Cocoa和Cocoa Touch中的类行为使用。

### Accessor Method Names Must Follow Conventions 访问器方法的名称必须遵循约定

当您使用@property语法在对象上声明属性，如在[封装数据](EncapsulatingData.md)中所述，编译器会自动生成相关的getter和setter方法（除非您另有指示）。如果由于某种原因需要提供自己的访问器方法实现，重要的是确保使用正确的属性方法名，以便通过点语法调用您的方法。

除非另有说明，getter方法应使用与属性相同的名称。对于名为firstName的属性，访问器方法也应该被命名为firstName。**这个规则的例外是布尔属性，其getter方法应该以is开头。例如，对于名为paused的属性，getter方法应该被命名为isPaused。**

属性的setter方法应该采用setPropertyName:的形式。对于名为firstName的属性，setter方法应该被命名为setFirstName:；对于名为paused的布尔属性，setter方法应该被命名为setPaused:。

虽然@property语法允许您指定不同的访问器方法名称，但应只在像布尔属性这样的情况下才这样做。遵循此处描述的约定非常重要，否则诸如键-值编码（使用valueForKey:和setValue:forKey:获取或设置属性的能力）之类的技术将无法正常工作。有关KVC的更多信息，请参阅Key-Value Coding编程指南 *[Key-Value Coding Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/index.html#//apple_ref/doc/uid/10000107i)*。【已经提到多少次KVC了】

### Object Creation Method Names Must Follow Conventions 对象创建方法的名称必须遵循约定

正如您在之前的章节中所看到的，通常有多种方法可以创建类的实例。您可以使用分配（allocation）和初始化（initialization）的组合，如下所示：

```objc
NSMutableArray *array = [[NSMutableArray alloc] init];
```

或者使用new便捷方法作为显式调用alloc和init的替代方法：

```objc
NSMutableArray *array = [NSMutableArray new];
```

某些类还提供类工厂方法：

```objc
NSMutableArray *array = [NSMutableArray array];
```

类工厂方法应始终以它们所创建的类的名称（不包括前缀）开头，但对于已存在工厂方法的类的子类有一个例外。例如，对于NSArray类，工厂方法以array开头。NSMutableArray类不定义其自己的类特定工厂方法，因此可变数组的工厂方法仍以array开头。

Objective-C底层有各种内存管理规则，编译器使用这些规则以确保对象在必要时保持有效。尽管通常您无需过多担心这些规则，但编译器根据创建方法的名称来判断应遵循哪个规则。通过工厂方法创建的对象与通过传统分配和初始化或new创建的对象略有不同，这是由于autorelease池块的使用。有关autorelease池块和内存管理的更多信息，请参阅《高级内存管理编程指南 *[Advanced Memory Management Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/MemoryMgmt.html#//apple_ref/doc/uid/10000011i)*》。



完结撒花～
