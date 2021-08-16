---
title: vue3-组合API(Composition API)
date: 2021-08-16 09:39:24
tags: 基础
categories: VUE3
---

#### setup

`setup` 函数是一个新的组件选项，是组件内使用 组合 API（Composition API）的入口.

- **调用顺序**

  - 创建实组件实例
  - 初始化 `props`
  - 调用 `setup` 函数
  - 正常的组件生命周期

##### 参数

- **`props` 作为其第一个参数**

  - `props` 对象是响应式的，`watchEffect` 或 `watch` 会观察和响应 `props` 的更新。
  - **不能** 解构 `props` 对象，因为会使其丢失掉响应性。
  - `props` 的代码空间是不可变的，尝试修改 `props` 时会触发警告。

        ```js
        export default {
          props: {
            name: String,
          },
          setup(props) {
            console.log(props.name);
            watchEffect(() => {
              console.log(`name is: ` + props.name);
            });
          },
        };
        ```

- **`context`(上下文对象) 作为第二个参数**

  上下文对象从 2.x 中的 `this` 选择性的暴露出一些 property.

  ```js
  export default {
    setup(props, context) {
      return {
        attrs: context.attrs,
        slots: context.slots,
        emit: context.emit,
      };
    },
  };
  ```

  `attrs` 和 `slots` 都是内部组件实例上对应项的代理(`proxy`),可以确保其是响应式数据,即为最新值,可以对其进行解构.

  ```js
  export default {
    setup(props, { attrs, slots }) {
      return {
        attrs,
        slots,
      };
    },
  };
  ```

##### `this` 的用法

**this 在 `setup()` 中不可用。**
由于`setup`函数在 `beforeCreate` 钩子执行前触发,当前实例的 `data` 和 `el` 还没有初始化.

##### 类型定义

为了获得传递给 setup() 参数的类型推断，需要使用 `defineComponent`。

```ts
interface Data {
  [key: string]: unknown;
}
interface Slots {
  [key: string]: unknown;
}
interface SetupContext {
  attrs: Data;
  slots: Slots;
  emit: (event: string, ...args: unknown[]) => void;
}
function setup(props: Data, context: SetupContext): Data;
```

#### 响应式系统 API

##### `reactive`

接收一个普通的对象然后返回该对象的响应式代理.

```js
const obj = reactive({ count: 0 });
```

响应式转换时深层次的,会影响对象内部虽有嵌套的属性,基于 es6 `Proxy` 实现,返回代理对象**不等于**原始对象.开发中使用代理对象而避免依赖原始对象.

- 类型定义

  ```ts
  function reactive<T extends object>(raw: T): T;
  ```

##### `ref`

接收一个基础类型的值,返回一个可以响应式且可以改变的`ref`对象.`ref`对象拥有一个指向内部值的单一属性 `.value`.

```js
const count = ref(0);
console.log(count.value); //0

count.value++;
console.log(count.value); //1
```

如果传入`ref`的是一个对象,将调用 `reactive` 方法进行深层次响应式转换.

- **模板中访问**
  当 `ref` 作为渲染上下文的属性返回（即在 `setup()` 返回的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写 `.value`

  ```js
  <template>
    <div>{{ count }}</div>
  </template>
  <script>
    export default {
      setup() {
        return {
          count: ref(0),
        };
      },
    };
  </script>
  ```

- **作为响应式对象的属性访问**
  当 `ref` 作为 `reactive` 对象的 `property` 被访问或修改时,也将自动解套 `value` 值,其行为类似于普通属性.

```js
const count = ref(0);
const state = reactive({
  count,
});
console.log(state.count); // 0

state.count = 1;
consoe.log(count.value); // 1
```

> 注意: 当嵌套再 `reactive object` 中时,`ref`才会解套. 从`array`,`Map` 等原生集合类中访问 `ref` 时,不会自动解套.

```js
const arr = reactive([ref(0)]);
// 这里需要 .value
console.log(arr[0].value);

const map = reactive(new Map([["foo", ref(0)]]));
// 这里需要 .value
console.log(map.get("foo").value);
```

- **类型定义**

```ts
interface Ref<T> {
  value: T;
}
function ref<T>(value: T): Ref<T>;
```

##### **`computed`**

- 传入一个 `getter` 函数,返回一个默认不可修改的 `ref` 对象.

```js
const count = ref(0);
const plusOne = computed(() => count.value + 1);
```

- 传入一个拥有 get 和 set 函数的对象,创建一个可以手动修改的计算状态.

```js
const count = ref(1);
const plusOne = computed({
  get: () => {
    return count.value + 1;
  },
  set: (val) => {
    count.value = val + 1;
  },
});
```

- 类型定义

```ts
// 只读类型
function computed<T>(getter: () => T): Readonly<Ref<Readyonly<T>>>;

// 可更改
function computed<T>(options: {
  get: () => T;
  set: (value: T) => volid;
}): Ref<T>;
```

##### `readonly`

传入一个对象(响应式或普通),返回一个原始对象的深层次只读代理.对象内部任何嵌套的属性也都是只读的.

```js
const original = reactive({ count: 0 });

const copy = readonly(original);

watchEffect(() => {
  // 依赖追踪
  console.log(copy.count);
});

// original 上的修改会触发 copy 上的侦听
original.count++;

// 无法修改 copy 并会被警告
copy.count++; // warning!
```

##### `watchEffect`

立即执行传入的一个函数,并响应式追踪其依赖,并在其依赖变更时重新运行该函数.

```js
const count = ref(0);
watchEffect(() => {
  console.log(count.value);
});
```

- 停止侦听
  当 `watchEffect` 在组件的 `setup()` 函数或者生命周期钩子被调用时,侦听器会被链接到该组件的生命周期,并在组件卸载的时候自动停止.

在一些情况下,也可以显式调用返回值以停止侦听.

```js
const stop = watchEffect(() => {
  /* ... */
});
stop();
```
