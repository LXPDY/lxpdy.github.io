import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as c,c as l,a as s,b as n,e,f as t}from"./app-2ebd7f77.js";const i={},u=t(`<h1 id="object-c学习日记" tabindex="-1"><a class="header-anchor" href="#object-c学习日记" aria-hidden="true">#</a> Object-C学习日记</h1><h2 id="_2023-10-10-object-c-的存在" tabindex="-1"><a class="header-anchor" href="#_2023-10-10-object-c-的存在" aria-hidden="true">#</a> 2023.10.10 Object-C++的存在</h2><p>在<code>Xcode</code>中直接创建一个macOS的命令行工程，尝试在其中添加CPP代码</p><div class="language-objc line-numbers-mode" data-ext="objc"><pre class="language-objc"><code><span class="token comment">//test.mm</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">import</span> <span class="token expression"><span class="token operator">&lt;</span>Foundation<span class="token operator">/</span>Foundation<span class="token punctuation">.</span>h<span class="token operator">&gt;</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">import</span> <span class="token expression"><span class="token operator">&lt;</span>iostream<span class="token operator">&gt;</span></span></span>

class Test<span class="token punctuation">{</span>
   public<span class="token punctuation">:</span>
      <span class="token keyword">void</span> <span class="token function">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
         std<span class="token punctuation">:</span><span class="token punctuation">:</span>cout<span class="token operator">&lt;&lt;</span> <span class="token string">&quot;hello world&quot;</span> <span class="token operator">&lt;&lt;</span> std<span class="token punctuation">:</span><span class="token punctuation">:</span>endl<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">@interface</span> OCTest<span class="token punctuation">:</span>NSObject<span class="token punctuation">{</span>
   <span class="token keyword">@public</span>
   Test <span class="token operator">*</span>test_p<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>func<span class="token punctuation">:</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> num1 num2<span class="token punctuation">:</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> num2<span class="token punctuation">;</span>
<span class="token keyword">@end</span>

<span class="token keyword">@implementation</span> OCTest

<span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>func <span class="token punctuation">:</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> num1 num2<span class="token punctuation">:</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> num2<span class="token punctuation">{</span>
   test_p <span class="token operator">=</span> new <span class="token function">Test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   test_p<span class="token operator">-&gt;</span><span class="token function">func2</span><span class="token punctuation">(</span>num1<span class="token punctuation">,</span>num2<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">@end</span>


<span class="token keyword">int</span> <span class="token function">main1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token comment">/* my first program in Objective-C */</span>
    OCTest <span class="token operator">*</span>ocTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>OCTest alloc<span class="token punctuation">]</span>init<span class="token punctuation">]</span><span class="token punctuation">;</span>
   <span class="token comment">//[sampleClass sampleMethod];</span>
   <span class="token punctuation">[</span>ocTest func<span class="token punctuation">:</span><span class="token number">1</span> num2<span class="token punctuation">:</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
   <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现是无法在Xcode中直接编译运行的。对于混编代码，需要在<code>Xcode</code>侧边栏将文件扩展名更改为<code>.mm</code>类型后选择<code>Objec-C++</code>的类型才行。</p><p>Objc的代码中可以直接<code>import</code>C++的头文件，调用C++的函数来实现逻辑。但是Objc的原生类方法声明实现风格和C++书写风格迥异。</p><p>经过测试，Objc的文件也可以直接使用C++头文件中的类以及声明的函数，只需要在编译时选定它为Objc++的类型。</p><p>甚至stl容器都能支持Objc的对象和数据类型，给人一种诡异的感觉：<em><strong><s>就好像甜咸豆腐脑混在一起，蜜枣粽里面夹肉</s></strong></em>；</p><h2 id="_2023-10-12-object-c-block-objc版本的lambda表达式-block作返回值" tabindex="-1"><a class="header-anchor" href="#_2023-10-12-object-c-block-objc版本的lambda表达式-block作返回值" aria-hidden="true">#</a> 2023.10.12 Object-C Block，Objc版本的lambda表达式？block作返回值</h2><div class="language-objc line-numbers-mode" data-ext="objc"><pre class="language-objc"><code><span class="token keyword">typedef</span> <span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">^</span>SeleFunc<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">int</span> n<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">@interface</span> OCTest<span class="token punctuation">:</span>NSObject
<span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">^</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">)</span>selectfunc<span class="token punctuation">;</span>
<span class="token keyword">@end</span>

<span class="token keyword">@implementation</span> OCTest

<span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">^</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">)</span>selectfunc<span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">^</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@&quot;MyTest : %d \\n&quot;</span><span class="token punctuation">,</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">@end</span>
<span class="token keyword">int</span> <span class="token function">testblock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/* my first program in Objective-C */</span>
    OCTest <span class="token operator">*</span>ocTest <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>OCTest alloc<span class="token punctuation">]</span>init<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token comment">//[sampleClass sampleMethod];</span>
    <span class="token punctuation">[</span>ocTest selectfunc<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    SeleFunc blk <span class="token operator">=</span> <span class="token punctuation">[</span>ocTest selectfunc<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">blk</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code> (void (^)(int))</code> 这个就是<code>selectfunc</code>的返回值，表示返回值是一个返回值为void类型，参数为int的block（<s>是不是很绕，编程本质上就是套娃</s>）。在<code>[ocTest selectfunc]</code>这一步获得这个<code>block</code>以后，我们就可以直接执行它（<s>好像没有什么意义</s>），或者声明一对应个<code>block</code>类型的变量多次的执行它。</p><p><code>block</code>在形式上很像<code>C++</code>的<code>lambda</code>表达式，但或许功能上更接近函数指针。</p><h2 id="_2023-10-12-13-object-c底层研究" tabindex="-1"><a class="header-anchor" href="#_2023-10-12-13-object-c底层研究" aria-hidden="true">#</a> 2023.10.12 - 13 Object-C底层研究</h2>`,13),d={href:"https://cloud.tencent.com/developer/article/1136783",target:"_blank",rel:"noopener noreferrer"},r={href:"https://juejin.cn/post/6844904024659984391#heading-20",target:"_blank",rel:"noopener noreferrer"},k={href:"https://draveness.me/autoreleasepool/",target:"_blank",rel:"noopener noreferrer"},v=t('<p><code>xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc 文件名 -o 输出的CPP文件</code>在根目录用命令行可以将Objc文件编译成Cpp文件，除了最基本的实现，整个代码3MB多，整整5w多行。所以大概率Objc编译多过程中是不会间接生成cpp代码的。</p><ul><li>从展开代码可以看出OC的对象、类都是基于C/C++当中结构体实现的</li><li>所有类的对象共享一个Class指针地址，每个类在内存中有且只有一个Class对象【前置：<code>Objc</code>内存中类的存在也是一个对象的重要发言】</li><li>对于一个【类的实例<code>instance】，熟悉它在内存中存储一个</code>isa`指针指向它【类的对象】，以及其它<strong>成员变量</strong>的值 <ul><li>【类的对象】和【元类】共同构成【类】在代码中的概念实现</li></ul></li><li>对于一个【类的对象<code>class</code>】，其<code>isa</code>指针又指向了其【元类】，一个<code>superclass</code>父类指针，以及<strong>类的属性</strong>、对象方法、成员方法、成员变量）</li><li>对于一个【元类<code>meta-class</code>】也有自己的isa（看图应该是指向基类的元类，最后是自己），一个<code>superclass</code>指向父类的<code>meta-class</code><ul><li>基类的<code>meta-class</code>的<code>superclass</code>指针指向基类的<code>class</code>(<s>再次应验了编程本质套娃</s>)</li></ul></li><li><code>instance</code>调用对象方法的轨迹 <ul><li><code>isa</code>找到<code>class</code>，方法不存在，就通过s<code>uperclass</code>找父类</li></ul></li><li><code>class</code>调用类方法的轨迹 <ul><li><code>isa</code>找<code>meta-class</code>，方法不存在，就通过<code>superclass</code>找父类</li></ul></li></ul><h3 id="类的属性与成员变量" tabindex="-1"><a class="header-anchor" href="#类的属性与成员变量" aria-hidden="true">#</a> 类的属性与成员变量</h3><p>这个是<code>Objc</code>的一个独特的变量管理策略。</p><ul><li>类的【成员变量】提供给类内部访问，当外部想要访问时，只能通过<code>-&gt;</code>访问<code>@public</code>的成员变量 <ul><li>对于<code>.h</code>文件 <ul><li>对于<code>@interface在花括号中声明的变量默认访问权限为</code>@protected`</li><li>对于<code>@implementation在花括号中声明的变量默认访问权限为</code>@private`</li></ul></li><li>对于<code>.m</code>文件，都是无法外部访问的</li></ul></li><li>类的【属性】提供给类外部使用，可以使用点表达式访问 <ul><li>属性自带原子性</li><li>自带<code>getter</code>和<code>setter</code>方法</li></ul></li></ul><h3 id="tagged-pointer-——-一种假指针" tabindex="-1"><a class="header-anchor" href="#tagged-pointer-——-一种假指针" aria-hidden="true">#</a> Tagged Pointer —— 一种假指针</h3><p><code>Tagged Pointer</code>是一种很神奇的存在，其在代码中虽然表现为正常的一个指针类型的变量，但是实际上其存储的内容不再是对应内容的地址，而是对应内容的本身。</p><ul><li>也就是说，如果指针将要存储的内容可以由8个字节【指针变量原本的大小】承载，那么编译器会将这部分内容存储到指针变量当中</li><li>体现在多线程上，则是每次修改其内容并不需要考虑申请与释放，因为它通过一条指令就可以直接被修改而没有中间过程</li></ul><h2 id="_2023-10-16" tabindex="-1"><a class="header-anchor" href="#_2023-10-16" aria-hidden="true">#</a> 2023.10.16</h2><h3 id="autoreleasepool-自动释放池" tabindex="-1"><a class="header-anchor" href="#autoreleasepool-自动释放池" aria-hidden="true">#</a> @AutoreleasePool 自动释放池</h3>',10),m={href:"https://cloud.tencent.com/developer/article/1615642",target:"_blank",rel:"noopener noreferrer"},b=t(`<div class="language-Objc line-numbers-mode" data-ext="Objc"><pre class="language-Objc"><code>int main(int argc, char * argv[]) {
    NSString * appDelegateClassName;
    @autoreleasepool {
        // Setup code that might create autoreleased objects goes here.
        appDelegateClassName = NSStringFromClass([AppDelegate class]);
    }
    return UIApplicationMain(argc, argv, nil, appDelegateClassName);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你的程序使用了<code>AppKit</code>或<code>UIKit</code>框架，那么主线程的<code>RunLoop</code>就会在每次事件循环迭代中创建并处理<code>@autoreleasepool</code>。也就是说，应用程序所有<code>autorelease</code>对象的都是由<code>RunLoop</code>创建的<code>@autoreleasepool</code>来管理。而<code>main()</code>函数中的<code>@autoreleasepool</code>只是负责管理它的作用域中的<code>autorelease</code>对象。</p><h4 id="本质" tabindex="-1"><a class="header-anchor" href="#本质" aria-hidden="true">#</a> 本质：</h4><p>一个结构体（C++类），有构造和析构函数，这个结构体会在初始化时调用 <code>objc_autoreleasePoolPush()</code> 方法，会在析构时调用 <code>objc_autoreleasePoolPop()</code> 方法</p><h4 id="自动释放池的构成单元-autoreleasepoolpage" tabindex="-1"><a class="header-anchor" href="#自动释放池的构成单元-autoreleasepoolpage" aria-hidden="true">#</a> 自动释放池的构成单元：AutoreleasePoolPage</h4><p>在<code>Objc</code>底层代码中的定义，是一个C++类，其结构为一个栈</p><div class="language-C++ line-numbers-mode" data-ext="C++"><pre class="language-C++"><code>class AutoreleasePoolPage {
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


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每一个自动释放池都是由一系列的 <code>AutoreleasePoolPage</code> 组成的，并且每一个 <code>AutoreleasePoolPage</code> 的大小都是 <code>4096</code> 字节（16 进制 0x1000），并以双向链表的形式连接在一起。</p><h5 id="哨兵对象-pool-boundary【之前叫pool-sentinel】" tabindex="-1"><a class="header-anchor" href="#哨兵对象-pool-boundary【之前叫pool-sentinel】" aria-hidden="true">#</a> 哨兵对象：POOL_BOUNDARY【之前叫POOL_SENTINEL】</h5><p>在每个自动释放池初始化调用 <code>objc_autoreleasePoolPush</code> 的时候，都会把一个 <code>POOL_SENTINEL</code> push 到自动释放池的栈顶，并且返回这个 <code>POOL_SENTINEL</code> 哨兵对象。而当方法 <code>objc_autoreleasePoolPop</code> 调用时，就会向自动释放池中的对象发送 <code>release</code> 消息，直到第一个 <code>POOL_SENTINEL</code>：</p><p>以上操作是针对<code>AutoreleasePoolPage</code>内部空间来说的</p><h5 id="objc-autoreleasepoolpush-方法" tabindex="-1"><a class="header-anchor" href="#objc-autoreleasepoolpush-方法" aria-hidden="true">#</a> objc_autoreleasePoolPush 方法</h5><div class="language-objc line-numbers-mode" data-ext="objc"><pre class="language-objc"><code><span class="token comment">//入口</span>
<span class="token keyword">void</span> <span class="token operator">*</span><span class="token function">objc_autoreleasePoolPush</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> AutoreleasePoolPage<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//调用push</span>
<span class="token punctuation">}</span>
<span class="token comment">//下一步</span>
<span class="token keyword">static</span> <span class="token keyword">inline</span> <span class="token keyword">void</span> <span class="token operator">*</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        id <span class="token operator">*</span>dest<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>DebugPoolAllocation<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 出错时进入调试状态</span>
            <span class="token comment">// Each autorelease pool starts on a new pool page.</span>
            dest <span class="token operator">=</span> <span class="token function">autoreleaseNewPage</span><span class="token punctuation">(</span>POOL_BOUNDARY<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            dest <span class="token operator">=</span> <span class="token function">autoreleaseFast</span><span class="token punctuation">(</span>POOL_BOUNDARY<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 传入 POOL_BOUNDARY 哨兵对象</span>
        <span class="token punctuation">}</span>
        <span class="token function">assert</span><span class="token punctuation">(</span>dest <span class="token operator">==</span> EMPTY_POOL_PLACEHOLDER <span class="token operator">||</span> <span class="token operator">*</span>dest <span class="token operator">==</span> POOL_BOUNDARY<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> dest<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//下一步</span>
<span class="token keyword">static</span> <span class="token keyword">inline</span> id <span class="token operator">*</span><span class="token function">autoreleaseFast</span><span class="token punctuation">(</span>id obj<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
   AutoreleasePoolPage <span class="token operator">*</span>page <span class="token operator">=</span> <span class="token function">hotPage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//尝试新创建的未满的 Page</span>
   <span class="token keyword">if</span> <span class="token punctuation">(</span>page <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>page<span class="token operator">-&gt;</span><span class="token function">full</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
       <span class="token keyword">return</span> page<span class="token operator">-&gt;</span><span class="token function">add</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//有页且页不满，直接把autorelease对象入栈</span>
   <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>page<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       <span class="token keyword">return</span> <span class="token function">autoreleaseFullPage</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> page<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token comment">//有页且页满，创建一个新的 Page，并将 autorelease 对象添加进去</span>
   <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
       <span class="token keyword">return</span> <span class="token function">autoreleaseNoPage</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//创建第一个 Page，并将 autorelease 对象添加进去</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">//add</span>
  id <span class="token operator">*</span><span class="token function">add</span><span class="token punctuation">(</span>id obj<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
      <span class="token function">assert</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">full</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">unprotect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      id <span class="token operator">*</span>ret <span class="token operator">=</span> next<span class="token punctuation">;</span>  <span class="token comment">// faster than \`return next-1\` because of aliasing</span>
      <span class="token operator">*</span>next<span class="token operator">++</span> <span class="token operator">=</span> obj<span class="token punctuation">;</span>
      <span class="token function">protect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> ret<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>


<span class="token comment">//autoreleaseFullPage</span>
<span class="token comment">//将autorelease对象添加到Page中的next指针所指向的位置，</span>
<span class="token comment">//并将next指针指向这个对象的下一个位置，然后将该对象的位置返回</span>
  <span class="token keyword">static</span> <span class="token function">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span>noinline<span class="token punctuation">)</span><span class="token punctuation">)</span>
  id <span class="token operator">*</span><span class="token function">autoreleaseFullPage</span><span class="token punctuation">(</span>id obj<span class="token punctuation">,</span> AutoreleasePoolPage <span class="token operator">*</span>page<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
      <span class="token comment">// The hot page is full. </span>
      <span class="token comment">// Step to the next non-full page, adding a new page if necessary.</span>
      <span class="token comment">// Then add the object to that page.</span>
      <span class="token function">assert</span><span class="token punctuation">(</span>page <span class="token operator">==</span> <span class="token function">hotPage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">assert</span><span class="token punctuation">(</span>page<span class="token operator">-&gt;</span><span class="token function">full</span><span class="token punctuation">(</span><span class="token punctuation">)</span>  <span class="token operator">||</span>  DebugPoolAllocation<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">do</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>page<span class="token operator">-&gt;</span>child<span class="token punctuation">)</span> page <span class="token operator">=</span> page<span class="token operator">-&gt;</span>child<span class="token punctuation">;</span>
          <span class="token keyword">else</span> page <span class="token operator">=</span> new <span class="token function">AutoreleasePoolPage</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>page<span class="token operator">-&gt;</span><span class="token function">full</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token function">setHotPage</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> page<span class="token operator">-&gt;</span><span class="token function">add</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

<span class="token comment">//不展示autoreleaseNoPage的代码了</span>
既然当前内存中不存在 AutoreleasePoolPage，就要从头开始构建这个自动释放池的双向链表，也就是说，新的 AutoreleasePoolPage 是没有 parent 指针的。
  初始化之后，将当前页标记为 hotPage，然后会先向这个 page 中添加一个 POOL_SENTINEL 对象，来确保在 pop 调用的时候，不会出现异常。
最后，将 obj 添加到自动释放池中。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="objc-autoreleasepoolpop-方法" tabindex="-1"><a class="header-anchor" href="#objc-autoreleasepoolpop-方法" aria-hidden="true">#</a> objc_autoreleasePoolPop 方法</h5><div class="language-objective-c line-numbers-mode" data-ext="objective-c"><pre class="language-objective-c"><code>void objc_autoreleasePoolPop(void *ctxt) {
    AutoreleasePoolPage::pop(ctxt);
}

//此处为简化板代码，只体现主要逻辑
//pop()方法的传参token即为POOL_BOUNDARY对应在Page中的地址
//目的是将自动释放池中的autorelease对象全部释放（实际上是从自动释放池的中的最后一个入栈的autorelease对象开始，依次给它们发送一条release消息，直到遇到这个POOL_BOUNDARY）
static inline void pop(void *token) {
    AutoreleasePoolPage *page = pageForPointer(token);
  //使用 pageForPointer 获取当前 token 所在的 AutoreleasePoolPage
    id *stop = (id *)token;

    page-&gt;releaseUntil(stop);
//调用 releaseUntil 方法释放栈中的对象，直到 stop【即为POOL_BOUNDARY的地址；】
//调用 child 的 kill 方法
    if (page-&gt;child) {
        if (page-&gt;lessThanHalfFull()) {
            page-&gt;child-&gt;kill();
        } else if (page-&gt;child-&gt;child) {
            page-&gt;child-&gt;child-&gt;kill();
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h5><p>关于这部分，还有很多代码和细节没有去深究，毕竟还是在初学阶段（<s>其实还是偷懒+看不懂</s>），但是研究过后，还是不得不佩服苹果在这方面做出的细节，对于一个计算机的学生来说，这部分代码即是只是一个程序的内存管理系统，但是俨然已经很像一个完备的操作系统的内存管理系统。这部分，其实很像java的JVM系列的自动管理。</p>`,17);function h(g,P){const a=p("ExternalLinkIcon");return c(),l("div",null,[u,s("p",null,[n("看了几篇文章"),s("a",d,[n("Objective-C的本质"),e(a)]),n("、"),s("a",r,[n("OC对象的前世今生"),e(a)]),n("、 "),s("a",k,[n("自动释放池"),e(a)])]),v,s("p",null,[s("a",m,[n("IOS - 聊聊 autorelease 和 @autoreleasepool"),e(a)])]),b])}const O=o(i,[["render",h],["__file","Object-C学习日记.html.vue"]]);export{O as default};
