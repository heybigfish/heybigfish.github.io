---
title: 组合API(Composition API)
date: 2021-08-16 09:39:24
tags: [vue3]
categories: VUE3
---

![tree.png](https://i.loli.net/2021/09/02/KgnxjCqPiLYasmo.png)

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

- 清除副作用

  有时候 `watchEffect` 函数 会执行一些异步响应，这些响应需要在其失效时清除（异步操作完成之前状态发生改变）。
  所以`watchEffect` 接收 `onInvalidate` 函数作为入参，用来注册清除失效的异步响应。
  `onInvalidate`函数触发时机：

  - `watchEffect`重新执行。
  - 侦听器被停止（如果在 `setup()` 或 生命周期钩子函数中使用了 `watchEffect`, 则在卸载组件时）

  ```js
  watchEffect(({ onInvalidate }) => {
    const token = performAsyncOperation(id.value);
    onInvalidate(() => {
      // id 改变时 或 停止侦听时
      // 取消之前的异步操作
      token.cancel();
    });
  });
  ```

- 副作用刷新时机

  Vue 的响应式系统会缓存副作用函数，并异步的刷新，这样可以避免同一个 tick 中多个状态导致的不必要重复调用。
  在核心的具体实现中，组件的更新函数也是一个被侦听的副作用。 当一个用户定义的副作用进入队列时，会在所有的组件更新完成之后执行。

  ```html
  <template>
    <div>{{count}}</div>
  </template>

  <script>
    export default {
      setup() {
        const count = ref(0);
        watchEffect(() => {
          console.log(count.value);
        });
        return {
          count,
        };
      },
    };
  </script>
  ```

  在这个栗子中：

  - `count` 会在初始化运行时同步打印出来。
  - 更改 `count` 时，将在组件**更新后**执行副作用。

需要注意的是，初始化运行实在组件 `mounted` 之前执行的，所以，编写副作用函数时希望文档 DOM（或者模板 ref），需要在 `onMounted` 钩子中进行。

```js
 onMounted(){
   watchEffect(()=>{
      // 这里可以访问 DOM 或者 template refs
   })
 }
```

如果副作用需要同步或在组件更新之前重新运行，我们可以传递一个拥有 `flush` 属性的对象作为选项（默认为 `post` ）

```js
  onMounted(){
   // 同步运行。
   watchEffect(()=>{
      // do something
   },
   {
     flush:'sync'
   })

   // 组件更新之前执行。
   watchEffect(()=>{
       // do something
   },
   {
     flush:'pre'
   })
 }
```

##### `watch`

`watch` API 完全等效于 2.x 的 `this.$watch`。 `watch` 需要侦听特定的数据源，并在回调函数中执行副作用函数。 默认情况下是懒执行的，也就是仅在侦听源变更时在会执行回调。

- 对比 `watchEffect` , `watch`允许我们：

  - 懒加载执行副作用。
  - 更明确拿些状态的改变会触发侦听器重新运行副作用。
  - 访问侦听状态变化前后的值。

- 侦听单个数据源
  侦听器的数据源可以时一个拥有返回值的`getter`函数,也可以时 ref 对象：

  ```js
  // 侦听一个getter
  const state = reactive({
    count: 0,
  });
  watch(
    () => state.count,
    (count, prevCount) => {}
  );

  // 侦听一个ref
  // 直接侦听一个 ref
  const count = ref(0);
  watch(count, (count, prevCount) => {
    /* ... */
  });
  ```

- 侦听多个数据源

  `watcher` 也可以使用数组来同时侦听多个数据源。

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  });
  ```

- 与 `watchEffect` 共享的行为
  `watch` 和 `watchEffect` 在停止侦听, 清除副作用 (相应地 `onInvalidate` 会作为回调的第三个参数传入)，副作用刷新时机 和 侦听器调试 等方面行为一致.

#### 生命周期钩子函数

可以直接导入 `onXXX` 一类的函数来注册生命周期钩子

```js
import { onMounted, onUpdated, onUnmounted } from "vue";
const Mycomponent = {
  setup() {
    onMounted(() => {
      console.log("mounted!");
    });
    onUpdated(() => {
      console.log("updated!");
    });
    onUnmounted(() => {
      console.log("unmounted!");
    });
  },
};
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用，因为它们依赖内部的全局状态来定位当前组件实例（正在调用`setup()`的组件实例），不在当前组件下调用这些函数会抛出一个错误。

组件实例上下文也是在生命周期钩子同步执行期间设置的。因此，在组件卸载时，生命周期钩子内部会删除同步创建的的侦听器和计算状态。

- 与 2.x 版本生命周期相对应的组合式 API

  - ~~`beforeCreate`~~ -> `setup()`
  - ~~`created`~~ -> `setup()`
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeDestroy` -> `onBeforeUnmount`
  - `destroyed` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`

- 新增的钩子函数
  除了和 2.x 生命周期等效项之外，组合式 API 还提供了新的调试钩子。

  - `onRenderTracked`
  - `onRenderTriggered`

  两个钩子函数都接受一个`DebuggerEvent`,与`watchEffect`参数选项中的`onTrack`和`onTrigger`类似：

  ```js
  export default {
    onRenderTriggered() {
      debugger;
      // 检查哪个依赖性导致组件重新渲染
    },
  };
  ```

#### 依赖注入

`provide` 和 `inject` 提供依赖注入，功能类似与 2.x 的`provide`/`inject`。两者都只能在当前活动组件实力的`setup()`中调用。

`inject` 接受一个可选的默认值作为第二个参数，如果没有提供默认值，并且`inject`在上下文未找到该属性，则 `inject` 返回 `undefined`.

可以使用 `ref` 来保证 `provided` 和 `injected` 之间值的响应。

```js
// 提供者
const themeRef = ref("dark");
provide(ThemeSymbol, themeRef);

// 使用者
const theme = inject(ThemeSymbol, "light");
watchEffect(() => {
  console.log(`theme set to: ${theme.value}`);
});
```
