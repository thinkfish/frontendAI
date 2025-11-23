import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code2, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  BrainCircuit,
  Menu,
  X,
  Globe,
  FileType
} from 'lucide-react';
import { Category, Difficulty, Question, QuestionState } from './types';
import { getQuestionExplanation } from './services/geminiService';
import { MarkdownRenderer } from './components/MarkdownRenderer';

// --- Data Seed (Massively Expanded) ---
const QUESTIONS_DB: Question[] = [
  // --- JavaScript Core ---
  {
    id: '1',
    title: '解释 JavaScript 中的事件循环 (Event Loop)',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '尽管 JavaScript 是单线程的，它是如何处理异步操作的？',
    tags: ['异步', '调用栈', '微任务'],
    staticAnswer: `
### 核心概念
JavaScript 是单线程的，这意味着它一次只能做一件事。**Event Loop (事件循环)** 是 JavaScript 实现异步编程的核心机制，它负责监控调用栈（Call Stack）和任务队列（Task Queue）。

### 执行流程
1. **同步任务**：在主线程上执行，形成一个执行栈。
2. **异步任务**：通过回调函数等机制，放入任务队列中。任务队列分为：
   - **宏任务 (MacroTask)**: \`setTimeout\`, \`setInterval\`, UI 渲染, I/O。
   - **微任务 (MicroTask)**: \`Promise.then\`, \`MutationObserver\`, \`queueMicrotask\`。

### 循环机制
当调用栈为空时：
1. 引擎首先检查**微任务队列**。如果有任务，会一直执行直到清空所有微任务。
2. 然后从**宏任务队列**中取出一个任务执行。
3. 执行完该宏任务后，再次检查并清空微任务队列。
4. 重复上述步骤。

\`\`\`javascript
console.log('1'); // 同步

setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // 微任务
});

console.log('4'); // 同步

// 输出顺序: 1 -> 4 -> 3 -> 2
\`\`\`
`
  },
  {
    id: '4',
    title: 'JavaScript 中的闭包 (Closures)',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: '什么是闭包？请提供一个实际应用案例。',
    tags: ['作用域', '词法环境'],
    staticAnswer: `
### 定义
**闭包**是指一个函数能够访问其词法作用域（Lexical Scope），即使这个函数在其词法作用域之外被执行。简单来说，闭包让函数“记住”了它被创建时的环境。

### 核心原理
当函数被创建时，它会保留一个指向其外部作用域的引用。即使外部函数已经返回，内部函数依然持有对外部变量的引用，导致这些变量不会被垃圾回收机制回收。

### 实际应用：数据私有化
闭包常用于模拟私有变量，防止外部直接修改。

\`\`\`javascript
function createCounter() {
  let count = 0; // 私有变量

  return {
    increment: function() {
      count++;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getValue()); // 0
counter.increment();
console.log(counter.getValue()); // 1
console.log(counter.count);      // undefined (无法直接访问)
\`\`\`
`
  },
  {
    id: '10',
    title: '原型继承 (Prototypal Inheritance)',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: 'JavaScript 中的继承与传统的类继承有何不同？',
    tags: ['原型链', 'oop', 'es6 类'],
    staticAnswer: `
### 核心概念
JavaScript 中的对象有一个特殊的隐藏属性 \`[[Prototype]]\`（在浏览器中通常通过 \`__proto__\` 访问）。当访问一个对象的属性时，如果对象本身没有，JS 会沿着原型链向上查找，直到找到该属性或到达 null。

### 原型链
\`obj -> obj.__proto__ -> Object.prototype -> null\`

### 继承方式
1. **ES5 构造函数 + 原型赋值**：
\`\`\`javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { console.log('Noise'); }

function Dog(name) { Animal.call(this, name); } // 继承属性
Dog.prototype = Object.create(Animal.prototype); // 继承方法
Dog.prototype.constructor = Dog;
\`\`\`

2. **ES6 Class (语法糖)**：
底层依然是基于原型的继承，但写法更接近传统 OOP。
\`\`\`javascript
class Dog extends Animal {
  constructor(name) {
    super(name);
  }
}
\`\`\`
`
  },
  {
    id: '23',
    title: '深拷贝 vs 浅拷贝',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '如何正确地复制一个对象？',
    tags: ['对象', '内存', '拷贝'],
    staticAnswer: `
### 浅拷贝 (Shallow Copy)
- 只复制对象的第一层属性。如果属性是引用类型（如数组、对象），只复制其**内存地址**。
- **实现**: \`Object.assign({}, obj)\`, 扩展运算符 \`{...obj}\`。

### 深拷贝 (Deep Copy)
- 递归复制对象的所有层级，新旧对象在内存中完全独立。
- **实现方式**:
  1. **\`JSON.parse(JSON.stringify(obj))\`**:
     - 简单易用。
     - **缺点**: 无法处理函数、undefined、Symbol、循环引用，Date 会变字符串。
  2. **\`structuredClone(obj)\`** (现代浏览器原生支持):
     - 支持 Date, RegExp, Map, Set。
     - 依然不支持函数。
  3. **手写递归 / Lodash \`_.cloneDeep\`**:
     - 最稳健的方案。
`
  },
  {
    id: '27',
    title: 'new 操作符具体干了什么？',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '手写一个简单的 new 实现。',
    tags: ['原型', '构造函数', 'this'],
    staticAnswer: `
当使用 \`new\` 关键字调用构造函数时，发生了四步：

1. **创建一个新对象**: \`const obj = {}\`。
2. **链接原型**: 将新对象的 \`[[Prototype]]\` 链接到构造函数的 \`prototype\`。
   - \`obj.__proto__ = Constructor.prototype\`
3. **绑定 this**: 使用新对象作为上下文执行构造函数。
   - \`const result = Constructor.apply(obj, args)\`
4. **返回对象**: 
   - 如果构造函数显式返回了一个对象，则返回该对象。
   - 否则，返回步骤 1 创建的新对象。

\`\`\`javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
\`\`\`
`
  },
  {
    id: '37',
    title: 'JavaScript 数据类型检测',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: 'typeof, instanceof 与 Object.prototype.toString.call 的对比。',
    tags: ['类型', '基础', '原理'],
    staticAnswer: `
### 1. typeof
- **优点**: 简单，适合检测基本类型 (number, string, boolean, undefined, symbol)。
- **缺点**: 无法区分引用类型。\`typeof null === 'object'\`, \`typeof [] === 'object'\`。

### 2. instanceof
- **原理**: 检查构造函数的 \`prototype\` 是否出现在对象的原型链上。
- **缺点**: 只能检测引用类型。在多窗口（iframe）环境下会失效（因为 Array 构造函数不同）。

### 3. Object.prototype.toString.call()
- **优点**: 最准确，可以区分所有类型。
- **结果**: 返回 \`[object Type]\`。

\`\`\`javascript
const checkType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);
checkType([]); // "Array"
checkType(null); // "Null"
checkType(new Date()); // "Date"
\`\`\`
`
  },
  {
    id: '38',
    title: 'call, apply, bind 的区别',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '如何改变函数执行时的上下文 (this)？',
    tags: ['this', '函数', '原理'],
    staticAnswer: `
### 共同点
都能改变函数内部 \`this\` 的指向。

### 区别
1. **传参方式不同**:
   - \`call(thisArg, arg1, arg2, ...)\`: 参数逐个传递。
   - \`apply(thisArg, [argsArray])\`: 参数作为数组传递。
2. **执行时机不同**:
   - \`call\` 和 \`apply\`: **立即执行**函数。
   - \`bind\`: **返回一个新的函数**，需要手动调用。

### 场景
- **Call**: 对象继承 (\`Parent.call(this)\`)。
- **Apply**: 获取数组最大值 (\`Math.max.apply(null, arr)\`)。
- **Bind**: React 事件处理函数绑定 (\`this.handleClick.bind(this)\`)。
`
  },
  {
    id: '43',
    title: 'var, let, const 的区别',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: '作用域、变量提升与暂时性死区 (TDZ)。',
    tags: ['es6', '基础', '作用域'],
    staticAnswer: `
| 特性 | var | let | const |
| :--- | :--- | :--- | :--- |
| **作用域** | 函数作用域 | 块级作用域 ({}) | 块级作用域 ({}) |
| **变量提升** | 有 (值为 undefined) | 无 (存在 TDZ) | 无 (存在 TDZ) |
| **重复声明** | 允许 | 禁止 | 禁止 |
| **重新赋值** | 允许 | 允许 | 禁止 (常量的引用地址不可变) |

**暂时性死区 (TDZ)**: 在 let/const 声明之前使用变量会报错 \`ReferenceError\`，而 var 会返回 undefined。
`
  },
  {
    id: '56',
    title: '为什么 0.1 + 0.2 !== 0.3',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '解释 IEEE 754 浮点数精度丢失问题。',
    tags: ['数学', '二进制', '精度'],
    staticAnswer: `
### 原因
JavaScript 使用 IEEE 754 双精度浮点数。在二进制中，0.1 和 0.2 都是无限循环小数。当它们相加时，需要截断，导致精度丢失。
- 0.1 + 0.2 实际上等于 \`0.30000000000000004\`。

### 解决方案
1. **toFixed()**: \`(0.1 + 0.2).toFixed(1)\` (返回字符串)。
2. **先转整数**: \`(0.1 * 10 + 0.2 * 10) / 10\`。
3. **第三方库**: 使用 \`decimal.js\` 或 \`big.js\` 处理高精度计算。
4. **Number.EPSILON**: 判断误差是否在允许范围内。
   \`Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON\`
`
  },
  {
    id: '57',
    title: 'ES6 Set 与 WeakSet 的区别',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '垃圾回收与弱引用的应用场景。',
    tags: ['es6', '数据结构', '内存'],
    staticAnswer: `
### Set
- 成员可以是**任何类型**的值。
- 成员是强引用，只要 Set 存在，成员就不会被垃圾回收。
- 可遍历 (\`forEach\`, \`for...of\`)。
- 有 \`size\` 属性。

### WeakSet
- 成员**只能是对象**。
- 成员是**弱引用** (Weak Reference)。如果对象没有其他引用，垃圾回收器会自动回收它，不论它是否在 WeakSet 中。
- **不可遍历**，没有 \`size\` 属性（因为成员随时可能被回收）。
- **场景**: 存储 DOM 节点（防止内存泄漏），或者标记对象是否已被处理。
`
  },
  {
    id: '58',
    title: 'JavaScript 垃圾回收 (GC) 机制',
    category: Category.Performance,
    difficulty: Difficulty.Senior,
    shortDescription: '引用计数与标记清除算法详解。',
    tags: ['内存', 'v8', '原理'],
    staticAnswer: `
### 1. 标记清除 (Mark-and-Sweep) - 主流算法
- **阶段 1 (标记)**: 垃圾回收器从“根”（Roots，如 window, global）开始，遍历所有可达对象并标记。
- **阶段 2 (清除)**: 遍历堆内存，回收所有未被标记的内存空间。

### 2. 引用计数 (Reference Counting) - 较老
- 记录每个对象被引用的次数。次数为 0 则回收。
- **缺点**: 无法处理**循环引用**（A 引用 B，B 引用 A，引用永远不为 0），导致内存泄漏。

### V8 优化
- **分代回收**: 将内存分为**新生代** (存活时间短，用 Scavenge 算法复制清理) 和 **老生代** (存活时间长，用标记清除)。
`
  },
  {
    id: '59',
    title: 'defer vs async 在 script 标签中的区别',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Mid,
    shortDescription: '脚本加载对 DOM 解析的影响。',
    tags: ['html', '性能', '加载'],
    staticAnswer: `
两者都用于异步下载脚本，不会阻塞 HTML 解析，区别在于**执行时机**。

1. **<script>** (普通): 
   - 立即下载并立即执行，会阻塞 HTML 解析。

2. **<script async>**:
   - 异步下载。
   - 下载完毕后**立即执行**，此时会阻塞 HTML 解析。
   - 执行顺序不确定（谁先下完谁先执行）。
   - **适用**: 独立的第三方脚本（统计代码）。

3. **<script defer>**:
   - 异步下载。
   - 等到 HTML **解析完毕** (DOMContentLoaded 之前) 才执行。
   - 严格按照在 HTML 中出现的顺序执行。
   - **适用**: 依赖 DOM 或其他脚本的业务代码。
`
  },
  {
    id: '60',
    title: '手写 Promise.all 实现',
    category: Category.JavaScript,
    difficulty: Difficulty.Senior,
    shortDescription: '考察对异步并发控制的理解。',
    tags: ['手写代码', 'promise', '异步'],
    staticAnswer: `
\`\`\`javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }
    
    let result = [];
    let count = 0;
    
    if (promises.length === 0) resolve(result);

    promises.forEach((p, index) => {
      // 确保 p 是 Promise
      Promise.resolve(p).then(value => {
        result[index] = value;
        count++;
        // 只有当所有 promise 都完成时才 resolve
        if (count === promises.length) {
          resolve(result);
        }
      }).catch(err => {
        // 只要有一个失败，整体立即失败
        reject(err);
      });
    });
  });
}
\`\`\`
`
  },

  // --- HTML & CSS ---
  {
    id: '2',
    title: 'CSS Grid 与 Flexbox 的区别',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '什么时候应该使用 Grid，什么时候使用 Flexbox？',
    tags: ['布局', 'css3', '响应式'],
    staticAnswer: `
### 维度区别
- **Flexbox (弹性盒子)** 是一维布局模型。它主要用于处理一行或一列中的元素排列。
- **CSS Grid (网格)** 是二维布局模型。它可以同时处理行和列。

### 使用场景建议
- 使用 **Flexbox** 当：
  - 你需要对齐元素（垂直或水平）。
  - 内容流向是首要关注点。
  - 你只是在做组件级的布局（如导航栏、按钮组）。
  
- 使用 **Grid** 当：
  - 你需要复杂的二维布局（如整个页面的骨架）。
  - 你希望精确控制行和列的尺寸。
  - 布局结构比内容更重要。
`
  },
  {
    id: '14',
    title: 'BFC (块级格式化上下文)',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Senior,
    shortDescription: 'BFC 是什么，如何触发，以及它解决了什么问题？',
    tags: ['css', '布局', '浮动'],
    staticAnswer: `
### 什么是 BFC?
**Block Formatting Context** 是 Web 页面一块独立的渲染区域，内部的元素渲染不会影响边界以外的元素。

### 如何触发 BFC?
1. \`float\` 不为 none。
2. \`position\` 为 absolute 或 fixed。
3. \`overflow\` 不为 visible (如 hidden, auto)。
4. \`display\` 为 inline-block, table-cell, flex, grid 等。

### BFC 的作用 (解决的问题)
1. **清除浮动**：父元素高度塌陷时，给父元素触发 BFC（如 \`overflow: hidden\`）可以包含浮动元素。
2. **防止 Margin 重叠**：属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。创建新的 BFC 可以阻止重叠。
`
  },
  {
    id: '36',
    title: 'CSS 盒模型详解',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '标准盒模型与 IE 盒模型的区别。',
    tags: ['css', '布局', '基础'],
    staticAnswer: `
### 两种盒模型
1. **标准盒模型 (Content Box)**: \`width\` = 内容的宽度。padding 和 border 会增加元素的总尺寸。
   - 触发: \`box-sizing: content-box\` (默认)。
2. **IE 盒模型 (Border Box)**: \`width\` = 内容 + padding + border。padding 和 border 会向内挤压内容，总尺寸不变。
   - 触发: \`box-sizing: border-box\`。

### 为什么推荐使用 Border Box?
在响应式布局中，我们希望设置了 \`width: 100%\` 后，添加 padding 或 border 不会撑破容器。IE 盒模型 (Border Box) 更符合人类的直觉。

\`\`\`css
/* 推荐的全局重置 */
* {
  box-sizing: border-box;
}
\`\`\`
`
  },
  {
    id: '45',
    title: '移动端 1px 边框问题',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Mid,
    shortDescription: '在高分辨率屏幕 (Retina) 上边框变粗的原因及解法。',
    tags: ['css', '移动端', '适配'],
    staticAnswer: `
### 原因
在 Retina 屏（DPR >= 2）上，逻辑像素 1px 对应物理像素 2px 或 3px，导致看起来边框变粗。

### 解决方案
最通用的方案是 **伪类 + transform 缩放**。

\`\`\`css
.border-1px {
  position: relative;
}
.border-1px::after {
  content: "";
  position: absolute;
  left: 0; top: 0;
  width: 200%; height: 200%;
  border: 1px solid #ccc;
  transform: scale(0.5);
  transform-origin: 0 0;
  box-sizing: border-box;
}
\`\`\`
`
  },
  {
    id: '61',
    title: 'display: none, visibility: hidden, opacity: 0 区别',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '它们都能隐藏元素，但行为完全不同。',
    tags: ['css', '布局', '交互'],
    staticAnswer: `
| 属性 | 空间占用 | 事件响应 (Click) | 重排 (Reflow) | 子元素继承 |
| :--- | :--- | :--- | :--- | :--- |
| **display: none** | 不占用 | 否 | **是** | 随父元素消失 |
| **visibility: hidden** | **占用** | 否 | 否 (仅重绘) | **子元素可复原** (\`visibility: visible\`) |
| **opacity: 0** | **占用** | **是** (依然可点) | 否 (仅重绘) | 随父元素透明 |

**注意**: \`opacity: 0\` 的元素依然可以被 Tab 键聚焦，也可以响应点击事件。
`
  },
  {
    id: '62',
    title: 'z-index 失效的常见原因',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Mid,
    shortDescription: '理解层叠上下文 (Stacking Context)。',
    tags: ['css', 'z-index', '层叠上下文'],
    staticAnswer: `
\`z-index\` 只在**定位元素** (position 不为 static) 上生效。如果发现 \`z-index\` 不起作用，通常是因为：

1. **父级限制**: 父元素建立了层叠上下文（Stacking Context），子元素的 \`z-index\` 无论多大都无法逃出父元素的层级。
2. **没有设置 Position**: 元素是 \`position: static\` (默认值)。
3. **Transform / Opacity**: 元素设置了 \`transform\` 不为 none 或 \`opacity\` 小于 1，会自动创建层叠上下文。

**口诀**: "拼爹"。如果父元素层级低，子元素 z-index 再高也没用。
`
  },

  // --- Vue Ecosystem ---
  {
    id: '8',
    title: 'Vue 3 的响应式原理 vs Vue 2',
    category: Category.Vue,
    difficulty: Difficulty.Senior,
    shortDescription: 'Proxy 与 Object.defineProperty 的区别及优势。',
    tags: ['vue3', 'proxy', '响应式'],
    staticAnswer: `
### Vue 2: Object.defineProperty
- **原理**：递归遍历对象属性，将每个属性转换为 getter/setter。
- **局限性**：
  - 无法检测对象属性的添加或删除（需要 \`Vue.set\`）。
  - 无法检测数组索引的变化（需要重写数组方法）。
  - 初始化时需要深度遍历整个对象，性能开销大。

### Vue 3: Proxy
- **原理**：使用 ES6 的 \`Proxy\` 代理整个对象。
- **优势**：
  - 可以拦截对象的所有操作（包括增删属性、数组索引修改）。
  - **懒代理**：只有访问嵌套对象时才会递归代理，提升了初始化性能。
  - 支持 Map, Set, WeakMap 等数据结构。
`
  },
  {
    id: '21',
    title: 'Vue 生命周期详解',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: 'Vue 实例从创建到销毁的各个阶段及钩子函数。',
    tags: ['vue', '生命周期', 'hooks'],
    staticAnswer: `
### 核心阶段
1. **创建 (Creation)**: 初始化事件和生命周期，注入依赖。
   - \`beforeCreate\`: 实例刚初始化，data/methods 均不可用。
   - \`created\`: 实例创建完成，data/methods 可用，但未挂载 DOM。**常用于异步请求**。

2. **挂载 (Mounting)**: 编译模板，挂载到 DOM。
   - \`beforeMount\`: 模板编译完成，render 函数首次被调用。
   - \`mounted\`: 实例挂载到 DOM，可以操作 DOM 元素。

3. **更新 (Updating)**: 数据变化导致视图重新渲染。
   - \`beforeUpdate\`: 数据已更新，但 DOM 尚未重新渲染。
   - \`updated\`: DOM 已完成重绘。避免在此修改状态，否则可能导致无限循环。

4. **销毁 (Destruction)**: 实例被销毁。
   - \`beforeUnmount\` (Vue3) / \`beforeDestroy\` (Vue2): 实例仍完全可用。**常用于清理定时器、解绑事件**。
   - \`unmounted\` (Vue3) / \`destroyed\` (Vue2): 所有指令解绑，子实例销毁。
`
  },
  {
    id: '35',
    title: 'NextTick 的原理 (Vue)',
    category: Category.Vue,
    difficulty: Difficulty.Senior,
    shortDescription: 'Vue 是如何实现 DOM 异步更新的？',
    tags: ['vue', '源码', '异步'],
    staticAnswer: `
### 作用
在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

### 原理
Vue 在更新 DOM 时是**异步**的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

\`nextTick\` 内部通过降级策略选择异步 API 来执行回调：
1. **Promise.then** (微任务) - 首选。
2. **MutationObserver** (微任务)。
3. **setImmediate** (宏任务)。
4. **setTimeout(fn, 0)** (宏任务) - 兜底。

Vue 优先使用微任务，确保在 UI 重绘之前执行，避免不必要的浏览器重绘。
`
  },
  {
    id: '47',
    title: 'v-model 的实现原理',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '如何在原生标签和自定义组件上实现双向绑定？',
    tags: ['vue', '双向绑定', '语法糖'],
    staticAnswer: `
### 原生标签 (如 input)
\`v-model\` 本质是 \`value\` 属性和 \`input\` 事件的语法糖。

\`\`\`html
<!-- 语法糖 -->
<input v-model="text">

<!-- 等价于 -->
<input 
  :value="text" 
  @input="text = $event.target.value"
>
\`\`\`

### 自定义组件
在 Vue 3 中，默认的 prop 是 \`modelValue\`，默认事件是 \`update:modelValue\`。

\`\`\`html
<!-- 父组件 -->
<MyComponent v-model="count" />

<!-- 子组件 -->
<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>
<button @click="$emit('update:modelValue', modelValue + 1)">+1</button>
\`\`\`
`
  },
  {
    id: '63',
    title: 'Vue 3 中 ref 与 reactive 的区别',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '该如何选择这两种响应式 API？',
    tags: ['vue3', 'ref', 'reactive'],
    staticAnswer: `
### ref
- **适用**: 基本数据类型 (String, Number, Boolean) 和 对象。
- **访问**: JS 中需要 \`.value\`，模板中自动解包（不需要 \`.value\`）。
- **原理**: 如果是对象，内部自动调用 \`reactive\`。

### reactive
- **适用**: 引用类型 (Object, Array, Map, Set)。
- **访问**: 直接访问属性，不需要 \`.value\`。
- **缺点**: 
  - 不能直接赋值整个对象 (\`state = {}\` 会丢失响应性)。
  - 解构后会丢失响应性 (需要用 \`toRefs\`)。

### 建议
官方更推荐**优先使用 \`ref\`**，因为 \`.value\` 显式地表明了这是个响应式数据，且能处理所有类型，避免了 \`reactive\` 的赋值陷阱。
`
  },
  {
    id: '64',
    title: 'Vue 父子组件生命周期执行顺序',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '加载和更新阶段的钩子触发顺序。',
    tags: ['vue', '生命周期', '面试高频'],
    staticAnswer: `
### 1. 加载渲染过程
**父** beforeCreate -> **父** created -> **父** beforeMount -> **子** beforeCreate -> **子** created -> **子** beforeMount -> **子** mounted -> **父** mounted

**记忆口诀**: "父组件先开始，子组件先完成"。因为父组件需要等待子组件挂载完成后，自己才算挂载完成。

### 2. 更新过程
**父** beforeUpdate -> **子** beforeUpdate -> **子** updated -> **父** updated

### 3. 销毁过程
**父** beforeUnmount -> **子** beforeUnmount -> **子** unmounted -> **父** unmounted
`
  },
  {
    id: '65',
    title: 'Pinia vs Vuex',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '为什么 Pinia 成为 Vue 3 的官方推荐状态库？',
    tags: ['vue', '状态管理', 'pinia'],
    staticAnswer: `
### Pinia 的优势
1. **去除了 Mutations**: 只有 State, Getters, Actions。简化了概念。
2. **TypeScript 支持**: 完美的 TS 类型推导，无需像 Vuex 4 那样进行复杂的类型体操。
3. **体积更小**: 约 1KB。
4. **扁平化结构**: 没有嵌套的模块 (modules)，每个 Store 都是独立的，但可以互相引用。
5. **支持 Composition API**: 写法更符合 Vue 3 风格。

Vuex 依然能用，但新项目强烈推荐 Pinia。
`
  },

  // --- React Ecosystem ---
  {
    id: '3',
    title: 'React 协调过程 (Reconciliation)',
    category: Category.React,
    difficulty: Difficulty.Senior,
    shortDescription: '描述 Diff 算法以及虚拟 DOM 更新是如何工作的。',
    tags: ['虚拟 dom', '性能', 'fiber'],
    staticAnswer: `
### 什么是协调？
协调是 React 更新 DOM 的算法。当组件的 props 或 state 发生变化时，React 会创建一个新的 Virtual DOM 树，并将其与旧的树进行比较，以确定如何最有效地更新真实 DOM。

### Diff 算法策略
React 为了将复杂度从 O(n^3) 降低到 O(n)，做了三个假设：
1. **不同类型的元素**：如果根元素类型不同（例如从 \`<div>\` 变为了 \`<span>\`），React 会拆卸旧树并构建新树。
2. **Key 属性**：开发者可以通过 \`key\` prop 来暗示哪些子元素在不同的渲染下能保持稳定。
3. **同级比较**：React 只会比较同一层级的节点，不会跨层级比较。
`
  },
  {
    id: '12',
    title: 'React Hooks 的使用限制',
    category: Category.React,
    difficulty: Difficulty.Mid,
    shortDescription: '为什么 Hooks 不能在循环或条件语句中调用？',
    tags: ['hooks', '原理', 'react'],
    staticAnswer: `
### 两个核心规则
1. **只在最顶层使用 Hooks**：不要在循环，条件或嵌套函数中调用 Hook。
2. **只在 React 函数中调用 Hooks**：即函数组件或自定义 Hooks 中。

### 原因解析
React 依靠 **Hooks 的调用顺序** 来关联 state 和对应的 useState 调用。
React 内部维护了一个链表（或数组）来存储每个组件的 Hooks 数据。
如果顺序改变，React 就无法确定哪个 state 对应哪个变量，导致 Bug。
`
  },
  {
    id: '34',
    title: 'React setState 是同步还是异步？',
    category: Category.React,
    difficulty: Difficulty.Senior,
    shortDescription: 'React 18 前后的行为差异及批处理机制。',
    tags: ['react', '状态', '原理'],
    staticAnswer: `
### React 18 之前
- **异步 (合成事件/生命周期中)**: 为了性能优化，React 会进行**批处理 (Batching)**。多次 setState 会合并为一次更新。
- **同步 (原生事件/setTimeout中)**: 会打破批处理，setState 后立即更新 DOM。

### React 18 及以后
- **自动批处理 (Automatic Batching)**: 无论在哪里（包括 setTimeout, Promise），React 默认都会进行批处理，因此表现为**异步**。
`
  },
  {
    id: '66',
    title: 'useEffect vs useLayoutEffect',
    category: Category.React,
    difficulty: Difficulty.Senior,
    shortDescription: '两者执行时机的关键差异。',
    tags: ['react', 'hooks', '渲染'],
    staticAnswer: `
### useEffect
- **执行时机**: 在浏览器完成布局与绘制**之后**，异步执行。
- **场景**: 数据获取、订阅事件、不影响布局的操作。
- **优点**: 不阻塞浏览器渲染，用户体验好。

### useLayoutEffect
- **执行时机**: 在 DOM 变更后，浏览器执行绘制**之前**，同步执行。
- **场景**: 需要在浏览器重绘前测量 DOM 尺寸、修改 DOM 布局以防止闪烁。
- **缺点**: 会阻塞视觉更新，导致 UI 渲染卡顿。

**结论**: 默认用 \`useEffect\`，只有当出现 UI 闪烁问题时才尝试 \`useLayoutEffect\`。
`
  },
  {
    id: '67',
    title: 'React 类组件 vs 函数组件',
    category: Category.React,
    difficulty: Difficulty.Mid,
    shortDescription: '除了语法不同，它们在思维模式上有什么区别？',
    tags: ['react', '组件', '设计'],
    staticAnswer: `
### 类组件 (Class)
- **思维**: OOP (面向对象)。
- **State**: 维护一个可变的 \`this.state\`。
- **特性**: 有生命周期钩子 (\`componentDidMount\` 等)。
- **缺点**: 逻辑复用难 (Mixin/HOC)，\`this\` 指向让人困惑。

### 函数组件 (Function) + Hooks
- **思维**: FP (函数式编程)。**"Capture the Value"** (捕获渲染时的值)。
- **State**: 每次渲染都有独立的 props 和 state (闭包特性)。
- **特性**: 使用 Hooks 模拟生命周期和状态。
- **优点**: 代码更简洁，逻辑更容易复用 (Custom Hooks)。
`
  },
  {
    id: '68',
    title: '什么是 React 合成事件 (SyntheticEvent)？',
    category: Category.React,
    difficulty: Difficulty.Mid,
    shortDescription: 'React 为什么不直接使用原生 DOM 事件？',
    tags: ['react', '事件', '原理'],
    staticAnswer: `
### 定义
React 在原生事件基础上封装了一层中间层，称为合成事件。
\`onClick\` 接收到的不是原生的 Event 对象，而是 React 的 \`SyntheticEvent\`。

### 目的
1. **跨浏览器兼容**: 抹平了不同浏览器（如 IE）的事件差异。
2. **性能优化**: React 使用**事件委托**机制。它不会把事件绑定到具体的 DOM 节点上，而是统一绑定到 \`root\` 根节点上。React 内部维护一个映射表来分发事件。

### 注意
从 React 17 开始，事件委托挂载在 \`root\` 节点，而不是 \`document\`，这有利于微前端架构下的多 React 版本共存。
`
  },
  {
    id: '69',
    title: 'React Fiber 架构简介',
    category: Category.React,
    difficulty: Difficulty.Senior,
    shortDescription: 'React 16 引入 Fiber 是为了解决什么性能瓶颈？',
    tags: ['react', 'fiber', '架构'],
    staticAnswer: `
### 痛点 (Stack Reconciler)
在 React 15 中，更新过程是**同步且不可中断**的。如果组件树很大，Diff 计算会占用主线程太久，导致页面掉帧、卡顿，无法响应用户输入。

### 解决方案 (Fiber Reconciler)
Fiber 将渲染工作分割成一个个小的**工作单元 (Unit of Work)**。

### 核心特性
1. **任务切片 (Time Slicing)**: 将大任务拆解，每执行完一个小单元，检查剩余时间。如果时间不够，就将控制权交还给浏览器。
2. **优先级控制**: 能够优先处理高优先级任务（如用户输入、动画），延后处理低优先级任务（如数据请求）。
3. **可中断/恢复**: 渲染过程可以被暂停、中止或重新开始。
`
  },

  // --- Network & Security ---
  {
    id: '6',
    title: '浏览器输入 URL 后发生了什么？',
    category: Category.Network,
    difficulty: Difficulty.Mid,
    shortDescription: '从网络请求到页面渲染的完整过程。',
    tags: ['http', 'dns', '渲染'],
    staticAnswer: `
### 网络阶段
1. **DNS 解析**：浏览器缓存 -> 系统缓存 -> 路由器缓存 -> ISP DNS 服务器 -> 递归查询，最终获取 IP 地址。
2. **TCP 连接**：进行三次握手 (SYN, SYN+ACK, ACK) 建立连接。如果是 HTTPS，还需要进行 TLS/SSL 握手。
3. **发送 HTTP 请求**：浏览器构建请求报文发送给服务器。
4. **服务器处理与响应**：服务器处理请求并返回 HTML。

### 渲染阶段 (Critical Rendering Path)
1. **解析 HTML**：构建 DOM 树。
2. **解析 CSS**：构建 CSSOM 树。
3. **构建渲染树 (Render Tree)**：DOM 树 + CSSOM 树，排除不可见元素（如 \`display: none\`）。
4. **布局 (Layout/Reflow)**：计算每个节点在屏幕上的确切位置和大小。
5. **绘制 (Paint)**：填充像素（颜色、阴影、边框等）。
6. **合成 (Composite)**：将不同的图层合并，显示在屏幕上。
`
  },
  {
    id: '26',
    title: '浏览器缓存策略',
    category: Category.Network,
    difficulty: Difficulty.Senior,
    shortDescription: '强缓存与协商缓存的运作机制。',
    tags: ['缓存', 'http', '性能'],
    staticAnswer: `
### 1. 强缓存 (Strong Cache)
- 浏览器直接从本地缓存读取，不向服务器发送请求。状态码 **200 (from memory/disk cache)**。
- **Cache-Control** (HTTP/1.1): \`max-age=3600\` (秒)。优先级高。
- **Expires** (HTTP/1.0): 绝对时间戳。

### 2. 协商缓存 (Negotiated Cache)
- 强缓存失效后，浏览器发送请求询问服务器资源是否更新。
- **Last-Modified / If-Modified-Since**: 基于最后修改时间。精度只到秒。
- **Etag / If-None-Match**: 基于文件内容哈希。精度更高，但计算消耗大。
- 如果未修改，服务器返回 **304 Not Modified**，浏览器读取缓存。如果修改了，返回 200 和新资源。
`
  },
  {
    id: '70',
    title: 'HTTP/3 (QUIC) 解决了什么问题？',
    category: Category.Network,
    difficulty: Difficulty.Senior,
    shortDescription: '为什么 Google 要基于 UDP 发明 QUIC 协议？',
    tags: ['http3', 'quic', '网络'],
    staticAnswer: `
### HTTP/2 的缺陷
HTTP/2 虽然有多路复用，但它建立在 TCP 之上。**TCP 的队头阻塞 (Head-of-Line Blocking)** 依然存在：如果 TCP 数据包在传输中丢失一个，整个连接的所有流都必须等待重传，导致所有请求被阻塞。

### HTTP/3 (QUIC)
- **基于 UDP**: 抛弃 TCP，在 UDP 上层实现可靠传输。
- **解决队头阻塞**: 不同的流之间真正独立。一个流丢包，不会影响其他流。
- **0-RTT 建连**: 首次连接 1-RTT，恢复连接 0-RTT（极快）。
- **连接迁移**: 切换网络（如 Wi-Fi 变 4G）时，不需要重新握手（基于 Connection ID 而非 IP）。
`
  },
  {
    id: '71',
    title: 'WebSocket 原理',
    category: Category.Network,
    difficulty: Difficulty.Mid,
    shortDescription: '如何实现全双工通信？与 HTTP 有什么关系？',
    tags: ['websocket', '实时', '协议'],
    staticAnswer: `
### 什么是 WebSocket？
一种在单个 TCP 连接上进行**全双工**通信的协议。服务器可以主动向客户端推送数据。

### 建立过程
1. **握手**: 客户端发起一个 HTTP 请求，携带头部 \`Upgrade: websocket\` 和 \`Connection: Upgrade\`。
2. **升级**: 服务器响应 101 Switching Protocols，连接升级为 WebSocket 连接。
3. **通信**: 之后的数据传输不再遵循 HTTP 协议，而是 WebSocket 的帧格式。
4. **心跳**: 为了防止连接断开，通常需要实现心跳检测 (Ping/Pong)。
`
  },
  {
    id: '72',
    title: 'Cookie, Session, Token, JWT 鉴权详解',
    category: Category.Security,
    difficulty: Difficulty.Senior,
    shortDescription: '各种认证方式的优缺点对比。',
    tags: ['认证', 'jwt', '安全'],
    staticAnswer: `
### 1. Cookie + Session
- **流程**: 用户登录 -> 服务端生成 Session，存入内存/Redis -> 返回 SessionId -> 浏览器存入 Cookie -> 后续请求带 Cookie。
- **缺点**: 服务器有状态（内存开销大，分布式集群需要 Session 共享），CSRF 风险。

### 2. Token
- 类似于 SessionId，但不一定非要存在 Cookie 中（可以存 localStorage）。

### 3. JWT (JSON Web Token)
- **流程**: 用户登录 -> 服务端用密钥签发一个包含用户信息的 JSON 对象 (Token) -> 返回给前端。
- **特点**: **无状态**。服务器不需要查库验证，只需要校验签名是否正确。
- **缺点**: Token 一旦签发，在有效期内无法撤销（除非做黑名单）。体积比 SessionId 大。
`
  },

  // --- Browser & Performance ---
  {
    id: '30',
    title: '前端性能优化手段汇总',
    category: Category.Performance,
    difficulty: Difficulty.Senior,
    shortDescription: '从网络、资源、渲染等多个维度综述。',
    tags: ['优化', '加载速度', '体验'],
    staticAnswer: `
### 1. 网络层面
- **减少请求数**: 合并 CSS/JS，雪碧图 (Sprite)，Base64 图片。
- **减小资源体积**: Gzip/Brotli 压缩，图片压缩 (WebP)，Tree Shaking。
- **使用 CDN**: 就近加载资源。
- **缓存**: 合理利用强缓存和协商缓存。

### 2. 渲染层面
- **CSS 放头部，JS 放底部** (或使用 defer/async)。
- **减少重排 (Reflow) 和重绘 (Repaint)**: 批量修改 DOM，使用 transform 代替 top/left 动画。
- **图片懒加载 (Lazy Load)**: 视口外的图片暂不加载。

### 3. 代码层面
- **按需加载 (Code Splitting)**: 路由懒加载，组件懒加载。
- **防抖与节流**: 限制高频事件。
- **虚拟列表**: 长列表只渲染可视区域。
`
  },
  {
    id: '73',
    title: 'Web Vitals 核心指标 (LCP, FID, CLS)',
    category: Category.Performance,
    difficulty: Difficulty.Senior,
    shortDescription: 'Google 定义的网页体验核心三剑客。',
    tags: ['性能', 'web vitals', '指标'],
    staticAnswer: `
### 1. LCP (Largest Contentful Paint) - 加载速度
- 衡量**最大内容**（通常是大图或 H1）渲染完成的时间。
- **标准**: < 2.5s 为优秀。

### 2. FID (First Input Delay) - 交互性
- 衡量用户首次交互（点击链接、按钮）到浏览器实际处理该事件的延迟。
- **标准**: < 100ms 为优秀。
- *注：INP (Interaction to Next Paint) 即将取代 FID。*

### 3. CLS (Cumulative Layout Shift) - 视觉稳定性
- 衡量页面在加载期间元素发生的意外位移（防止误触）。
- **标准**: < 0.1 为优秀。
`
  },
  {
    id: '74',
    title: 'Service Worker 与 PWA',
    category: Category.Network,
    difficulty: Difficulty.Senior,
    shortDescription: '如何让 Web 应用像原生 App 一样离线工作？',
    tags: ['pwa', 'service worker', '离线'],
    staticAnswer: `
### Service Worker
- 运行在浏览器后台的**独立线程**，无法直接访问 DOM。
- 充当**网络代理**。可以拦截所有网络请求。

### PWA (Progressive Web App)
- 利用 Service Worker 实现**离线缓存**（Cache API）。即使断网也能访问页面。
- 支持**添加到主屏幕** (Manifest)。
- 支持**后台同步**和**消息推送**。
`
  },
  {
    id: '75',
    title: '什么是虚拟列表 (Virtual List)？',
    category: Category.Performance,
    difficulty: Difficulty.Mid,
    shortDescription: '如何流畅渲染 10 万条数据？',
    tags: ['性能', '长列表', '算法'],
    staticAnswer: `
### 原理
如果一次性渲染 10 万个 DOM 节点，浏览器会卡死。
虚拟列表**只渲染可视区域**（Viewport）内的元素，以及上下少量的缓冲区元素。

### 实现步骤
1. 计算可视区域能显示多少个元素 (visibleCount)。
2. 监听滚动事件，根据 \`scrollTop\` 计算当前起始索引 (startIndex)。
3. 截取数据 \`data.slice(startIndex, startIndex + visibleCount)\` 进行渲染。
4. 使用 \`padding-top\` 或 \`transform\` 撑开容器高度，模拟完整列表的滚动条体验。
`
  },

  // --- Engineering & Webpack ---
  {
    id: '44',
    title: 'Webpack 热更新 (HMR) 原理',
    category: Category.SystemDesign,
    difficulty: Difficulty.Senior,
    shortDescription: '如何在不刷新页面的情况下更新模块？',
    tags: ['webpack', '工程化', '源码'],
    staticAnswer: `
**HMR (Hot Module Replacement)** 允许在运行时更新各种模块，而无需完全刷新。

### 核心流程
1. **文件监听**: Webpack 编译器 (compiler) 监听文件变化，重新编译。
2. **WebSocket 通信**: Server 向 Browser 推送更新消息（hash 和 manifest）。
3. **下载补丁**: Browser 运行时 (HMR Runtime) 请求更新的 chunk (JSONP)。
4. **模块替换**: HMR Runtime 根据依赖关系，将旧模块替换为新模块，并执行回调函数。
`
  },
  {
    id: '76',
    title: 'Tree Shaking 原理',
    category: Category.SystemDesign,
    difficulty: Difficulty.Mid,
    shortDescription: '如何去除无用的死代码 (Dead Code)？',
    tags: ['webpack', '优化', 'esm'],
    staticAnswer: `
### 什么是 Tree Shaking?
像摇树一样，把枯萎的叶子（没用到的代码）摇下来。

### 核心条件
**必须使用 ES6 Module (import/export)**。因为 ESM 是静态分析的，在编译时就能确定模块的依赖关系。CommonJS 是动态的，无法 Tree Shaking。

### 过程
1. **Webpack**: 标记未引用的导出 (unused exports)。
2. **Terser/UglifyJS**: 在代码压缩阶段，识别并删除这些未引用的代码。
`
  },
  {
    id: '77',
    title: 'Vite 为什么比 Webpack 快？',
    category: Category.SystemDesign,
    difficulty: Difficulty.Mid,
    shortDescription: '开发环境构建工具的革新。',
    tags: ['vite', 'webpack', 'esbuild'],
    staticAnswer: `
### Webpack (Bundler)
- **启动慢**: 必须先分析整个依赖图，编译打包完所有模块，才能启动开发服务器。项目越大启动越慢。

### Vite (No-Bundler)
1. **冷启动快**: 利用浏览器原生支持 **ES Module**。Vite 不需要打包，直接启动服务器。当浏览器请求模块时，Vite 再进行按需编译。
2. **编译快**: 使用 **esbuild** (Go 语言编写) 进行预构建依赖，比 JS 编写的 Webpack 快 10-100 倍。
3. **热更新快**: HMR 也是基于 ESM，修改哪里编译哪里，与项目大小无关。
`
  },

  // --- TypeScript ---
  {
    id: '33',
    title: 'TypeScript 中的 interface 与 type',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '两者非常相似，应该如何选择？',
    tags: ['typescript', '类型', '语法'],
    staticAnswer: `
### 相同点
- 都可以描述对象或函数。
- 都允许扩展 (interface 用 \`extends\`, type 用 \`&\`)。

### 不同点
1. **Interface (接口)**:
   - 只能描述对象形状。
   - 支持**声明合并 (Declaration Merging)**: 同名接口会自动合并（常用于扩展第三方库类型）。
2. **Type (类型别名)**:
   - 更强大。可以描述基本类型、联合类型 (Union Types)、元组 (Tuple)。
   - 不支持声明合并。

### 建议
- 编写库或公共 API 时，优先用 **interface** (方便使用者扩展)。
- 定义复杂类型（如联合类型 \`type Status = 'success' | 'fail'\`）时，用 **type**。
`
  },
  {
    id: '78',
    title: 'TypeScript: any, unknown, never 的区别',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: 'TypeScript 顶级类型与底层类型解析。',
    tags: ['typescript', '类型', '安全'],
    staticAnswer: `
### any
- **含义**: 关闭类型检查。可以赋值给任何类型，也可以被赋值任何类型。
- **缺点**: 失去了 TS 的意义，"AnyScript"。

### unknown
- **含义**: 安全版的 any。任何值都可以赋给 unknown。
- **限制**: unknown **不能**直接赋值给其他类型，也**不能**调用其方法。必须先进行**类型断言**或**类型收窄** (Type Narrowing) 才能使用。

### never
- **含义**: 永远不存在的值。
- **场景**: 抛出异常的函数返回值、死循环函数返回值、联合类型的穷尽性检查 (Exhaustiveness checking)。
`
  },
  {
    id: '79',
    title: 'TypeScript 泛型 (Generics) 理解',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '如何编写可重用且类型灵活的代码？',
    tags: ['typescript', '泛型', '进阶'],
    staticAnswer: `
### 概念
泛型就像是**类型变量**。在定义函数、接口或类时，不预先指定具体的类型，而是在使用时再指定类型。

### 示例
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用
const n = identity<number>(10); // T 是 number
const s = identity<string>("hi"); // T 是 string
\`\`\`

### 作用
1. 保持类型的完整性（输入和输出类型一致）。
2. 极大提高代码复用性。
`
  },

  // --- Algorithm & Hand Coding ---
  {
    id: '80',
    title: '手写发布订阅模式 (EventEmitter)',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '实现 on, emit, off, once 方法。',
    tags: ['手写代码', '设计模式', '事件'],
    staticAnswer: `
\`\`\`javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, handler) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(handler);
  }

  emit(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach(fn => fn.apply(this, args));
    }
  }

  off(type, handler) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(fn => fn !== handler);
    }
  }

  once(type, handler) {
    const wrapper = (...args) => {
      handler.apply(this, args);
      this.off(type, wrapper);
    };
    this.on(type, wrapper);
  }
}
\`\`\`
`
  },
  {
    id: '81',
    title: '手写数组扁平化 (Flat)',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: '将多维数组转化为一维数组。',
    tags: ['手写代码', '递归', '数组'],
    staticAnswer: `
### 方法 1: ES6 flat
\`\`\`javascript
const arr = [1, [2, [3, 4]]];
arr.flat(Infinity);
\`\`\`

### 方法 2: 递归
\`\`\`javascript
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

### 方法 3: Reduce
\`\`\`javascript
const flatten = (arr) => {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
\`\`\`
`
  },
  {
    id: '82',
    title: '手写函数柯里化 (Currying)',
    category: Category.JavaScript,
    difficulty: Difficulty.Senior,
    shortDescription: '将多参数函数转换为一系列单参数函数。',
    tags: ['手写代码', '函数式编程', '递归'],
    staticAnswer: `
### 定义
\`add(1, 2, 3)\` 变为 \`add(1)(2)(3)\`。

### 实现
核心思路：比较当前传入参数个数 (\`args.length\`) 与原函数参数个数 (\`fn.length\`)。

\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // 参数够了，执行原函数
      return fn.apply(this, args);
    } else {
      // 参数不够，返回新函数等待剩余参数
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

function sum(a, b, c) { return a + b + c; }
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
\`\`\`
`
  },
  {
    id: '5',
    title: '设计一个可扩展的新闻流系统 (News Feed)',
    category: Category.SystemDesign,
    difficulty: Difficulty.Senior,
    shortDescription: '针对类似 Twitter 或 Facebook 的无限滚动信息流的高层架构设计。',
    tags: ['架构', 'api 设计', '缓存'],
    staticAnswer: `
### 1. 需求分析
- **功能**：用户发布帖子、关注他人、查看混合了关注人动态的时间线。
- **非功能**：高可用性、低延迟（非常重要）、最终一致性。

### 2. API 设计
- \`POST /v1/tweet\`: 发布内容。
- \`GET /v1/feed?cursor={id}&limit=20\`: 获取信息流（使用游标分页而非 offset，提高性能）。

### 3. 核心架构模式
**推模式 (Push Model / Fan-out on Write):**
- 当用户发帖时，立即将帖子 ID 推送到所有粉丝的 "Feed Cache" 列表中。
- **优点**：读取非常快（O(1)），因为 Feed 是预先计算好的。
- **缺点**：大 V（如拥有百万粉丝）发帖时，写入压力巨大（惊群效应）。

**拉模式 (Pull Model / Fan-out on Read):**
- 用户发帖只写入自己的数据库。
- 粉丝读取 Feed 时，系统查询所有关注的人并按时间排序聚合。
- **优点**：写入快。
- **缺点**：读取慢，计算量大。

### 4. 混合策略 (Hybrid)
- 对于普通用户，使用**推模式**。
- 对于大 V (名人)，使用**拉模式**。
- 用户的 Feed = 缓存中的推模式内容 + 大 V 的拉模式内容。
`
  },
  // --- More Fundamental & Misc ---
  {
    id: '83',
    title: 'CommonJS 循环引用问题',
    category: Category.JavaScript,
    difficulty: Difficulty.Senior,
    shortDescription: 'A 引用 B，B 引用 A，Node.js 如何处理？',
    tags: ['commonjs', 'node', '模块化'],
    staticAnswer: `
### 处理机制
CommonJS 的核心在于：**模块加载了多少，就输出多少**。

当 \`main.js\` 加载 \`a.js\`，\`a.js\` 又加载 \`b.js\`，\`b.js\` 又反过来加载 \`a.js\` 时：
1. \`a.js\` 只执行了一部分，导出了部分对象。
2. \`b.js\` 拿到的 \`a.js\` 的导出对象是**不完整的**。
3. \`b.js\` 继续执行完，导出。
4. \`a.js\` 拿到 \`b.js\` 的完整导出，继续执行剩下的代码。

不会报错，但需要注意拿到的可能是未初始化完全的值。
`
  },
  {
    id: '84',
    title: 'requestAnimationFrame vs setTimeout',
    category: Category.Performance,
    difficulty: Difficulty.Mid,
    shortDescription: '为什么动画推荐使用 rAF？',
    tags: ['动画', '性能', 'api'],
    staticAnswer: `
### setTimeout
- 按照指定时间执行。
- 可能会丢帧：如果回调执行时间过长，或者设定的时间与屏幕刷新频率（通常 60Hz，即 16.6ms）不匹配，会导致卡顿。

### requestAnimationFrame (rAF)
- **由浏览器控制**: 浏览器会在下一次重绘之前调用。
- **同步刷新率**: 自动紧跟屏幕刷新频率 (60Hz)。
- **节能**: 当页面隐藏或最小化时，rAF 会自动暂停，节省 CPU。
- **自带节流**: 在高频事件中表现更好。
`
  },
  {
    id: '85',
    title: 'Iterator (迭代器) 与 Generator (生成器)',
    category: Category.JavaScript,
    difficulty: Difficulty.Senior,
    shortDescription: 'ES6 异步编程的基石。',
    tags: ['es6', '异步', '原理'],
    staticAnswer: `
### Iterator
- 一种接口，为各种不同的数据结构提供统一的访问机制。
- 任何数据结构只要部署 \`Symbol.iterator\` 接口，就可以用 \`for...of\` 遍历。

### Generator
- 一个状态机，封装了多个内部状态。
- 使用 \`function*\` 声明，内部使用 \`yield\` 暂停执行。
- 执行 Generator 函数会返回一个遍历器对象。
- **async/await 的原理**: 其实就是 Generator + 自动执行器 (co 模块) 的语法糖。
`
  },
  {
    id: '86',
    title: '移动端 300ms 点击延迟',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '历史遗留问题与解决方案。',
    tags: ['移动端', '交互', '历史'],
    staticAnswer: `
### 原因
早期的移动浏览器，当用户点击屏幕时，会等待 300ms 看看用户是不是要进行**双击缩放**。

### 解决方案
1. **禁用缩放 (现代标准做法)**:
   \`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\`
   只要设置了 viewport，现代浏览器就会移除 300ms 延迟。
2. **FastClick 库 (老项目)**:
   监听 \`touchend\`，拦截 \`click\`，自定义触发点击。
`
  },
  {
    id: '87',
    title: 'CSS 预处理器 (Sass/Less) 的优缺点',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '为什么我们不再写原生 CSS？',
    tags: ['css', 'sass', '工程化'],
    staticAnswer: `
### 优点
1. **嵌套语法 (Nesting)**: 结构清晰，反映 DOM 结构。
2. **变量 (Variables)**: 统一管理颜色、字体。
3. **Mixin (混合)**: 复用 CSS 代码块。
4. **函数与运算**: 可以进行简单的计算。

### 缺点
1. 需要编译 (增加构建步骤)。
2. 嵌套过深会导致生成的 CSS 选择器权重过大，且文件体积膨胀。

*注：现代 CSS 已经原生支持了变量 (--var) 和嵌套 (Nesting 草案)，预处理器的部分功能正在被取代。*
`
  },
  {
    id: '88',
    title: 'React 错误边界 (Error Boundaries)',
    category: Category.React,
    difficulty: Difficulty.Mid,
    shortDescription: '如何防止整个应用因为一个组件报错而白屏？',
    tags: ['react', '错误处理', '稳定性'],
    staticAnswer: `
### 概念
错误边界是一种 React 组件，它可以**捕获其子组件树中发生的 JavaScript 错误**，并记录这些错误，同时展示一个降级 UI (Fallback UI)，而不是渲染崩溃的组件树。

### 实现
必须使用 **Class 组件**，并定义以下生命周期：
1. \`static getDerivedStateFromError(error)\`: 渲染备用 UI。
2. \`componentDidCatch(error, info)\`: 记录错误日志。

### 注意
错误边界**无法**捕获：事件处理器内部的错误、异步代码、服务端渲染、它自己抛出的错误。
`
  },
  {
    id: '89',
    title: 'HTTPS 中间人攻击 (MITM)',
    category: Category.Security,
    difficulty: Difficulty.Senior,
    shortDescription: 'HTTPS 是绝对安全的吗？',
    tags: ['安全', '网络', 'https'],
    staticAnswer: `
### 原理
攻击者拦截客户端与服务端的通信，伪装成服务端与客户端握手，同时伪装成客户端与服务端握手。

### HTTPS 如何防范？
依靠 **数字证书 (CA)**。
浏览器内置了受信任的根证书列表。当服务器发来证书时，浏览器会验证：
1. 证书是否由受信任的 CA 签发（沿着证书链向上验证）。
2. 证书是否被篡改（验证数字签名）。
3. 域名是否匹配。

如果攻击者没有私钥，就无法伪造合法的证书，浏览器会报“不安全”警告。但如果用户手动点击“继续访问”或安装了攻击者的根证书（如抓包工具 Charles），则会被攻击。
`
  },
  {
    id: '90',
    title: '设计模式：单例模式 (Singleton)',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: '保证一个类仅有一个实例。',
    tags: ['设计模式', '基础', '架构'],
    staticAnswer: `
### 场景
全局缓存、全局状态管理 (Vuex/Redux Store)、全局唯一的弹窗。

### 实现 (JS)
\`\`\`javascript
class Singleton {
  constructor(name) {
    this.name = name;
  }
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  }
}

const a = Singleton.getInstance('A');
const b = Singleton.getInstance('B');
console.log(a === b); // true
\`\`\`
`
  },
  {
    id: '91',
    title: 'Vue 3 Teleport (传送门)',
    category: Category.Vue,
    difficulty: Difficulty.Junior,
    shortDescription: '如何将组件内容渲染到 DOM 树的其他位置？',
    tags: ['vue3', 'dom', '组件'],
    staticAnswer: `
### 问题背景
有时候组件的逻辑属于当前组件，但从样式或 DOM 结构上看，它应该显示在页面的其他地方（如 \`body\` 根节点）。比如：全屏模态框 (Modal)、通知 (Toast)、Tooltip。

### 解决方案
使用 \`<Teleport to="body">\` 将子节点“传送”到 \`body\` 标签下，但**组件逻辑结构**依然保持父子关系（数据传递、事件冒泡依然正常工作）。
`
  },
  {
    id: '92',
    title: 'Virtual DOM 真的比原生 DOM 操作快吗？',
    category: Category.React,
    difficulty: Difficulty.Senior,
    shortDescription: '辨析虚拟 DOM 的核心价值与性能误区。',
    tags: ['虚拟dom', '性能', '原理'],
    staticAnswer: `
### 这是一个误区
Virtual DOM **并不一定**比原生 DOM 操作快。
- **原生 DOM**: 如果你能精确地知道哪里变了，直接修改那个 DOM 节点是最快的。
- **Virtual DOM**: 创建 JS 对象 -> Diff 算法对比 -> 更新 DOM。多了一层计算，必然比极致优化的原生操作慢。

### 为什么还需要 Virtual DOM？
1. **可维护性**: 开发者无需手动操作 DOM，专注于数据状态 (Declarative vs Imperative)。
2. **跨平台**: Virtual DOM 只是 JS 对象，可以渲染到浏览器，也可以渲染到 Native (React Native, Weex)。
3. **保证性能下限**: 虽然不是最快，但它利用 Diff 算法和批处理，避免了开发者写出极其低效的 DOM 操作。
`
  },
  {
    id: '93',
    title: 'Vue Router: Hash 模式 vs History 模式',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '前端路由的两种实现方式及其服务器配置要求。',
    tags: ['路由', '浏览器api', 'vue-router'],
    staticAnswer: `
### Hash 模式
- **URL**: \`http://example.com/#/about\`
- **原理**: 基于 \`window.onhashchange\` 事件。
- **优点**: 兼容性好，**不需要服务器配置**。
- **缺点**: URL 带 # 号，不够美观。

### History 模式
- **URL**: \`http://example.com/about\`
- **原理**: 基于 HTML5 \`history.pushState\` 和 \`history.replaceState\`。
- **优点**: URL 干净美观。
- **缺点**: **需要服务器配置**。
  - 如果用户直接刷新 \`/about\`，浏览器会向服务器请求 \`about\` 文件夹，导致 404。
  - 服务器必须配置所有路由都返回 \`index.html\` (Try_files)。
`
  },
  {
    id: '94',
    title: 'keep-alive 组件的作用',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '如何缓存组件实例？LRU 算法简介。',
    tags: ['vue', '缓存', '性能'],
    staticAnswer: `
### 作用
\`<keep-alive>\` 是一个内置组件，用于缓存包裹在其中的动态组件实例，而不是销毁它们。

### 生命周期
- 当组件进入缓存：触发 \`activated\` 钩子。
- 当组件离开缓存：触发 \`deactivated\` 钩子（代替 destroyed）。

### 原理 (LRU 算法)
Least Recently Used。当缓存数超过 \`max\` 时，会销毁**最近最久未使用**的那个组件实例，为新实例腾出空间。
`
  },
  {
    id: '95',
    title: 'SPA (单页面应用) vs MPA (多页面应用)',
    category: Category.SystemDesign,
    difficulty: Difficulty.Mid,
    shortDescription: '两者的区别、优缺点及适用场景。',
    tags: ['架构', 'spa', 'seo'],
    staticAnswer: `
### SPA (Single Page Application)
- **原理**: 只有一个主 HTML 文件。页面跳转通过 JS 修改 URL 并动态渲染组件，不重新加载页面。
- **优点**: 用户体验好，流畅，无白屏。服务器压力小。
- **缺点**: SEO 差，首屏加载慢。

### MPA (Multi Page Application)
- **原理**: 每次跳转都向服务器请求新的 HTML。
- **优点**: SEO 极好，首屏加载快。
- **缺点**: 页面切换慢，有白屏。
`
  },
  {
    id: '96',
    title: 'Vue 列表渲染中 key 的作用',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '为什么不建议使用 index 作为 key？',
    tags: ['虚拟dom', 'diff算法', '性能'],
    staticAnswer: `
### 作用
\`key\` 是虚拟 DOM 对象的唯一标识。Diff 算法通过 \`key\` 来判断新旧节点是否是同一个节点，从而决定是**复用**还是**重新创建**。

### 为什么不能用 Index？
如果列表顺序发生变化（如在头部插入一项），所有项的 index 都会改变。
1. **性能损耗**: Vue 误以为所有节点都变了，导致不必要的更新。
2. **状态错乱**: 如果子组件有内部状态（如输入框内容），状态会残留到错误的位置。
`
  },
  {
    id: '97',
    title: '什么是微前端 (Micro-Frontends)？',
    category: Category.SystemDesign,
    difficulty: Difficulty.Senior,
    shortDescription: '巨石应用的拆分之道。',
    tags: ['架构', '微前端', 'qiankun'],
    staticAnswer: `
### 概念
将一个大型前端应用拆分成多个独立的微应用。每个微应用可以独立开发、独立部署、甚至使用不同的技术栈 (Vue, React, Angular)。

### 实现方案
1. **Iframe**: 
   - 优点: 绝对隔离，简单。
   - 缺点: 通信难，弹窗无法覆盖，刷新丢失状态。
2. **Qiankun (基于 Single-SPA)**:
   - 国内最流行的方案。
   - **JS 沙箱**: 隔离全局变量。
   - **样式隔离**: 确保子应用样式不冲突。
3. **Module Federation (Webpack 5)**: 
   - 允许在运行时动态加载其他构建的模块。
`
  },
  {
    id: '98',
    title: 'Git Rebase vs Merge',
    category: Category.SystemDesign,
    difficulty: Difficulty.Mid,
    shortDescription: '版本控制中的合并策略。',
    tags: ['git', '工具', '协作'],
    staticAnswer: `
### Merge (合并)
- **行为**: 生成一个新的 Merge Commit。保留了完整的分支历史和时间线。
- **优点**: 记录真实的历史，包括什么时候合并的。
- **缺点**: 提交记录线显得杂乱（尤其是多人协作时）。

### Rebase (变基)
- **行为**: 将当前分支的 commit "搬运" 到目标分支的最新 commit 之后。
- **优点**: 提交记录是一条直线，非常干净。
- **缺点**: 会修改历史 Commit ID。**绝对不能在公共分支（如 master）上使用**，否则会导致其他人冲突。
`
  },
  {
    id: '99',
    title: 'Babel 编译原理',
    category: Category.SystemDesign,
    difficulty: Difficulty.Senior,
    shortDescription: '如何将 ES6+ 代码转换为 ES5？',
    tags: ['编译', 'ast', 'babel'],
    staticAnswer: `
### 三大步骤
1. **解析 (Parse)**: 将源代码解析成 **AST (抽象语法树)**。
   - 词法分析 (Tokenizing) -> 语法分析 (Parsing)。
2. **转换 (Transform)**: 遍历 AST，根据插件的规则（如将 \`const\` 转为 \`var\`，箭头函数转普通函数），增删改节点，生成新的 AST。这是 Babel 插件工作的阶段。
3. **生成 (Generate)**: 将新的 AST 转换回 JavaScript 代码字符串，并生成 Source Map。
`
  },
  {
    id: '100',
    title: 'Vue 3 Scoped CSS 原理',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '如何实现组件样式隔离？',
    tags: ['vue', 'css', '原理'],
    staticAnswer: `
### 效果
在 \`<style scoped>\` 中写的样式只会应用到当前组件。

### 原理 (PostCSS)
Vue Loader 在编译时：
1. 给 HTML 标签添加一个唯一的自定义属性: \`data-v-hash\` (如 \`data-v-f3f3eg9\`)。
2. 给 CSS 选择器添加对应的属性选择器: \`.button\` 变为 \`.button[data-v-f3f3eg9]\`。

这样，只有拥有该属性的元素才会应用该样式，从而实现隔离。
`
  }
];

// --- Components ---

const CategoryIcon = ({ category, className }: { category: Category; className?: string }) => {
  switch (category) {
    case Category.HTML_CSS: return <Layers className={className} />;
    case Category.JavaScript: return <Code2 className={className} />;
    case Category.React: return <Cpu className={className} />;
    case Category.Vue: return <FileType className={className} />;
    case Category.SystemDesign: return <BrainCircuit className={className} />;
    case Category.Performance: return <Zap className={className} />;
    case Category.Security: return <ShieldCheck className={className} />;
    case Category.Network: return <Globe className={className} />;
    default: return <BookOpen className={className} />;
  }
};

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const colors = {
    [Difficulty.Junior]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [Difficulty.Mid]: 'bg-amber-100 text-amber-700 border-amber-200',
    [Difficulty.Senior]: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level}
    </span>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [questionStates, setQuestionStates] = useState<QuestionState>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter questions
  const filteredQuestions = QUESTIONS_DB.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (id: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: !prev[id]?.isOpen
      }
    }));
  };

  const fetchAIAnswer = async (question: Question) => {
    // Set loading state
    setQuestionStates(prev => ({
      ...prev,
      [question.id]: { ...prev[question.id], isLoading: true, isOpen: true, error: null }
    }));

    try {
      const text = await getQuestionExplanation(question);
      setQuestionStates(prev => ({
        ...prev,
        [question.id]: { 
          ...prev[question.id], 
          isLoading: false, 
          explanation: text 
        }
      }));
    } catch (err) {
      setQuestionStates(prev => ({
        ...prev,
        [question.id]: { 
          ...prev[question.id], 
          isLoading: false, 
          error: "无法生成解析。请确保您的 API Key 有效并重试。" 
        }
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 md:flex-row overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-bold text-slate-900">
           <BrainCircuit className="text-indigo-600" />
           <span>前端大师 AI</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">前端<span className="text-indigo-400">AI</span></h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <button
            onClick={() => { setSelectedCategory('All'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen size={18} />
            <span className="font-medium">所有题目</span>
          </button>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">分类</div>
          
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-slate-800 text-white border-l-4 border-indigo-500' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <CategoryIcon category={cat} className={`h-4 w-4 ${selectedCategory === cat ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-sm">{cat}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">由 Gemini 2.5 驱动</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              基础答案即时展示，AI 解析提供深度定制。
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedCategory === 'All' ? '题库面板' : selectedCategory}</h2>
            <p className="text-slate-500 text-sm mt-1">
              共 {filteredQuestions.length} 道题目
            </p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="搜索主题或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>
        </header>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50 custom-scrollbar pb-20">
          
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">未找到题目</h3>
              <p className="text-slate-500 mt-2">请尝试调整搜索条件。</p>
            </div>
          ) : (
            filteredQuestions.map(q => {
              const state = questionStates[q.id] || { isOpen: false, isLoading: false, explanation: null, error: null };
              
              // Decide what content to show: AI explanation (if generated) OR static answer (default)
              const contentToShow = state.explanation || q.staticAnswer;
              
              return (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                  {/* Card Header / Question Title */}
                  <div 
                    onClick={() => toggleQuestion(q.id)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <DifficultyBadge level={q.difficulty} />
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <CategoryIcon category={q.category} className="w-3 h-3" />
                          {q.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{q.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{q.shortDescription}</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           fetchAIAnswer(q);
                         }}
                         className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${state.explanation ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                       >
                         <Sparkles size={16} />
                         {state.explanation ? '重新生成' : 'AI 深度解析'}
                       </button>
                       <div className={`transform transition-transform duration-200 text-slate-400 ${state.isOpen ? 'rotate-180' : ''}`}>
                         <ChevronDown size={20} />
                       </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {(state.isOpen) && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      {state.isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                          <p className="text-indigo-800 font-medium">正在咨询 Gemini...</p>
                          <p className="text-slate-500 text-sm mt-1">正在为您生成定制化的深度解析。</p>
                        </div>
                      ) : state.error ? (
                        <div className="p-6 text-red-600 bg-red-50 flex items-center gap-3">
                           <span className="font-semibold">错误:</span> {state.error}
                        </div>
                      ) : (
                        <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                          {/* Banner indicating source */}
                          <div className={`mb-6 px-4 py-2 rounded-lg text-xs font-medium inline-block ${state.explanation ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'}`}>
                            {state.explanation ? '✨ Gemini 深度解析内容' : '📝 基础参考答案'}
                          </div>

                          <div className="prose prose-slate prose-indigo max-w-none">
                            <MarkdownRenderer content={contentToShow} />
                          </div>
                          
                          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
                             <div className="flex gap-2">
                               {q.tags.map(tag => (
                                 <span key={tag} className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded">#{tag}</span>
                               ))}
                             </div>
                             {!state.explanation && (
                               <div className="text-xs text-slate-500 italic">
                                 觉得不够详细？点击上方 "AI 深度解析" 获取完整讲解。
                               </div>
                             )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default App;