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
copyright: 文章内容归作者所有
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

甚至stl容器都能支持Objc的对象和数据类型，给人一种诡异的感觉：***~~就好像甜咸豆腐脑混在一起，蜜枣粽里面夹肉~~***；



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

` (void (^)(int))` 这个就是`selectfunc`的返回值，表示返回值是一个返回值为void类型，参数为int的block（~~是不是很绕，编程本质上就是套娃~~）。在`[ocTest selectfunc]`这一步获得这个`block`以后，我们就可以直接执行它（~~好像没有什么意义~~），或者声明一对应个`block`类型的变量多次的执行它。

`block`在形式上很像`C++`的`lambda`表达式，但或许功能上更接近函数指针。

#### 2023.10.12 - 13 Object-C底层研究

看了几篇文章[Objective-C的本质](https://cloud.tencent.com/developer/article/1136783)、[OC对象的前世今生](https://juejin.cn/post/6844904024659984391#heading-20)、 [自动释放池](https://draveness.me/autoreleasepool/)

`xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc 文件名 -o 输出的CPP文件`在根目录用命令行可以将Objc文件编译成Cpp文件，除了最基本的实现，整个代码3MB多，整整5w多行。所以大概率Objc编译多过程中是不会间接生成cpp代码的。

- 从展开代码可以看出OC的对象、类都是基于C/C++当中结构体实现的
- 所有类的对象共享一个Class指针地址，每个类在内存中有且只有一个Class对象【前置：`Objc`内存中类的存在也是一个对象的重要发言】
- 对于一个【类的实例`instance】，熟悉它在内存中存储一个`isa`指针指向它【类的对象】，以及其它**成员变量**的值
  - 【类的对象】和【元类】共同构成【类】在代码中的概念实现
- 对于一个【类的对象`class`】，其`isa`指针又指向了其【元类】，一个`superclass`父类指针，以及**类的属性**、对象方法、成员方法、成员变量）
- 对于一个【元类`meta-class`】也有自己的isa（看图应该是指向基类的元类，最后是自己），一个`superclass`指向父类的`meta-class`
  -  基类的`meta-class`的`superclass`指针指向基类的`class`(~~再次应验了编程本质套娃~~)
- `instance`调用对象方法的轨迹     
  - `isa`找到`class`，方法不存在，就通过s`uperclass`找父类
- `class`调用类方法的轨迹     
  - `isa`找`meta-class`，方法不存在，就通过`superclass`找父类

####  类的属性与成员变量

这个是`Objc`的一个独特的变量管理策略。

- 类的【成员变量】提供给类内部访问，当外部想要访问时，只能通过`->`访问`@public`的成员变量
  - 对于`.h`文件
    - 对于`@interface在花括号中声明的变量默认访问权限为`@protected`
    - 对于`@implementation在花括号中声明的变量默认访问权限为`@private`
  - 对于`.m`文件，都是无法外部访问的
- 类的【属性】提供给类外部使用，可以使用点表达式访问
  - 属性自带原子性
  - 自带`getter`和`setter`方法

####  Tagged Pointer —— 一种假指针

`Tagged Pointer`是一种很神奇的存在，其在代码中虽然表现为正常的一个指针类型的变量，但是实际上其存储的内容不再是对应内容的地址，而是对应内容的本身。

- 也就是说，如果指针将要存储的内容可以由8个字节【指针变量原本的大小】承载，那么编译器会将这部分内容存储到指针变量当中
- 体现在多线程上，则是每次修改其内容并不需要考虑申请与释放，因为它通过一条指令就可以直接被修改而没有中间过程