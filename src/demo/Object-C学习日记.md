---
title: Objective-C学习日记

order: 1
icon: file
# 设置作者
author: Fuyuyu
# 设置写作时间
date: 2023-10
category:
  - 学习日记
tag:
  - Objective-C
footer: 这是一个页脚
# 你可以自定义版权信息
copyright: 文章内容归作者所有，不保证完全正确
comment: false
---

# Objective-C学习日记

## 2023.10.10 

### Objective-C++的存在

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

发现是无法在Xcode中直接编译运行的。对于混编代码，需要在`Xcode`侧边栏将文件扩展名更改为`.mm`类型后选择`Objective-C`的类型才行。

Objc的代码中可以直接`import`C++的头文件，调用C++的函数来实现逻辑。但是Objc的原生类方法声明实现风格和C++书写风格迥异。

经过测试，Objc的文件也可以直接使用C++头文件中的类以及声明的函数，只需要在编译时选定它为Objc++的类型。

甚至stl容器都能支持Objc的对象和数据类型，给人一种诡异的感觉：***~~就好像甜咸豆腐脑混在一起，蜜枣粽里面夹肉~~***；



## 2023.10.12 

### Objective-C Block，Objc版本的lambda表达式？block作返回值

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

## 2023.10.12 - 13 

### Objective-C底层研究

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

###  类的属性与成员变量

这个是`Objc`的一个独特的变量管理策略。

- 类的【成员变量】提供给类内部访问，当外部想要访问时，只能通过`->`访问`@public`的成员变量
  - 对于`.h`文件
    - 对于`@interface在花括号中声明的变量默认访问权限为` `@protected`
    - 对于`@implementation在花括号中声明的变量默认访问权限为` `@private`
  - 对于`.m`文件，都是无法外部访问的
- 类的【属性】提供给类外部使用，可以使用点表达式访问
  - nonatomic or atomic, readwrite or readonly and strong,unsafe_unretained or weak
  - 自带`getter`和`setter`方法
  - `@synthesis` 部分已经在高版本由Xcode完成，大部分情况下不需要关注

###  Tagged Pointer —— 一种假指针

`Tagged Pointer`是一种很神奇的存在，其在代码中虽然表现为正常的一个指针类型的变量，但是实际上其存储的内容不再是对应内容的地址，而是对应内容的本身。

- 也就是说，如果指针将要存储的内容可以由8个字节【指针变量原本的大小】承载，那么编译器会将这部分内容存储到指针变量当中
- 体现在多线程上，则是每次修改其内容并不需要考虑申请与释放，因为它通过一条指令就可以直接被修改而没有中间过程



## 2023.10.16 

### @AutoreleasePool  自动释放池

[IOS - 聊聊 autorelease 和 @autoreleasepool](https://cloud.tencent.com/developer/article/1615642)

```Objc
int main(int argc, char * argv[]) {
    NSString * appDelegateClassName;
    @autoreleasepool {
        // Setup code that might create autoreleased objects goes here.
        appDelegateClassName = NSStringFromClass([AppDelegate class]);
    }
    return UIApplicationMain(argc, argv, nil, appDelegateClassName);
}
```

如果你的程序使用了`AppKit`或`UIKit`框架，那么主线程的`RunLoop`就会在每次事件循环迭代中创建并处理`@autoreleasepool`。也就是说，应用程序所有`autorelease`对象的都是由`RunLoop`创建的`@autoreleasepool`来管理。而`main()`函数中的`@autoreleasepool`只是负责管理它的作用域中的`autorelease`对象。

#### 本质：

一个结构体（C++类），有构造和析构函数，这个结构体会在初始化时调用 `objc_autoreleasePoolPush()` 方法，会在析构时调用 `objc_autoreleasePoolPop()` 方法

#### 自动释放池的构成单元：AutoreleasePoolPage 

在`Objc`底层代码中的定义，是一个C++类，其结构为一个栈

```C++
class AutoreleasePoolPage {
  //一些定义
  
  #   define EMPTY_POOL_PLACEHOLDER ((id*)1)  
  // EMPTY_POOL_PLACEHOLDER：表示一个空自动释放池的占位符
#   define POOL_BOUNDARY nil                // POOL_BOUNDARY：哨兵对象
    static pthread_key_t const key = AUTORELEASE_POOL_KEY;
    static uint8_t const SCRIBBLE = 0xA3;   // 用来标记已释放的对象
    static size_t const SIZE =              // 每个 Page 对象占用 4096 个字节内存
#if PROTECT_AUTORELEASEPOOL                 // PAGE_MAX_SIZE = 4096
        PAGE_MAX_SIZE;  // must be muliple of vm page size
#else
        PAGE_MAX_SIZE;  // size and alignment, power of 2
#endif
    static size_t const COUNT = SIZE / sizeof(id);  // Page 的个数
  
  
  
    magic_t const magic;//用于对当前 AutoreleasePoolPage 完整性的校验
    id *next;//next 指向了页内部空间下一个为空的内存地址，用于存放要autorelease对对象
    pthread_t const thread;//保存了当前页所在的线程
    AutoreleasePoolPage * const parent;
    AutoreleasePoolPage *child;//构造双向链表的指针
    uint32_t const depth;// Page 的深度，从 0 开始递增
    uint32_t hiwat;
};
//实际分配内存除了这些成员变量，还有剩下的空间作为页的储存空间，同时begin()和end()这两个类的实例方法能够快速获取这段空间的头尾，通过next指针获取页内空间为空的下一个地址


```

每一个自动释放池都是由一系列的 `AutoreleasePoolPage` 组成的，并且每一个 `AutoreleasePoolPage` 的大小都是 `4096` 字节（16 进制 0x1000），并以双向链表的形式连接在一起。

注：`nil` 用于表示指向 Objective-C 对象（id 类型的对象，或者使用 @interface 声明的 OC 对象）的指针为空

##### 哨兵对象：POOL_BOUNDARY【之前叫POOL_SENTINEL】

在每个自动释放池初始化调用 `objc_autoreleasePoolPush` 的时候，都会把一个 `POOL_SENTINEL` push 到自动释放池的栈顶，并且返回这个 `POOL_SENTINEL` 哨兵对象。而当方法 `objc_autoreleasePoolPop` 调用时，就会向自动释放池中的对象发送 `release` 消息，直到第一个 `POOL_SENTINEL`：

以上操作是针对`AutoreleasePoolPage`内部空间来说的

##### objc_autoreleasePoolPush 方法

```objc
//入口
void *objc_autoreleasePoolPush(void) {
    return AutoreleasePoolPage::push();//调用push
}
//下一步
static inline void *push() {
        id *dest;
        if (DebugPoolAllocation) { // 出错时进入调试状态
            // Each autorelease pool starts on a new pool page.
            dest = autoreleaseNewPage(POOL_BOUNDARY);
        } else {
            dest = autoreleaseFast(POOL_BOUNDARY);  // 传入 POOL_BOUNDARY 哨兵对象
        }
        assert(dest == EMPTY_POOL_PLACEHOLDER || *dest == POOL_BOUNDARY);
        return dest;
}
//下一步
static inline id *autoreleaseFast(id obj)
{
   AutoreleasePoolPage *page = hotPage();//尝试新创建的未满的 Page
   if (page && !page->full()) {
       return page->add(obj);//有页且页不满，直接把autorelease对象入栈
   } else if (page) {
       return autoreleaseFullPage(obj, page);
     //有页且页满，创建一个新的 Page，并将 autorelease 对象添加进去
   } else {
       return autoreleaseNoPage(obj);//创建第一个 Page，并将 autorelease 对象添加进去
   }
}

//add
  id *add(id obj)
  {
      assert(!full());
      unprotect();
      id *ret = next;  // faster than `return next-1` because of aliasing
      *next++ = obj;
      protect();
      return ret;
  }


//autoreleaseFullPage
//将autorelease对象添加到Page中的next指针所指向的位置，
//并将next指针指向这个对象的下一个位置，然后将该对象的位置返回
  static __attribute__((noinline))
  id *autoreleaseFullPage(id obj, AutoreleasePoolPage *page)
  {
      // The hot page is full. 
      // Step to the next non-full page, adding a new page if necessary.
      // Then add the object to that page.
      assert(page == hotPage());
      assert(page->full()  ||  DebugPoolAllocation);

      do {
          if (page->child) page = page->child;
          else page = new AutoreleasePoolPage(page);
      } while (page->full());

      setHotPage(page);
      return page->add(obj);
  }

//不展示autoreleaseNoPage的代码了
既然当前内存中不存在 AutoreleasePoolPage，就要从头开始构建这个自动释放池的双向链表，也就是说，新的 AutoreleasePoolPage 是没有 parent 指针的。
  初始化之后，将当前页标记为 hotPage，然后会先向这个 page 中添加一个 POOL_SENTINEL 对象，来确保在 pop 调用的时候，不会出现异常。
最后，将 obj 添加到自动释放池中。
```

##### objc_autoreleasePoolPop 方法

```objective-c
void objc_autoreleasePoolPop(void *ctxt) {
    AutoreleasePoolPage::pop(ctxt);
}

//此处为简化板代码，只体现主要逻辑
//pop()方法的传参token即为POOL_BOUNDARY对应在Page中的地址
//目的是将自动释放池中的autorelease对象全部释放（实际上是从自动释放池的中的最后一个入栈的autorelease对象开始，依次给它们发送一条release消息，直到遇到这个POOL_BOUNDARY）
static inline void pop(void *token) {
    AutoreleasePoolPage *page = pageForPointer(token);
  //使用 pageForPointer 获取当前 token 所在的 AutoreleasePoolPage
    id *stop = (id *)token;

    page->releaseUntil(stop);
//调用 releaseUntil 方法释放栈中的对象，直到 stop【即为POOL_BOUNDARY的地址；】
//调用 child 的 kill 方法
    if (page->child) {
        if (page->lessThanHalfFull()) {
            page->child->kill();
        } else if (page->child->child) {
            page->child->child->kill();
        }
    }
}
```

##### 总结

关于这部分，还有很多代码和细节没有去深究，毕竟还是在初学阶段（~~其实还是偷懒+看不懂~~），但是研究过后，还是不得不佩服苹果在这方面做出的细节，对于一个计算机的学生来说，这部分代码即是只是一个程序的内存管理系统，但是俨然已经很像一个完备的操作系统的内存管理系统。这部分，其实很像java的JVM系列的自动管理。

另：

`not available in automatic reference counting mode`在学习的过程中发现了这个报错，发现现在高版本的Xcode的编译选项中已经自带引用计数器了，不需要程序员进行初始化



### NSError

#### 注册方法

```objc
      NSString *domain = @"com.MyCompany.MyApplication.ErrorDomain";
      NSString *desc =@"Unable to complete the process";
      NSDictionary *userInfo = [[NSDictionary alloc] 
      initWithObjectsAndKeys:desc,
      @"NSLocalizedDescriptionKey",NULL];  
      *errorPtr = [NSError errorWithDomain:domain code:-101 userInfo:userInfo];
```

- `domain` 错误发生域
- `userInfo`错误详细描述
- `code`错误码

除了通过错误码来访问相关错误信息，NSError还提供了对应的只读属性来直接读取相关信息。当创建 error 对象时，可以在userinfo中提供这些功能。

不太用过这样的报错体系，希望后面学的更多能回来补充。

## 2023.10.17

#### 分类(Category)和扩展(Extension)

- 为一个已有的类添加新功能

- 通常分类的声明会放在单独的头文件中, 实现的代码也会放置在单独的源码文件中【虽然从分类中添加的方法对于它所有的实例以及子类实例都可见, 但是我们在使用这些方法时, 仍然是需要引入对应头文件的】

-  我们也可以使用分类将一个复杂的类的实现分开成多个文件管理
- 分类可以用来声明实例方法或者类方法, 但是大多数情况下不适宜声明额外的属性. 虽然从语法角度看在分类的声明中声明属性是可行的, 但是却不能够在分类中声明额外的实例变量
- 类扩展（匿名分类）【只能添加到在编译时拥有源代码的类】
  - 和普通分类不同的是, 类扩展可以为类添加属性和实例变量
  - 通过在一个类的实现文件中添加类扩张，可以将一些类的属性在单文件内公开，但是不影响其他外部引用
