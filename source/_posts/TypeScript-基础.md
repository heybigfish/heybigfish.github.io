---
title: TypeScript-基础
date: 2021-07-19 11:43:54
tags: 基础
categories: TypeScript
---

**JavaScript 的特性**

- 它没有类型约束，一个变量可能初始化时是字符串，又被赋值为数字。
- 存在大量的隐式转换，变量类型难以确定。
- 原型上的属性或方法可以在运行时被修改。
- 解释性语言，没有编译阶段，属于动态类型。（运行时报错）

**TypeScript 的特性**

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

### 类型推断

`TypeScript` 会在没有明确的指定类型的时候,根据赋值推测出一个类型。
如果定义的时候没有赋值，都会被推断成 any 类型而完全不被类型检查

```ts
let num;
num = "7";
num = 7;
```

### 联合类型

联合类型,表示取值可以为多种类型中的一种。

```ts
let num: number | string;
num = "1";
num = 1;
```

**访问联合类型的属性或方法**
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```ts
function getLength(e: string | number) {
  return e.length;
}
// 编译失败。
```

`length` 不是`number`和`string`的共有属性，所以会报错。

```ts
function toString(e: string | number) {
  return e.toString();
}
// 编译成功，toString() 是共有属性。
```

当联合类型的变量在赋值的时候，会根据类型推断出一个类型。

```ts
let num: string | number;
num = "1";
console.log(num.length); // 编译成功，类型推断为 string，访问length成功。
num = 1;
console.log(num.length); // 编译报错，类型推断为 number，访问length失败。
```

### 对象的类型 - 接口 (Interfaces)

在 `TypeScript` 中，使用接口来定义对象的类型，结构。

```ts
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: "Tom",
  age: 25,
};
```

上面的例子中，我们定义了一个接口 `Person`，接着定义了一个变量 `tom`，它的类型是 `Person`。这样，我们就约束了 `tom` 的形状必须和接口 `Person` 一致。

**赋值的时候，变量的形状必须和接口的形状保持一致**
对象定义的变量比接口少或者多一些属性是不允许的。

#### 可选属性

有时我们希望不要完全匹配一个形状，那么可以用可选属性：

```ts
interface Person {
  name: string;
  age?: number;
}

let tom: Person = {
  name: "Tom",
};
let Jenny: Person = {
  name: "Jenny",
  age: 21,
};
```

使用`?`修饰的变量，可以不存在，但是 **仍然不允许添加未定义的属性。**

#### 任意属性

如果希望接口中允许存在任意属性的变量，可以使用`[propName: string]: any]` 进行修饰。

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: "Tom",
  gender: "male",
};
```

注意：**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：**

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: string;
}

let tom: Person = {
  name: "Tom",
  age: 25,
  gender: "male",
};
//  编译失败
```

上例中，任意属性的值允许是 `string`，但是可选属性 `age` 的值却是 `number`，`number` 不是 `string` 的子属性，所以报错了。

可以使用联合类型进行处理：

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: "Tom",
  age: 25,
  gender: "male",
};
```

#### 只读属性

如果希望对象中的部分属性，只能在被创建的时候被赋值，且不能被修改， 可以使用 `readonly` 进行修饰属性。

```ts
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}
let tom: Person = {
  id: 9527,
  name: "Tom",
  age: 21,
  gender: "male",
};

tom.id = 123; // 编译报错，id为只读属性。
```

### 数组的类型

在 TypeScript 中，数组的类型有多种定义方式。

#### 「类型 + 方括号」

最简单、直观的一种方式。

```ts
let arr: number[] = [1, 2, 3, 4, 5];
```

上例中，数组中的每一项都必须是 `number` 类型。

#### 数组泛型

使用数组泛型来定义数组类型

```ts
let nums: Array<number> = [1, 1, 2, 3, 5];
```

#### 接口表示数组

数组是对象，使用接口定义数组类型。

```ts
interface NumberArray {
  [index: number]: number;
}
let nums: NumberArray = [1, 1, 2, 3, 5];
```

#### 类数组

类数组不是普通的数组，只能使用接口进行描述。
以 `arguments` 为例。

```ts
function count() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
```

事实上常用的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等：

```ts
function count() {
  let args: IArguments = arguments;
}
```

其中 `IArguments` 是 TypeScript 中定义好的内容。 等价于下例。

```ts
interface IArguments {
  [index: number]: number;
  length: number;
  callee: Function;
}
```

### 函数的类型

一个函数有输入和输出，要在 TypeScript 中对其进行约束。

```ts
function count(x: number, y: number): number {
  return x + y;
}
```

**输入不符合约束或者输出约束的输出，都是不被允许的。**

```ts
let count = function (x: number, y: number): number {
  return x + y;
};
```

上例中只是对右侧的函数进行了类型定义，左侧的变量是通过类型推论而推断出了类型定义。

完整示例：

```ts
let count: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

- 在 TypeScript 的类型定义中，`=>` 用来表示函数的返回值。
- 在 ES6 中，`=>` 叫做箭头函数。

函数是特殊的对象，所以也可以使用接口定义函数类型。

```ts
interface Nums {
  (x: number, y: number): number;
}
let nums: Nums = function (x: number, y: number): number {
  return x + y;
};
```

#### 可选参数

用 `?` 表示可选的参数。

```ts
function count(x: number, y: number, z?: number): number {
  if (z) {
    return x + y + z;
  } else {
    return x + y;
  }
}
count(1, 2);
```

注意,**可选参数必须在必需参数后面** 也就是说，可选参数后面不允许在出现必选参数。

#### 参数默认值

ES6 中对函数的参数添加了默认值，在 TypeScript 中，对于添加了默认值的参数，识别为可选参数，且和参数出现顺序无关，不必遵守 【可选参数必须在必需参数后面】。

#### 剩余参数（rest 参数）

ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数，rest 是一个数组，可以通过数组的类型来定义。

```ts
function doRest(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}
let arr = [];
doRest(arr, 1, 2, 3);
```

注意：**rest 参数只能是最后一个参数**

#### 重载

重载允许一个函数接受不同数量、类型的参数时，做出不同的处理。
栗子一：实现 `reverse` 函数，反转输入的参数。123==> 321; 'hello'==>'olleh'。

```ts
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```

基本实现需求，但是会存在一个问题，函数定义比较模糊，参数为数字时，返回值应该是数字。参数为字符串时，返回值应该是字符串，上例不能很好的处理这个问题。

借助函数的**重载**可以很好的解决这个问题。

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```

上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

### 类型断言

类型断言可以手动的指定一个值的类型。
