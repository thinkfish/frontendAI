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

// --- Data Seed (Expanded with Static Answers) ---
const QUESTIONS_DB: Question[] = [
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

### 代码对比

**Flexbox 居中:**
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* 水平 */
  align-items: center;     /* 垂直 */
}
\`\`\`

**Grid 简单的 2x2 布局:**
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100px 100px;
  gap: 10px;
}
\`\`\`
`
  },
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

### React Fiber
在 React 16+ 中，引入了 **Fiber** 架构。
- 它将渲染工作分解为小的单元（Unit of work）。
- 允许 React **暂停、中止或复用**渲染工作。
- 使得 React 能够优先处理高优先级的更新（如用户输入），延后低优先级的更新（如数据获取）。
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

### 5. 存储与缓存
- **数据库**: Cassandra 或 DynamoDB (高写入吞吐量)。
- **缓存**: Redis (存储 Feed ID 列表)。
`
  },
  {
    id: '6',
    title: '浏览器输入 URL 后发生了什么？',
    category: Category.Network,
    difficulty: Difficulty.Mid,
    shortDescription: '从网络请求到页面渲染的完整过程。',
    tags: ['http', 'dns', '渲染'],
    staticAnswer: `
这是一个经典面试题，可以大致分为网络阶段和渲染阶段。

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
    id: '7',
    title: 'XSS 与 CSRF 攻击',
    category: Category.Security,
    difficulty: Difficulty.Mid,
    shortDescription: '解释两者的区别，以及在现代前端应用中如何防御。',
    tags: ['安全', '认证', 'owasp'],
    staticAnswer: `
### XSS (跨站脚本攻击)
- **原理**：攻击者在目标网站注入恶意脚本（JS），当用户访问时脚本执行，窃取 Cookie 或 Token。
- **类型**：存储型（存入 DB）、反射型（通过 URL 参数）、DOM 型。
- **防御**：
  - **转义输入输出**：不要信任用户提交的任何内容。
  - **CSP (内容安全策略)**：限制资源加载来源。
  - **HttpOnly Cookie**：防止 JS 读取 Cookie。

### CSRF (跨站请求伪造)
- **原理**：攻击者诱导已登录用户访问恶意网站，恶意网站在用户不知情的情况下向目标网站发送请求（利用浏览器会自动携带 Cookie 的特性）。
- **防御**：
  - **CSRF Token**：服务器生成随机 Token，每次请求必须携带（攻击者无法获取）。
  - **SameSite Cookie**：设置 \`SameSite=Strict\` 或 \`Lax\`，限制第三方 Cookie 发送。
  - **验证 Referer/Origin**。
`
  },
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

\`\`\`javascript
// 简易 Proxy 示例
const handler = {
  get(target, key) {
    track(target, key); // 收集依赖
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key); // 触发更新
    return true;
  }
};
const proxy = new Proxy(data, handler);
\`\`\`
`
  },
  {
    id: '9',
    title: '语义化 HTML',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '为什么语义化 HTML 对无障碍性 (Accessibility) 和 SEO 很重要？',
    tags: ['无障碍', 'seo', 'html5'],
    staticAnswer: `
### 什么是语义化？
语义化意味着使用恰当的 HTML 标签来描述内容的含义，而不仅仅是它的外观。例如，使用 \`<header>\`、\`<article>\`、\`<footer>\` 而不是通篇使用 \`<div>\`。

### 为什么重要？
1. **SEO (搜索引擎优化)**：爬虫更容易理解页面结构和重要内容，有助于排名。
2. **无障碍性 (A11y)**：屏幕阅读器（Screen Readers）依赖语义标签为视障用户导航。例如，用户可以直接跳转到 \`<nav>\` 或 \`<main>\`。
3. **可维护性**：代码更易读，开发者一眼就能看懂代码块的功能。
4. **移动端支持**：通常语义化标签在移动设备上有更好的默认表现。
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
    id: '11',
    title: 'HTTP/2 与 HTTP/1.1 的区别',
    category: Category.Network,
    difficulty: Difficulty.Senior,
    shortDescription: '多路复用、头部压缩等特性的解析。',
    tags: ['http2', '性能', '网络'],
    staticAnswer: `
### 1. 二进制分帧 (Binary Framing)
HTTP/2 是二进制协议，而 HTTP/1.1 是文本协议。HTTP/2 将传输信息分割为更小的消息和帧，并对它们采用二进制编码。

### 2. 多路复用 (Multiplexing)
这是最重要的改进。
- **HTTP/1.1**: 浏览器限制同一域名下的并发请求（通常 6 个）。队头阻塞（Head-of-line blocking）严重。
- **HTTP/2**: 允许在单一的 TCP 连接上同时发送多个请求和响应。消息可以乱序发送，根据流 ID 重新组装。

### 3. 头部压缩 (Header Compression)
使用 HPACK 算法压缩头部。客户端和服务器同时维护一张头信息表，后续请求只需发送差异数据，大大减少了数据量。

### 4. 服务端推送 (Server Push)
服务器可以对一个客户端请求发送多个响应。例如，客户端请求 \`index.html\`，服务器知道它需要 \`style.css\`，可以主动推送，无需客户端再次请求。
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

\`\`\`javascript
// 渲染 1
useState('A') // 索引 0
useState('B') // 索引 1

// 渲染 2 (假设有个条件判断导致第一个被跳过)
// useState('B') -> React 以为这是索引 0 的 state ('A')，导致数据错乱！
\`\`\`

如果顺序改变，React 就无法确定哪个 state 对应哪个变量，导致 Bug。
`
  },
  {
    id: '13',
    title: '防抖 (Debounce) 与 节流 (Throttle)',
    category: Category.Performance,
    difficulty: Difficulty.Junior,
    shortDescription: '如何优化高频触发的事件处理？',
    tags: ['性能', 'javascript', '工具函数'],
    staticAnswer: `
### 防抖 (Debounce)
- **定义**：事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。
- **场景**：搜索框输入（用户输完才发请求）、窗口大小调整（停止调整后才计算）。
- **效果**：将多次执行变为最后一次执行。

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
}
\`\`\`

### 节流 (Throttle)
- **定义**：规定在一个单位时间内，只能触发一次函数。
- **场景**：滚动加载（Scroll）、射击游戏的开火频率。
- **效果**：将高频执行变为每隔一段时间执行一次。

\`\`\`javascript
function throttle(fn, delay) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  }
}
\`\`\`
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
3. **自适应两栏布局**：浮动元素覆盖在普通流元素之上，给普通流元素触发 BFC，它就不会被浮动元素覆盖，而是紧挨着它。
`
  },
  {
    id: '15',
    title: 'Webpack Loader vs Plugin',
    category: Category.SystemDesign,
    difficulty: Difficulty.Mid,
    shortDescription: '构建工具中的核心概念区分。',
    tags: ['webpack', '工程化', '构建'],
    staticAnswer: `
### Loader (加载器)
- **作用**：Webpack 本身只能理解 JavaScript 和 JSON。Loader 让 Webpack 能够处理其他类型的文件（CSS, 图片, TS, Vue 等），并将它们转换为有效模块。
- **运行时机**：在打包文件之前，对单个文件进行转换。
- **例子**：\`css-loader\`, \`style-loader\`, \`babel-loader\`, \`ts-loader\`。
- **配置**：通常在 \`module.rules\` 中配置。

### Plugin (插件)
- **作用**：功能范围更广，从打包优化、资源管理到环境变量注入。Plugin 可以监听 Webpack 生命周期中的特定事件（Hooks），执行自定义逻辑。
- **运行时机**：贯穿整个构建过程。
- **例子**：\`HtmlWebpackPlugin\` (生成 HTML), \`CleanWebpackPlugin\` (清理构建目录), \`MiniCssExtractPlugin\` (提取 CSS 文件)。
- **配置**：在 \`plugins\` 数组中 \`new Plugin()\`.
`
  },
  {
    id: '16',
    title: 'HTTPS 加密原理',
    category: Category.Security,
    difficulty: Difficulty.Senior,
    shortDescription: '对称加密与非对称加密是如何配合工作的？',
    tags: ['加密', 'ssl/tls', '网络'],
    staticAnswer: `
HTTPS = HTTP + SSL/TLS。它结合了对称加密和非对称加密。

### 握手过程 (简化版)
1. **客户端 Hello**：发送支持的加密算法列表。
2. **服务端 Hello**：选择加密算法，发送**数字证书**（包含**公钥**）。
3. **验证证书**：客户端验证证书的合法性（CA 签名、有效期）。
4. **密钥交换 (非对称加密)**：
   - 客户端生成一个随机的**预主密钥 (Pre-master secret)**。
   - 使用服务器的**公钥**加密该密钥，并发送给服务器。
   - 服务器使用自己的**私钥**解密，得到预主密钥。
5. **生成会话密钥**：双方根据预主密钥和随机数生成最终的**会话密钥 (Session Key)**。
6. **通信 (对称加密)**：之后的 HTTP 数据传输都使用这个会话密钥进行**对称加密**传输，因为对称加密速度快得多。

### 总结
- **非对称加密**：用于握手阶段，安全地交换密钥。
- **对称加密**：用于传输阶段，高效地加密数据。
`
  },
  {
    id: '17',
    title: 'Cookie, LocalStorage, SessionStorage',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: '浏览器存储方案的对比。',
    tags: ['存储', '缓存', '浏览器'],
    staticAnswer: `
### 对比维度

| 特性 | Cookie | LocalStorage | SessionStorage |
| :--- | :--- | :--- | :--- |
| **数据生命周期** | 可设置失效时间，默认关闭浏览器失效 | 永久有效，除非手动删除 | 仅在当前会话(Tab页)有效，关闭页面清除 |
| **大小限制** | 约 4KB | 约 5MB | 约 5MB |
| **与服务器通信** | 每次 HTTP 请求都会自动携带 | 不参与服务器通信 | 不参与服务器通信 |
| **使用场景** | Session ID, Token, 用户偏好 | 长期保存的数据(如主题色, 购物车) | 敏感账号信息, 表单临时数据 |
| **API 易用性** | 较难 (document.cookie) | 简单 (getItem/setItem) | 简单 (getItem/setItem) |
`
  },
  {
    id: '18',
    title: 'Promise.all vs Promise.allSettled',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '处理并发 Promise 时的行为差异。',
    tags: ['es6', 'promise', '异步'],
    staticAnswer: `
### Promise.all
- **行为**：接收一个 Promise 数组。只有当**所有** Promise 都成功时，才返回成功结果数组。
- **失败处理 (Fast Fail)**：只要有**一个** Promise 失败，整个 \`Promise.all\` 立即 reject，丢弃其他已成功或进行中的结果。
- **场景**：多个请求有依赖关系，或者必须全部成功才有意义（如加载页面的基础配置和用户信息）。

### Promise.allSettled (ES2020)
- **行为**：等待**所有** Promise 完成（无论成功或失败）。
- **结果**：返回一个对象数组，每个对象包含 \`status\` ('fulfilled' 或 'rejected') 和对应的 \`value\` 或 \`reason\`。
- **场景**：不需要所有请求都成功，只需知道每个请求的最终状态（如批量上传图片，几张失败不影响其他）。

\`\`\`javascript
// allSettled 返回结构
[
  { status: 'fulfilled', value: 42 },
  { status: 'rejected', reason: 'Error' }
]
\`\`\`
`
  },
  {
    id: '19',
    title: 'Vue 中的 Computed vs Watch',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '计算属性与侦听器的使用场景。',
    tags: ['vue', '响应式', '最佳实践'],
    staticAnswer: `
### Computed (计算属性)
- **特性**：支持**缓存**。只有依赖的数据发生变化时，才会重新计算。否则直接返回缓存值。
- **设计目的**：用于根据现有数据派生出新的数据。一个数据受多个数据影响（多对一）。
- **场景**：格式化价格、过滤列表、根据 props 计算样式。
- **代码**：不要在 computed 中进行异步操作或副作用。

### Watch (侦听器)
- **特性**：不支持缓存。数据变了就执行回调。
- **设计目的**：用于观察一个数据的变化，并执行相应的**副作用**（Side Effects）。
- **场景**：一个数据变化影响多个数据（一对多）、当数据变化时执行异步操作（API 请求）、操作 DOM。

**总结**：能用 computed 实现的，尽量用 computed（因为有缓存，性能更好）。需要异步或开销大的操作时用 watch。
`
  },
  {
    id: '20',
    title: 'TCP 三次握手与四次挥手',
    category: Category.Network,
    difficulty: Difficulty.Senior,
    shortDescription: '建立和断开连接的详细状态流转。',
    tags: ['tcp', '网络', '协议'],
    staticAnswer: `
### 三次握手 (建立连接)
1. **SYN**: 客户端发送 SYN (seq=x)，进入 SYN_SEND 状态。
2. **SYN + ACK**: 服务端收到 SYN，发送 SYN (seq=y) + ACK (ack=x+1)，进入 SYN_RECV 状态。
3. **ACK**: 客户端收到，发送 ACK (ack=y+1)，进入 ESTABLISHED。服务端收到后也进入 ESTABLISHED。
*为什么是三次？* 为了防止已失效的连接请求报文段突然又传送到了服务端，产生错误。

### 四次挥手 (断开连接)
1. **FIN**: 客户端发送 FIN，进入 FIN_WAIT_1。
2. **ACK**: 服务端收到 FIN，发送 ACK，进入 CLOSE_WAIT。（此时服务端还能发送数据）。
3. **FIN**: 服务端数据发完了，发送 FIN，进入 LAST_ACK。
4. **ACK**: 客户端收到 FIN，发送 ACK，进入 TIME_WAIT（等待 2MSL），然后关闭。服务端收到 ACK 后关闭。
*为什么是四次？* 因为 TCP 是全双工的，方向的关闭需要单独确认。服务端收到 FIN 时可能还有数据没发完，所以先回 ACK，等发完了再发 FIN。
`
  },
  // --- New Questions Extracted from Reference ---
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
    id: '22',
    title: 'GET 和 POST 请求的区别',
    category: Category.Network,
    difficulty: Difficulty.Junior,
    shortDescription: '不仅仅是参数位置不同，从语义和行为上分析。',
    tags: ['http', 'restful', '网络'],
    staticAnswer: `
### 1. 语义与用途
- **GET**: 用于**获取**资源。操作应该是**安全**且**幂等**的（多次请求结果一致，不产生副作用）。
- **POST**: 用于**提交**资源。通常用于创建新资源或产生副作用。

### 2. 参数传递
- **GET**: 参数拼接到 URL 查询字符串中。有长度限制（浏览器限制），且不适合传递敏感数据。
- **POST**: 参数放在请求体 (Request Body) 中。无大小限制，支持多种格式（JSON, FormData）。

### 3. 缓存行为
- **GET**: 浏览器会默认主动缓存 GET 请求。
- **POST**: 默认不会缓存，除非手动设置 Cache-Control。

### 4. TCP 行为 (细节)
- GET 通常产生一个 TCP 数据包。
- POST 可能产生两个（先发 Header，服务器响应 100 Continue，再发 Body），但这取决于浏览器实现。
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
    id: '24',
    title: 'Vue 组件通信方式汇总',
    category: Category.Vue,
    difficulty: Difficulty.Senior,
    shortDescription: '父子、兄弟、跨层级组件如何高效通信？',
    tags: ['vue', 'props', 'vuex'],
    staticAnswer: `
### 1. 父子通信
- **Props (父传子)**: 单向数据流。
- **$emit (子传父)**: 子组件触发事件，父组件监听。
- **$refs / $parent / $children**: 直接访问实例（耦合度高，不推荐）。

### 2. 兄弟/任意组件通信
- **EventBus (事件总线)**: 创建一个空的 Vue 实例作为中央事件总线（Vue3 中已被移除，需用 mitt 等库）。
- **Vuex / Pinia**: 全局状态管理，最适合复杂应用。

### 3. 跨层级通信
- **Provide / Inject**: 祖先组件提供数据，后代组件注入。适合插件开发或深层组件传值。
- **$attrs / $listeners**: 透传属性和事件。
`
  },
  {
    id: '25',
    title: '什么是跨域 (CORS)？如何解决？',
    category: Category.Network,
    difficulty: Difficulty.Mid,
    shortDescription: '浏览器的同源策略限制及解决方案。',
    tags: ['安全', 'cors', '代理'],
    staticAnswer: `
### 同源策略
浏览器为了安全，限制脚本发起跨域请求。**协议、域名、端口**三者必须完全一致，否则就是跨域。

### 解决方案
1. **CORS (跨域资源共享)**:
   - 最标准的解决方案。
   - **后端**设置响应头: \`Access-Control-Allow-Origin: *\` 或指定域名。
   - 对于复杂请求（PUT, DELETE, 带自定义头），浏览器会先发 **OPTIONS** 预检请求。

2. **Nginx 反向代理 / 开发服务器代理**:
   - 在开发环境（Vite/Webpack）配置 \`proxy\`。
   - 原理：浏览器 -> 代理服务器 (同源) -> 目标服务器。服务器之间没有同源策略限制。

3. **JSONP**:
   - 利用 \`<script>\` 标签不受跨域限制的特性。仅支持 GET 请求。现在已很少使用。
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
    id: '28',
    title: '箭头函数 vs 普通函数',
    category: Category.JavaScript,
    difficulty: Difficulty.Junior,
    shortDescription: 'this 指向、arguments、构造能力等方面的区别。',
    tags: ['es6', '函数', 'this'],
    staticAnswer: `
### 1. This 指向
- **普通函数**: \`this\` 取决于调用方式（谁调用指向谁）。
- **箭头函数**: 没有自己的 \`this\`。它捕获**定义时**上下文的 \`this\`（词法作用域）。

### 2. 构造函数
- **箭头函数**: 不能作为构造函数，不能使用 \`new\`。因为它没有 \`prototype\` 属性。

### 3. arguments 对象
- **箭头函数**: 没有 \`arguments\` 对象。可以使用 Rest 参数 (\`...args\`) 代替。

\`\`\`javascript
const obj = {
  name: 'Alice',
  sayHi: function() { console.log(this.name); }, // 'Alice'
  sayBye: () => { console.log(this.name); }      // undefined (指向 window/global)
};
\`\`\`
`
  },
  {
    id: '29',
    title: 'MVVM 模式是什么？',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: 'Model-View-ViewModel 架构解析。',
    tags: ['架构', '设计模式', 'vue'],
    staticAnswer: `
### 概念
MVVM 是 **Model-View-ViewModel** 的缩写。Vue 和 React (某种程度上) 均受此启发。

1. **Model (模型)**: 数据层。负责处理业务逻辑和与服务器交互。
2. **View (视图)**: UI 界面。HTML/CSS。
3. **ViewModel (视图模型)**: 核心桥梁（Vue 实例）。
   - 它通过 **Data Bindings (数据绑定)** 将 Model 的变化自动更新到 View。
   - 它通过 **DOM Listeners (DOM 监听)** 将 View 的用户交互更新回 Model。

### 优势
- **低耦合**: View 可以独立于 Model 变化。
- **可重用性**: ViewModel 逻辑可以重用。
- **双向绑定**: 开发者只需关注数据处理，无需繁琐的手动 DOM 操作 (jQuery 时代痛点)。
`
  },
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
    id: '31',
    title: 'CSS 选择器优先级 (权重)',
    category: Category.HTML_CSS,
    difficulty: Difficulty.Junior,
    shortDescription: '如何计算选择器的特异性 (Specificity)？',
    tags: ['css', '样式', '基础'],
    staticAnswer: `
### 权重计算规则 (A, B, C, D)
优先级由高到低：
1. **!important**: 最高优先级，覆盖一切。
2. **内联样式 (Inline Styles)**: 权重 (1, 0, 0, 0)。
3. **ID 选择器**: 权重 (0, 1, 0, 0)。
4. **类、伪类、属性选择器**: 权重 (0, 0, 1, 0)。
5. **标签、伪元素选择器**: 权重 (0, 0, 0, 1)。
6. **通配符 (*)**: 权重 0。

### 示例
- \`#nav .list li a:hover\` 
  - ID=1, Class=1, Tag=2 -> 权重: 112
- \`.container .content div\`
  - Class=2, Tag=1 -> 权重: 021

**结论**: ID 选择器权重极高，尽量少用 ID 定义样式，多用 Class 以保持灵活性。
`
  },
  {
    id: '32',
    title: 'Vue 3 Composition API vs Options API',
    category: Category.Vue,
    difficulty: Difficulty.Mid,
    shortDescription: '为什么 Vue 3 引入了组合式 API？',
    tags: ['vue3', 'api', '逻辑复用'],
    staticAnswer: `
### Options API (Vue 2 风格)
- 代码按选项组织: \`data\`, \`methods\`, \`mounted\`, \`computed\`。
- **缺点**: 当组件逻辑变复杂时，相关联的逻辑（如搜索功能）被分散在 data, methods, watch 中，导致“反复横跳”，难以维护和复用。

### Composition API (Vue 3 风格)
- 代码按**逻辑关注点**组织: 使用 \`setup\`, \`ref\`, \`reactive\`。
- **优点**:
  1. **更好的逻辑复用**: 使用 Hooks (Composables) 替代 Mixins（解决了命名冲突和来源不清晰的问题）。
  2. **更好的类型推导**: 对 TypeScript 支持极佳。
  3. **代码组织**: 相关业务逻辑代码写在一起。
`
  },
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
- 一般 React 组件 Props 常用 interface。
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
- **异步 (合成事件/生命周期中)**: 为了性能优化，React 会进行**批处理 (Batching)**。多次 setState 会合并为一次更新。因此 \`console.log\` 往往拿不到最新值。
- **同步 (原生事件/setTimeout中)**: 会打破批处理，setState 后立即更新 DOM。

### React 18 及以后
- **自动批处理 (Automatic Batching)**: 无论在哪里（包括 setTimeout, Promise），React 默认都会进行批处理，因此表现为**异步**。

### 如何获取最新值？
1. 使用 \`useEffect\` 监听 state 变化。
2. 在 \`setState\` 的回调函数中获取（Class 组件）。
3. 使用 \`useRef\` 保存引用。
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
  // --- New Questions Extracted from KanCloud Reference ---
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
    id: '39',
    title: '事件冒泡与事件委托',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '如何利用事件机制优化性能？',
    tags: ['dom', '事件', '性能'],
    staticAnswer: `
### 事件冒泡 (Event Bubbling)
当元素上的事件被触发时，该事件会向上传播（冒泡）到父元素，直到 window 对象。

### 事件委托 (Event Delegation)
利用冒泡机制，将子元素的事件监听器绑定到父元素上，而不是给每个子元素单独绑定。

**优点**:
1. **节省内存**: 减少了事件处理器的数量。
2. **动态元素支持**: 对于后续动态添加的子元素，无需重新绑定事件。

\`\`\`javascript
// 委托给 ul
document.querySelector('ul').addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    console.log('点击了:', e.target.innerText);
  }
});
\`\`\`
`
  },
  {
    id: '40',
    title: 'Vue 中 v-if 与 v-show 的区别',
    category: Category.Vue,
    difficulty: Difficulty.Junior,
    shortDescription: '在什么场景下应该选择哪一个？',
    tags: ['vue', '指令', '性能'],
    staticAnswer: `
### 实现原理
- **v-if**: 真正的条件渲染。如果条件为假，元素**不会被渲染**到 DOM 中（销毁/重建）。
- **v-show**: 始终渲染并保留在 DOM 中，只是简单地切换 CSS 属性 \`display: none\`。

### 性能对比
- **v-if**: 切换开销大（涉及 DOM 插入/删除）。
- **v-show**: 初始渲染开销大（即使隐藏也要渲染），但切换开销极小。

### 选型
- 如果需要频繁切换：用 **v-show** (如 Tab 切换)。
- 如果运行时条件很少改变：用 **v-if** (如用户权限控制)。
`
  },
  {
    id: '41',
    title: 'HTTP 常见状态码',
    category: Category.Network,
    difficulty: Difficulty.Junior,
    shortDescription: '301/302, 401/403, 502/504 的具体含义。',
    tags: ['http', '状态码', '网络'],
    staticAnswer: `
### 2xx (成功)
- **200 OK**: 请求成功。

### 3xx (重定向)
- **301 Moved Permanently**: 永久重定向。SEO 会将权重转移到新 URL。
- **302 Found**: 临时重定向。
- **304 Not Modified**: 资源未修改，读取缓存。

### 4xx (客户端错误)
- **400 Bad Request**: 请求参数有误。
- **401 Unauthorized**: 未登录/未认证。
- **403 Forbidden**: 已认证但无权限访问。
- **404 Not Found**: 资源不存在。

### 5xx (服务端错误)
- **500 Internal Server Error**: 服务器内部错误。
- **502 Bad Gateway**: 网关错误（通常是上游服务器无响应）。
- **504 Gateway Timeout**: 网关超时。
`
  },
  {
    id: '42',
    title: 'CommonJS 与 ES6 Modules 的区别',
    category: Category.JavaScript,
    difficulty: Difficulty.Mid,
    shortDescription: '模块化规范的运行时与编译时差异。',
    tags: ['模块化', '工程化', 'node'],
    staticAnswer: `
### 1. 语法差异
- **CommonJS**: \`require / module.exports\` (Node.js 默认)。
- **ESM**: \`import / export\` (浏览器标准)。

### 2. 加载机制
- **CommonJS**: **运行时加载**。模块输出的是一个对象的**深拷贝**。即便模块内部变化，外部引用的值不会变（除非重新 require）。
- **ESM**: **编译时输出接口**。模块输出的是值的**引用 (Live Binding)**。模块内部值变化，外部引用的值也会随之变化。

### 3. 同步 vs 异步
- **CommonJS**: 同步加载（适合服务器磁盘读取）。
- **ESM**: 支持异步加载（适合浏览器网络请求）。
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

如果模块没有实现 HMR 接口（如 React Refresh 帮你做了），则会回退到页面刷新。
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