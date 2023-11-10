import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as s,c as i,b as e,d as a,a as n,w as l,f as d}from"./app-186b5a71.js";const p={},u=d(`<h1 id="selector" tabindex="-1"><a class="header-anchor" href="#selector" aria-hidden="true">#</a> Selector</h1><p><code>selector</code>选择器是用于选择要为对象执行的方法的名称，或者是在<strong>源代码编译时替代名称的唯一标识符</strong>。选择器本身并不执行任何操作，它仅仅标识一个方法。选择器方法名称与普通字符串的区别在于<strong>编译器确保选择器是唯一的</strong>。选择器的实用之处在于它（与运行时一起）充当了一个动态函数指针，对于给定的名称，自动指向适合用于哪个类的方法实现。假设你有一个用于方法 <code>run</code> 的选择器，并且有类 <code>Dog</code>、<code>Athlete</code> 和 <code>ComputerSimulation</code>（每个类都实现了一个 <code>run</code> 方法）。选择器可以与每个类的实例一起使用，以调用其 <code>run</code> 方法，尽管每个类的实现可能不同。</p><h2 id="getting-a-selector" tabindex="-1"><a class="header-anchor" href="#getting-a-selector" aria-hidden="true">#</a> Getting a Selector</h2><p>编译后的选择器的变量类型是 <code>SEL</code>。有两种常见的获取选择器的方式：</p><ul><li>在编译时，你可以使用编译器指令 <code>@selector</code>。 <ul><li><code>SEL aSelector = @selector(methodName);</code></li></ul></li><li>在运行时，你可以使用 <code>NSSelectorFromString</code> 函数，其中字符串是方法的名称： <ul><li><code>SEL aSelector = NSSelectorFromString(@&quot;methodName&quot;);</code></li></ul></li></ul><p>你可以使用从字符串创建的选择器，当你的代码需要向某个方法发送一个消息，并且在运行之前你不知道它的名称。</p><h2 id="using-a-selector" tabindex="-1"><a class="header-anchor" href="#using-a-selector" aria-hidden="true">#</a> Using a Selector</h2><p>你可以使用选择器来调用方法，使用 <code>performSelector:</code> 和其他类似的方法。</p><div class="language-objc line-numbers-mode" data-ext="objc"><pre class="language-objc"><code>SEL aSelector <span class="token operator">=</span> <span class="token keyword">@selector</span><span class="token punctuation">(</span>run<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">[</span>aDog performSelector<span class="token punctuation">:</span>aSelector<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">[</span>anAthlete performSelector<span class="token punctuation">:</span>aSelector<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">[</span>aComputerSimulation performSelector<span class="token punctuation">:</span>aSelector<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（你会在特殊情况下使用这种技术，比如当你实现一个使用目标-动作<code>target-action</code>设计模式的对象时。通常情况下，你会直接调用方法。）</p><h3 id="prerequisite-articles" tabindex="-1"><a class="header-anchor" href="#prerequisite-articles" aria-hidden="true">#</a> Prerequisite Articles</h3>`,11),h={href:"https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Message.html#//apple_ref/doc/uid/TP40008195-CH59-SW1",target:"_blank",rel:"noopener noreferrer"},m=e("h3",{id:"related-articles",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#related-articles","aria-hidden":"true"},"#"),a(" Related Articles")],-1),_={href:"https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/DynamicBinding.html#//apple_ref/doc/uid/TP40008195-CH15-SW1",target:"_blank",rel:"noopener noreferrer"},g=e("h3",{id:"definitive-discussion",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#definitive-discussion","aria-hidden":"true"},"#"),a(" Definitive Discussion")],-1),f={href:"https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html#//apple_ref/doc/uid/TP40011210-CH4",target:"_blank",rel:"noopener noreferrer"};function k(S,b){const t=o("ExternalLinkIcon"),r=o("RouterLink");return s(),i("div",null,[u,e("ul",null,[e("li",null,[e("a",h,[a("Message"),n(t)])])]),m,e("ul",null,[e("li",null,[e("a",_,[a("Dynamic binding"),n(t)])])]),g,e("ul",null,[e("li",null,[e("a",f,[a("Working with Objects"),n(t)]),a(),n(r,{to:"/tec/basic/programWithOC/%E5%AD%90%E7%AB%A0%E8%8A%82/WorkWithObject.html"},{default:l(()=>[a("翻译")]),_:1})])])])}const x=c(p,[["render",k],["__file","Selector.html.vue"]]);export{x as default};