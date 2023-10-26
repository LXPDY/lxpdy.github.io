---
title: Working with Blocks 使用块

order: 6
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

# Working with Blocks 使用块

Objective-C类定义了一个将数据与相关行为结合在一起的对象。有时，只表示单个任务或行为单元比比一组方法更有意义。

Blocks是添加到C、Objective-C和C++的一种语言级特性，允许您创建可以像值一样给方法或函数传递不同代码段。**Blocks是Objective-C对象**，这意味着它们可以被添加到类似NSArray或NSDictionary的集合中。它们还**具有捕获来自封闭范围的值的能力**，使它们类似于其他编程语言中的闭包或lambda函数。

本章解释了声明和引用Blocks的语法，并展示了如何使用Blocks来简化诸如集合枚举等常见任务。有关更多信息，请参阅*[Blocks Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html#//apple_ref/doc/uid/TP40007502)*。

## Block Syntax Block语法

定义块字面上的语法使用的是插入符号（^），如下所示：

```objc
    ^{
         NSLog(@"This is a block");
    }
```

与函数和方法定义一样，大括号表示块的开始和结束。在这个示例中，该块不返回任何值，也不接受任何参数。

与使用函数指针引用C函数类似，您可以声明一个变量来跟踪一个块，如下所示：

```objc
void (^simpleBlock)(void);
```

如果您不习惯处理C函数指针，这个语法可能看起来有点不寻常。这个示例声明了一个名为simpleBlock的变量，用于引用一个不接受任何参数并且不返回值的块，这意味着该变量可以被赋予上面显示的块字面值，如下所示：

```objc
    simpleBlock = ^{
        NSLog(@"This is a block");
    };
```

这就像任何其他变量赋值一样，因此在右括号后必须用分号终止语句。您还可以将变量声明和赋值组合在一起：

```objc
void (^simpleBlock)(void) = ^{
        NSLog(@"This is a block");
    };
```

一旦声明并分配了一个块变量，您可以使用它来调用该块：

```
simpleBlock();
```

**注意：如果尝试使用未赋值的变量（nil块变量）调用块，您的应用程序将崩溃。**

### Blocks Can Capture Values from the Enclosing Scope 块可以像方法和函数一样接受参数并返回值

例如，考虑一个用于返回两个值相乘结果的块的变量：

```objc
 double (^multiplyTwoValues)(double, double);
```

相应的块字面值可能如下所示：

```objc
^ (double firstValue, double secondValue) {
    return firstValue * secondValue;
}
```

`firstValue` 和 `secondValue` 用于引用在调用块时提供的值，就像函数一样。在这个示例中**，返回类型是从块内的返回语句中推断出来的**。

如果您愿意，**您可以在插入符和参数列表之间明确指定返回类型**：

```objc
^ double (double firstValue, double secondValue) {
    return firstValue * secondValue;
}
```

一旦声明和定义了块，您可以像调用函数一样调用它：

```objc
double (^multiplyTwoValues)(double, double) =
                              ^(double firstValue, double secondValue) {
                                  return firstValue * secondValue;
                              };
 
    double result = multiplyTwoValues(2,4);
 
    NSLog(@"The result is %f", result);

```

### Blocks Can Capture Values from the Enclosing Scope 块可以捕获封闭作用域中的值

除了包含可执行代码，块还具有从其封闭作用域捕获状态的能力。

例如，如果您在一个方法中声明块字面值，就可以捕获该方法作用域内可访问的任何值，如下所示：

```objc
- (void)testMethod {
    int anInteger = 42;
 
    void (^testBlock)(void) = ^{
        NSLog(@"Integer is: %i", anInteger);
    };
 
    testBlock();
}
```

在这个示例中，`anInteger` 在块外部被声明，但在块在定义时捕获了该值。

除非另有规定，块只捕获值。这意味着如果您在定义块和调用块之间更改变量的外部值，如下所示：

```objc
    int anInteger = 42;
 
    void (^testBlock)(void) = ^{
        NSLog(@"Integer is: %i", anInteger);
    };
 
    anInteger = 84;
 
    testBlock();
```

**块捕获的值不受影响**。这意味着日志输出仍然会显示：

```objc
Integer is: 42
```

这还意味着**块无法更改原始变量的值，甚至无法更改捕获的值**（捕获的值会作为const变量）。

#### Use __block Variables to Share Storage 使用 __block 变量来共享存储

如果您需要能够在块内部**更改捕获变量的值**，**可以在原始变量声明上使用 __block 存储类型修饰符**。这意味着该变量存储在原始变量的词法作用域和在该作用域内声明的任何块之间共享的存储空间中。

例如，您可以像这样重新编写前面的示例：

```objc
__block int anInteger = 42;
 
    void (^testBlock)(void) = ^{
        NSLog(@"Integer is: %i", anInteger);
    };
 
    anInteger = 84;
 
    testBlock();
```

因为 `anInteger` 声明为 __block 变量，它的存储空间与块声明共享。这意味着现在日志输出将显示：

```objc
Integer is: 84
```

这还意味着块可以修改原始值，例如：

```objc
    __block int anInteger = 42;
 
    void (^testBlock)(void) = ^{
        NSLog(@"Integer is: %i", anInteger);
        anInteger = 100;
    };
 
    testBlock();
    NSLog(@"Value of original variable is now: %i", anInteger);
```

这次，输出将显示：

```objc
Integer is: 42
Value of original variable is now: 100
```

### You Can Pass Blocks as Arguments to Methods or Functions 您可以将块作为参数传递给方法或函数

本章的前几个示例都是在定义块后立即调用它们。在实践中，程序员通常会将块传递给函数或方法，以便在其他地方调用它。例如，您可以使用`Grand Central Dispatch`在后台调用块，或者定义一个块来表示将要被重复调用的任务，例如枚举集合。并发和枚举会在本章后面进行了介绍。

块还用于回调`callback`，**用于定义任务完成时要执行的代码**。例如，您的应用程序可能需要响应用户操作，创建一个执行复杂任务的对象，例如从Web服务请求信息。由于任务可能需要很长时间，因此在进行任务时应显示某种进度指示器，然后在任务完成后隐藏该指示器。

使用`delegation`也可以完成这个任务：您需要创建一个合适的`delegate protocol`，实现所需的方法，将对象设置为任务的`delegate`，然后等待它在任务完成后调用对象的`delegate`方法。

但是，块使这变得更加容易，因为您可以在启动任务时定义回调行为，如下所示：

```objc
- (IBAction)fetchRemoteInformation:(id)sender {
    [self showProgressIndicator];//显示进度显示器
 
    XYZWebTask *task = ...//任务
 
    [task beginTaskWithCallbackBlock:^{//开始任务并设置回调
        [self hideProgressIndicator];
    }];
}
```

此示例调用方法**显示进度指示器**，然后**创建任务并告诉它开始**。**回调块指定了任务完成后要执行的代码**；在这种情况下，它只是调用一个方法以隐藏进度指示器。请注意，**此回调块捕获了self，以便在调用时能够调用hideProgressIndicator方法**。**捕获self时要小心，因为很容易创建强引用循环**，如后面的“在捕获self时避免强引用循环 [Avoid Strong Reference Cycles when Capturing self](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithBlocks/WorkingwithBlocks.html#//apple_ref/doc/uid/TP40011210-CH8-SW16)”部分所述。

就代码可读性而言，块使您能够在一个地方清楚地看到在任务完成之前和之后将发生的事情，避免了需要跟踪`delegate `方法以查找将发生什么的步骤。

在本示例中所示的beginTaskWithCallbackBlock:方法的声明如下所示：

```objc
- (void)beginTaskWithCallbackBlock:(void (^)(void))callbackBlock;
```

`(void (^)(void))` 指定参数是一个不接受任何参数或返回任何值的块。方法的实现可以按通常的方式调用块：

```objective-c
- (void)beginTaskWithCallbackBlock:(void (^)(void))callbackBlock {
    ...
    callbackBlock();
}
```

希望参数为一个或多个参数的块的方法参数与块变量一样指定：

```objc
- (void)doSomethingWithBlock:(void (^)(double, double))block {
    ...
    block(21.0, 2.0);
}
```

#### A Block Should Always Be the Last Argument to a Method 块应该始终是方法的最后一个参数

最好就是在方法中**仅使用一个块参数**。如果方法还需要其他非块参数，那么块应该放在参数列表的最后：

```objc
- (void)beginTaskWithName:(NSString *)name completion:(void(^)(void))callback;
```

这样做可以使在**内联指定块时更容易阅读方法调用**，例如：

```objc
self beginTaskWithName:@"MyTask" completion:^{
        NSLog(@"The task is complete");
    }];
```

### Use Type Definitions to Simplify Block Syntax 使用类型定义简化块的语法

如果您需要定义具有相同签名的多个块，可以定义自己的类型名以表示指定的签名。

例如，您可以定义一个不带参数或返回值的简单块的类型，如下所示：

```objc
typedef void (^XYZSimpleBlock)(void);
```

然后，您可以在方法参数或创建块变量时使用您自定义的类型：

```objc
XYZSimpleBlock anotherBlock = ^{
    ...
};

- (void)beginFetchWithCallbackBlock:(XYZSimpleBlock)callbackBlock {
    ...
    callbackBlock();
}
```

自定义类型在**处理返回块或以其他块作为参数的块时特别有用**。考虑以下示例：

```objc
void (^(^complexBlock)(void (^)(void)))(void) = ^ (void (^aBlock)(void)) {
    ...
    return ^{
        ...
    };
};
```

【编程的本质是套娃又再度体现了】

complexBlock 变量引用了一个 **接受另一个块作为参数**（aBlock） **并返回另一个块的块**。

将代码重写为使用类型定义将使其更容易阅读：

```objc
XYZSimpleBlock (^betterBlock)(XYZSimpleBlock) = ^ (XYZSimpleBlock aBlock) {
    ...
    return ^{
        ...
    };
};
```

通过使用类型定义，您可以更清晰地表达块的签名和用途，提高代码的可读性。

### Objects Use Properties to Keep Track of Blocks 对象使用属性来跟踪块

定义用于跟踪块的属性的语法类似于块变量：

```objc
@interface XYZObject : NSObject
@property (copy) void (^blockProperty)(void);
@end
```

注意：您应该将 `copy` 作为`property attribute`来指定，**因为块需要被复制**，以便在原始范围之外跟踪其捕获的状态。在使用自动引用计数（ARC）时，您无需担心这一点，因为它将自动发生，但最佳做法是使用`property attribute`来显示所产生的行为。有关更多信息，请参阅“块编程主题 *[Blocks Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html#//apple_ref/doc/uid/TP40007502)*”。

块属性的设置或调用方式与任何其他块变量相似：

```objc
self.blockProperty = ^{
    ...
};
self.blockProperty();
```

还可以使用类型定义来声明块属性，如下所示：

```objc
typedef void (^XYZSimpleBlock)(void);
 
@interface XYZObject : NSObject
@property (copy) XYZSimpleBlock blockProperty;
@end
```

### Avoid Strong Reference Cycles when Capturing self 在捕获self时避免强循环引用

**如果您需要在块中捕获self**，比如在定义回调块时，重要的是考虑内存管理的影响。

**块会对任何被捕获的对象（包括self）保持强引用**，这意味着如果对象维护一个捕获self的块的副本属性，很容易出现强循环引用，例如：

```objc
@interface XYZBlockKeeper : NSObject
@property (copy) void (^block)(void);
@end

@implementation XYZBlockKeeper
- (void)configureBlock {
    self.block = ^{
        [self doSomething];    // 捕获了对self的强引用
                               // 创建了强引用循环
    };
}
...
@end
```

对于这种简单示例，编译器会发出警告，但更复杂的示例可能涉及多个对象之间的强引用创建的循环，这使得更难诊断问题。

为了避免这个问题，最好的办法是捕获对self的弱引用，如下所示：

```objc
- (void)configureBlock {
    XYZBlockKeeper * __weak weakSelf = self;
    self.block = ^{
        [weakSelf doSomething];   // capture the weak reference 捕获弱引用
                                  // to avoid the reference cycle
    }
}
```

通过捕获对self的弱指针，块将不会强引用对XYZBlockKeeper对象的强引用。**如果该对象在调用块之前被释放，weakSelf指针将被简单地设置为nil**。这有助于避免强引用循环问题。

## Blocks Can Simplify Enumeration 块可以简化枚举

【终于到了上一章就心心念念的部分】

除了一般的完全处理程序`completion handlers`，许多Cocoa和Cocoa Touch API使用块来简化常见任务，例如集合枚举。例如，NSArray类提供了三个基于块的方法，包括：

```objc
- (void)enumerateObjectsUsingBlock:(void (^)(id obj, NSUInteger idx, BOOL *stop))block;
```

此方法接受一个参数，即要**为数组中的每个项目调用的块**：

```objc
    NSArray *array = ...
    [array enumerateObjectsUsingBlock:^ (id obj, NSUInteger idx, BOOL *stop) {
        NSLog(@"Object at index %lu is %@", idx, obj);
        //NSLog(@"索引 %lu 的对象是 %@", idx, obj);
    }];
```

块本身接受三个参数，**前两个参数分别是当前对象和它在数组中的索引**。第三个参数是指向布尔变量的指针，**您可以使用它来停止枚举**，如下所示：

```objc
 [array enumerateObjectsUsingBlock:^ (id obj, NSUInteger idx, BOOL *stop) {
        if (...) {
            *stop = YES;
        }
    }];
```

您还可以通过使用 `enumerateObjectsWithOptions:usingBlock:` 方法来自定义枚举。例如，指定 `NSEnumerationReverse` 选项将以逆序遍历集合。

如果枚举块中的代码对处理器要求很高，并且可以安全地并发执行，您可以使用 `NSEnumerationConcurrent` 选项：

```objc
    [array enumerateObjectsWithOptions:NSEnumerationConcurrent
                            usingBlock:^ (id obj, NSUInteger idx, BOOL *stop) {
        ...
    }];
```

**此标志表示枚举块的调用可能会分布在多个线程之间**，如果块代码特别处理器密集，则可能会提供潜在性能提升。请注意，**使用此选项时，枚举顺序是不确定的**。

NSDictionary类也提供了基于块的方法，包括：

```objc
 		NSDictionary *dictionary = ...
    [dictionary enumerateKeysAndObjectsUsingBlock:^ (id key, id obj, BOOL *stop) {
        NSLog(@"key: %@, value: %@", key, obj);
    }];
```

这使得枚举每个键-值对更加方便，而不是使用传统的循环。

## Blocks Can Simplify Concurrent Tasks 块可以简化并发任务

块代表了一个独立的工作单元，将可执行代码与可能从周围范围捕获的状态结合在一起。这使它非常适合在OS X和iOS可用的并发选项之一中进行异步调用。与必须弄清楚如何使用低级机制（如线程）不同，您可以简单地使用块定义任务，然后让系统在处理器资源可用时执行这些任务。

OS X和iOS提供了各种并发技术，包括两种任务调度机制：操作队列`Operation queues`和Grand Central Dispatch。这些机制围绕着待调用任务队列的想法。您将块按照需要的顺序添加到队列中，系统在处理器时间和资源可用时会将它们出列以进行调用。

串行队列一次只允许一个任务执行 - 队列中的下一个任务在前一个任务完成之前不会被出列和调用。而并发队列会尽可能地调用尽可能多的任务，而不必等待前一个任务完成。

### Use Block Operations with Operation Queues 和操作队列一起使用块操作

操作队列是Cocoa和Cocoa Touch中用于任务调度的方法。**您可以创建一个NSOperation实例来封装一个工作单元以及任何必要的数据**，**然后将该操作添加到NSOperationQueue以供执行**。

虽然您可以创建自己的自定义NSOperation子类来实现复杂的任务，但也可以让NSBlockOperation使用块来创建操作，如下所示：

```objc
NSBlockOperation *operation = [NSBlockOperation blockOperationWithBlock:^{
    ...
}];
```

您当然可以手动执行操作（执行这个操作），但通常的做法是**将操作添加到现有操作队列或您自己创建的队列中**，以准备执行：

```objc
// schedule task on main queue:
NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
[mainQueue addOperation:operation];
 
// schedule task on background queue:
NSOperationQueue *queue = [[NSOperationQueue alloc] init];
[queue addOperation:operation];
```

如果使用操作队列，还可以配置操作之间的优先级或依赖关系，例如**指定一个操作应在一组其他操作完成之前不执行**。还可以**通过键-值观察来监视操作状态的变化**，**这使得在任务完成时更新进度指示器等操作变得容易**。

有关操作和操作队列的更多信息，请参阅「操作队列 [Operation Queues](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/OperationObjects/OperationObjects.html#//apple_ref/doc/uid/TP40008091-CH101)」。

### Schedule Blocks on Dispatch Queues with Grand Central Dispatch 使用GCD在调度队列上安排块

如果您需要为执行任意代码块进行排期，可以直接使用由Grand Central Dispatch（GCD）控制的调度队列。调度队列可以轻松地执行与调用者同步或异步相关的任务，**并按照先进先出的顺序执行这些任务**。

您可以创建自己的调度队列，也可以使用GCD自动提供的队列之一。如果需要为并发执行安排任务，可以通过使用`dispatch_get_global_queue()`函数获取对现有队列的引用并指定队列优先级，例如：

```objc
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
```

要将块分派到队列上，可以使用`dispatch_async()`或`dispatch_sync()`函数。`dispatch_async()`函数**立即返回**，而不等待块被调用：

```objc
dispatch_async(queue, ^{
    NSLog(@"Block for asynchronous execution");
    //NSLog(@"用于异步执行的块");
});
```

`dispatch_sync()`函数直到块执行完成前不会返回，比如说您可以在**需要并发块在主线程上等待另一个任务完成后才继续**的情况下使用它。

有关调度队列和GCD的更多信息，请参阅 [Dispatch Queues](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/OperationQueues/OperationQueues.html#//apple_ref/doc/uid/TP40008091-CH102)。

【好像学到了什么不得了的东西】