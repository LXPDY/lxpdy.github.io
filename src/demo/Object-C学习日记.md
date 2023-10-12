---
title: Object-C学习日记

order: 1
icon: file
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10-12
category:
  - 使用指南
tag:
  - Objetc-C
footer: 这是一个页脚
# 你可以自定义版权信息
copyright: 没有版权捏
comment: false
---

# Object-C学习日记

## 日常篇

#### 2023.10.10 Object-C++的存在

在`Xcode`中直接创建一个macOS的命令行工程，尝试在其中添加CPP代码

```objc
//test.mm
#import <Foundation/Foundation.h>
#import <iostream>

class Test{
   public:
      void func(){
         std::cout<< "hello world" << std::endl;
      }
};

@interface OCTest:NSObject{
   @public
   Test *test_p;
}
- (void)func:(int) num1 num2:(int) num2;
@end

@implementation OCTest

- (void)func :(int) num1 num2:(int) num2{
   test_p = new Test();
   test_p->func2(num1,num2);
}
@end


int main1() {
   /* my first program in Objective-C */
    OCTest *ocTest = [[OCTest alloc]init];
   //[sampleClass sampleMethod];
   [ocTest func:1 num2:2];
   return 0;
}
```

发现是无法在Xcode中直接编译运行的。对于混编代码，需要在`Xcode`侧边栏将文件扩展名更改为`.mm`类型后选择`Objec-C++`的类型才行。

Objc的代码中可以直接`import`C++的头文件，调用C++的函数来实现逻辑。但是Objc的原生类方法声明实现风格和C++书写风格迥异。

经过测试，Objc的文件也可以直接使用C++头文件中的类以及声明的函数，只需要在编译时选定它为Objc++的类型。

#### 2023.10.12 Object-C Block，Objc版本的lambda表达式？block作返回值

```objc
typedef void (^SeleFunc)(int n);

@interface OCTest:NSObject
- (void (^)(int))selectfunc;
@end

@implementation OCTest

- (void (^)(int))selectfunc{
    return ^(int a){NSLog(@"MyTest : %d \n",a);};
}
@end
int testblock() {
    /* my first program in Objective-C */
    OCTest *ocTest = [[OCTest alloc]init];
    //[sampleClass sampleMethod];
    [ocTest selectfunc](1);
    SeleFunc blk = [ocTest selectfunc];
    blk(1);
   return 0;
}


```

` (void (^)(int))` 这个就是`selectfunc`的返回值，表示返回值是一个返回值为void类型，参数为int的block（~~是不是很绕，编程本质上就是套娃~~）。在`[ocTest selectfunc]`这一步获得这个`block`以后，我们就可以直接执行它（<u>好像没有什么意义</u>），或者声明一对应个`block`类型的变量多次的执行它。

`block`在形式上很像`C++`的`lambda`表达式，但或许功能上感觉花里胡哨一点。

#### 2023.10.12 Object-C底层研究

看了一篇文章[Objective-C的本质](https://cloud.tencent.com/developer/article/1136783)

`xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc 文件名 -o 输出的CPP文件`在根目录用命令行可以将Objc文件编译成Cpp文件，除了最基本的实现，整个代码3MB多，整整5w多行。所以大概率Objc编译多过程中是不会间接生成cpp代码的。