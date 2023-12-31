---
title: Dealing with Errors 处理错误

order: 7
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

# Dealing with Errors 处理错误

几乎每个应用程序都会遇到错误。其中有一些错误可能会超出您的控制，比如磁盘空间耗尽或丢失网络连接。而其中一些错误是可恢复的，比如无效的用户输入。虽然所有开发者都追求完美，但偶尔也可能会发生程序员错误`programmer error`。

如果您来自其他平台和编程语言，您可能习惯于在大多数错误处理情况下使用异常`exceptions`。但在使用Objective-C编写代码时，**异常仅用于处理程序员错误**，例如超出数组范围的访问或无效的方法参数。**这些问题应在发布应用之前在测试期间找到并修复**。

所有其他错误都由NSError类的实例表示。本章简要介绍了如何使用NSError对象，包括如何处理可能的失败并返回错误`errors`的框架方法。有关更多信息，请参阅「错误处理编程指南 *[Error Handling Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ErrorHandlingCocoa/ErrorHandling/ErrorHandling.html#//apple_ref/doc/uid/TP40001806)*」。

## Use NSError for Most Errors 对于大多数错误使用NSError

错误是任何应用程序生命周期中不可避免的一部分。如果您需要从远程网络服务请求数据，例如，可能会出现各种潜在问题，包括：

- 没有网络连接
- 无法访问远程网络服务
- 远程网络服务可能无法提供您请求的信息
- 程序接收到的数据可能与预期的不符

不幸的是，程序员不可能为每种可想象的问题制定备用计划和解决方案。取而代之，您必须计划处理错误，并知道如何处理它们，以提供尽可能好的用户体验。

### Some Delegate Methods Alert You to Errors 某些Delegate方法会提醒您错误

如果您正在实现一个`delegate object`，用于与执行特定任务的框架类一起使用，比如从远程网络服务下载信息，通常需要实现至少一个与错误相关的方法。例如，NSURLConnectionDelegate**协议**包括一个connection:didFailWithError:方法：

```objc
- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error;
```

如果发生错误，将调用这个delegate方法，**以提供一个NSError对象来描述问题**。

NSError对象包含一个数字错误代码` error code`、域`domain`和描述`description`，以及打包在用户信息字典中的其他相关信息。

与其要求每个可能的错误都具有唯一的数字代码，Cocoa和Cocoa Touch错误被分为不同的域。例如，如果在NSURLConnection中发生错误，上面的connection:didFailWithError:方法将提供一个来自NSURLErrorDomain的错误。

错误对象还包括本地化描述，例如“找不到具有指定主机名的服务器”。

### Some Methods Pass Errors by Reference 一些方法通过引用传递错误

一些Cocoa和Cocoa Touch API通过引用`reference`返回错误。例如，您可能决定通过将数据写入磁盘来存储从网络服务接收到的数据，使用NSData的`writeToURL:options:error:`方法。该**方法的最后一个参数是一个指向NSError指针的引用**：

```objc
- (BOOL)writeToURL:(NSURL *)aURL
           options:(NSDataWritingOptions)mask
             error:(NSError **)errorPtr;
```

在调用这个方法之前，您需要创建一个合适的指针，以便可以传递其地址：

```objc
    NSError *anyError;
    BOOL success = [receivedData writeToURL:someLocalFileURL
                                    options:0
                                      error:&anyError];
    if (!success) {
        NSLog(@"Write failed with error: %@", anyError);
        // present error to user
    }
```

如果发生错误，writeToURL:...方法将返回NO，**并更新您的anyError指针，使其指向描述问题的错误对象**。

在处理通过引用传递的错误时，重要的是测试方法的返回值，以查看是否发生了错误，就像上面所示的方式一样。不要仅仅测试错误指针是否被设置为指向错误。

**提示：如果您对错误对象不感兴趣，只需将error:参数传递为NULL即可。**

### Recover if Possible or Display the Error to the User 恢复或向用户显示错误

如果您的应用程序能够从错误中透明地恢复，就能带来最佳用户体验。例如，如果您正在进行远程网络请求，您可以尝试使用不同的服务器再次发起请求。或者，**您可能需要在再次尝试之前从用户那里请求额外的信息，比如有效的用户名或密码凭据。**【苹果手把手教你程序设计系列】

如果无法从错误中恢复，应该向用户发出警告。如果您正在使用Cocoa Touch开发iOS应用，您需要创建并配置一个UIAlertView来显示错误信息。如果您正在使用Cocoa开发OS X应用，您可以在任何NSResponder对象上调用presentError:方法（比如视图、窗口甚至应用程序对象本身），错误将传播到响应者链` responder chain`以供进一步配置或恢复。当它到达应用程序对象时，应用程序会通过警告面板向用户呈现错误。

有关向用户呈现错误信息的更多信息，请参阅[Displaying Information From Error Objects](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ErrorHandlingCocoa/CreateCustomizeNSError/CreateCustomizeNSError.html#//apple_ref/doc/uid/TP40001806-CH204-BAJCIGIA)

### Generating Your Own Errors 生成自定义错误

要创建自己的NSError对象，您需要定义自己的错误域（error domain），它应该具有以下形式：

`com.companyName.appOrFrameworkName.ErrorDomain`

**您还需要为在您的域中可能发生的每个错误选择一个唯一的错误代码**，以及适当的描述，该描述存储在错误的用户信息字典中，如下所示：

```objc
    NSString *domain = @"com.MyCompany.MyApplication.ErrorDomain";
    NSString *desc = NSLocalizedString(@"Unable to…", @"");
    NSDictionary *userInfo = @{ NSLocalizedDescriptionKey : desc };
 
    NSError *error = [NSError errorWithDomain:domain
                                         code:-101
                                     userInfo:userInfo];
```

此示例使用NSLocalizedString函数**从Localizable.strings文件中查找错误描述的本地版本**，如在本地化字符串资源`Localizing String Resources`中所述。

如果您需要按引用返回错误，如前面所述，您的方法签名应包括一个指向NSError对象指针的指针参数。您还应该使用返回值来指示成功或失败，如下所示：

```objc
- (BOOL)doSomethingThatMayGenerateAnError:(NSError **)errorPtr;
```

如果发生错误，**您应该首先检查是否为错误参数提供了非NULL指针，然后再尝试取消引用它来设置错误**，然后返回NO以指示失败，如下所示：

```objc
- (BOOL)doSomethingThatMayGenerateAnError:(NSError **)errorPtr {
    ...
    // 出现错误
    if (errorPtr) {
        *errorPtr = [NSError errorWithDomain:...
                                        code:...
                                    userInfo:...];
    }
    return NO;
}
```

## Exceptions Are Used for Programmer Errors 异常用于程序员错误

Objective-C支持异常，与其他编程语言类似，语法类似于Java或C++。与NSError一样，Cocoa和Cocoa Touch中的异常是对象，由NSException类的实例表示。

如果您需要编写可能引发异常的代码，可以将该代码放在try-catch块中：

```objc
@try {
    // 执行可能引发异常的操作
}
@catch (NSException *exception) {
    // 处理异常
}
@finally {
    // 可选的清理代码块
    // 无论是否发生异常都会执行
}
```

如果try块内的代码引发异常，它将被catch块捕获，以便您可以处理它。例如，如果您正在使用一个使用异常进行错误处理的低级C++库，**您可以捕获其异常并生成适当的NSError对象以显示给用户**。

如果异常被引发但未被捕获，**系统默认的未捕获异常处理程序将向控制台记录一条消息，并终止应用程序**。

您不应该在Objective-C方法的标准编程检查之外使用try-catch块。例如，在处理NSArray时，您应该始终检查数组的count以确定项目的数量，然后再尝试访问给定索引处的对象。如果您对越界索引进行调用objectAtIndex:方法，将引发异常，以便您可以在开发周期的早期发现代码中的错误。在面向用户的应用程序中，应避免抛出异常。

有关Objective-C应用程序中异常的更多信息，请参阅异常编程主题 *[Exception Programming Topics](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Exceptions/Exceptions.html#//apple_ref/doc/uid/10000012i)*。