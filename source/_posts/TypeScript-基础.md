---
title: TypeScript-基础
date: 2021-07-19 11:43:54
tags: 基础
categories: TypeScript
---

##### JavaScript 的特性

- 它没有类型约束，一个变量可能初始化时是字符串，又被赋值为数字。
- 存在大量的隐士转换，变量类型难以确定。
- 原型上的属性或方法可以在运行时被修改。
- 解释性语言，没有编译阶段，属于动态类型。（运行时报错）

##### TypeScript 的特性

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- 静态类型，「类型」是 TypeScript 最核心的特性，运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查。
- 弱类型，完全兼容 JavaScript ，不会修改 JavaScript 运行时的特性。

## 基础

### 原始数据类型

JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。
原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol 和 ES10 中的新类型 BigInt。

#### 布尔值

布尔值时最基础的数据类型。

```ts
let show: boolean = false;
// 编译通过
```

需要注意的是，构造函数 `Boolean` 创造的是一个 `Boolean` 对象,并不是布尔值。

```ts
let createBoolean: Boolean = new Boolean(true);
//  Boolean {true}
```

直接调用会 `Boolean` 则可以返回 `boolean` 值。

```ts
let createBoolean: boolean = Boolean(true);
// true
```

#### 数值

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

#### 字符串

```ts
let name: string = "Tree";
```

#### 空值

`JavaScript` 没有空值(Viid)的概念，在 `TypeScript` 中，可以使用 `void` 表示没有任何返回值的函数：

```ts
function count(): void {
  let num: number = 0;
  num++;
}
```

声明没有返回值函数存在意义，声明 `void` 变量则没有意义，只能将它赋值给 `undefined` 和 `null`

```ts
let unusable: void = undefined;
let unvalue: void = null;
```

#### Null 和 Undefined

在 `TypeScript` 中，可以使用 `null` 和 `undefined` 来定义这两个原始数据类型：

```ts
let u: undefined = undefined;
let n: null = null;
```

与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 **任意** 类型的变量：

```ts
// 这样不会报错
let num: number = undefined;
```

### 任意值

普通类型，在赋值过程中改变类型是不被允许的，。
如果是 `any` 类型，则允许被赋值为**任意类型**，声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。

任意值上访问任何熟悉都是允许的。

```ts
let number: string = "1";
number = 1;

let anyThing: any = "hello";
console.log(anyThing.number);
console.log(anyThing.number.age);
```

也允许调用任何方法：

```ts
let anyThing: any = "sleep";
anyThing.time("1000");
anyThing.time("1000").do();
```

**变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型**

```ts
let something;
something = "1";
something = 1;
```
