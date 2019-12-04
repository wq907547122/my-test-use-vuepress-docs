# Vue的技巧
- vm.$options是指在data外面定义的属性和方法通过$options可以获取和调用，例如 vm.$options.props就是父组件传递的信息
- vm.$listeners 是指所有的dom监听事件
- vm.$attrs 通过$attrs传父组件传来的，而当前页面没有接收的参数,一般结合inheritAttrs: false使用
- vm.$style 引用当前里面的class属性，这个不推荐使用


## 公共的工具类方法
### 1.获取首字母大写的字符串
```js
export const capitalizeFirstLetter = (string) => {
  if (!string || typeof string.charAt !== 'function') { return string }
  return string.charAt(0).toUpperCase() + string.slice(1)
};
```
### 2.清理map对象数据
```yaml
export const collectionCleaner = (options) => {
  const result = {};
  for (let key in options) {
    const value = options[key];
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
```

### 3.对vue的父组件数据做合并
```yaml
export const optionsMerger = (props, instance) => {
  const options = instance.options && instance.options.constructor === Object ? instance.options : {};
  props = props && props.constructor === Object ? props : {};
  // 使用 2.清理map对象数据   的方法
  const result = collectionCleaner(options);
  props = collectionCleaner(props);
  // 数据以instance.$options.props为主，即如果两者都存在相同的属性，就以vue对象的props的属性值为主
  const defaultProps = instance.$options.props;
  for (let key in props) {
    const def = defaultProps[key] ? defaultProps[key].default : Symbol('unique');
    if (result[key] && def !== props[key]) {
      console.warn(`${key} props is overriding the value passed in the options props`);
      result[key] = props[key];
    } else if (!result[key]) {
      result[key] = props[key];
    }
  };
  return result;
}
```


### 动态watch父组件属性，有参考意义，一般在判断的地方略有不同
```yaml
import { setOptions } from 'leaflet';
export const propsBinder = (vueElement, leafletElement, props, options) => {
  for (const key in props) {
    const setMethodName = 'set' + capitalizeFirstLetter(key);
    const deepValue = (props[key].type === Object) ||
      (props[key].type === Array) ||
      (Array.isArray(props[key].type));
      // 这里只有属性里面有属性值custom = true的才去做watch的事情
    if (props[key].custom && vueElement[setMethodName]) {
      vueElement.$watch(key, (newVal, oldVal) => {
        vueElement[setMethodName](newVal, oldVal);
      }, {
        deep: deepValue
      });
    } else if (setMethodName === 'setOptions') {
      vueElement.$watch(key, (newVal, oldVal) => {
        setOptions(leafletElement, newVal);
      }, {
        deep: deepValue
      });
    } else if (leafletElement[setMethodName]) {
      vueElement.$watch(key, (newVal, oldVal) => {
        leafletElement[setMethodName](newVal);
      }, {
        deep: deepValue
      });
    }
  }
};
```

### vue2-leaflet组件的的Mixin主要的作用是做属性的定义和做watch数据改变的调用的方法
定义组件需要父组件传递给地图组件的参数信息以及这些参数改变可能会触发map对象的设置值的事情
<br/>
主要是看里面的属性有哪些特殊的方法和方法的互相调用的处理,从而达到减少代码量，就是一个重构的事情
<br/>
Mixin主要的作用就是做重构的事情:代码的复用
<br/>
![](/images/vue/leaflet-info.png)
<br/>

## vue的内容
### 事件
#### 语法
- v-on:event 例如： v-on:click="myClick"
- @event 对应上面的简写  v-on:click 等价于 @click
处理时间的方法默认是带有一个参数
```yaml
// 方式1:点击回调
<button @click="myClick"></button>
js:
// 默认回调函数带有event信息
myClick(event) {
  alert(event.target)
}

方式二：里面传递信息，点击执行调用方法
<button @click="myClick('hi')"></button>
js:
// 默认回调函数带有event信息
myClick(msg) {
  alert(msg)
}

方式三：里面传递信息，并且传递对应的事件使用$event,就是当前的事件信息
<button @click="myClick('hi', $event)"></button>
js:
// 默认回调函数带有event信息
myClick(msg, event) {
  alert(msg + event.target)
}
``` 
#### 事件的修饰符
- .stop: 是阻止冒泡行为,不让当前元素的事件继续往外触发
- .prevent: 是阻止事件本身行为,如阻止超链接的点击跳转,form表单的点击提交
- .capture: 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理。即 是改变js默认的事件机制,默认是冒泡,capture功能是将冒泡改为倾听模式
- .self: 是当前元素自身时触发处理函数.即 只有是自己触发的自己才会执行,如果接受到内部的冒泡事件传递信号触发,会忽略掉这个信号
- .once: 只调用一次。 将事件设置为只执行一次,如 .click.prevent.once 代表只阻止事件的默认行为一次,当第二次触发的时候事件本身的行为会执行
- .passvie: Vue 还对应 addEventListener 中的 passive 选项提供了 .passive 修饰符。
:::tip 说明
.self和.stop区别: .self只是阻止自身不执行冒泡触发,不会阻止冒泡继续向外部触发,.stop是从自身开始不向外部发射冒泡信号
<br/>
这个 .passive 修饰符尤其能够提升移动端的性能。
:::
:::danger 警告
不要把 .passive 和 .prevent 一起使用，因为 .prevent 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，.passive 会告诉浏览器你不想阻止事件的默认行为。
```vue
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>

这个 .passive 修饰符尤其能够提升移动端的性能。
```
:::

- .enter: 按键修饰符
:::tip 说明
在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：
```vue
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```
你可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。
```vue
<input v-on:keyup.page-down="onPageDown">
在上述示例中，处理函数只会在 $event.key 等于 PageDown 时被调用。
```
:::
下面是这些修饰符例子的具体说明：
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.0"></script>
    <style>
        .cl1{
            width: 100px;
            height: 100px;
            background: pink;
        }
    </style>
</head>
<body>
<div class="test">
    <div class="cl1" @click="show2">
        <input type="button" value="button" @click.stop="show1"/>
         <!-- 使用.stop可以阻止事件的冒泡,这样在点击input的时候不会触发外部的div点击事件-->
    </div>
    <a href="http://www.baidu.com" @click.prevent="show3">百度</a>
    <!-- 使用.prevent 可以阻止默认事件,这里阻止了超链接的跳转-->
    <div class="cl1" @click.capture="show2">
        <!-- .capture让js的监听机制从冒泡改为倾听-->
        <!-- 冒泡是从里往外触发,倾听是从外往里触发-->
        <!-- 这里会先弹出div的弹窗事件,然后出发input弹窗-->
        <input type="button" value="button" @click="show1"/>
    </div>
    <div class="cl1" @click.self="show2">
        <!-- .self是将事件设置为只有自己本身触发的时候才触发-->
        <!-- 如果是冒泡传递上来的事件不触发自身事件-->
        <!-- 这里点击input也只会触发input事件,而不会触发div事件-->
        <input type="button" value="button" @click="show1"/>
    </div>
    <a href="http://www.baidu.com" @click.prevent.once="show3">百度</a>
    <!-- 使用.once设置默认跳转事件只被拦截一次,当第二次点击超链接的时候,就会跳转到百度-->
</div>
<script>
    var vm1 = new Vue({
        el:".test",
        data:{},
        methods:{
            show1: function () {
                alert("点击了input")
            },
            show2: function () {
                alert("外部的div点击事件由于冒泡同时触发了")
            },
            show3: function () {
                alert("阻止了超链接的跳转")
            }
        }
    })
</script>
</body>
</html>
```

#### 系统修饰键
- .ctrl : Ctrl键
- .alt : Alt键
- .shift : Shift键
- .meta : 对应“田”键
例子：
```vue
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>

注意说明：
请注意修饰键与常规按键不同，在和 keyup 事件一起用时，事件触发时修饰键必须处于按下状态。
换句话说，只有在按住 ctrl 的情况下释放其它按键，才能触发 keyup.ctrl。
而单单释放 ctrl 也不会触发事件。如果你想要这样的行为，请为 ctrl 换用 keyCode：keyup.17。
```

### vue组件
#### 基本实例：
```vue
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

```

```vue
// 组件是可复用的 Vue 实例，且带有一个名字：在这个例子中是 <button-counter>。
// 我们可以在一个通过 new Vue 创建的 Vue 根实例中，把这个组件作为自定义元素来使用:
<div id="components-demo">
  <button-counter></button-counter>
</div>
new Vue({ el: '#components-demo' })

```
:::tip 说明
因为组件是可复用的 Vue 实例，所以它们与 new Vue 接收相同的选项，例如 data、computed、watch、methods 以及生命周期钩子等。
仅有的例外是像 el 这样根实例特有的选项。
- data 必须是一个函数
- 通过 Prop 向子组件传递数据
```vue
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})

```
:::

```yaml
组件上使用 v-model
自定义事件也可以用于创建支持 v-model 的自定义输入组件。记住：

<input v-model="searchText">
等价于：

<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
当用在组件上时，v-model 则会这样：
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
为了让它正常工作，这个组件内的 <input> 必须：
```

- 将其 value 特性绑定到一个名叫 value 的 prop 上
- 在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出
```vue
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

```
现在 v-model 就应该可以在这个组件上完美地工作起来了：
```vue
<custom-input v-model="searchText"></custom-input>
```
v-model就是value属性绑定 + 表单组件的input事件的组合

#### 通过插槽分发内容
和 HTML 元素一样，我们经常需要向一个组件传递内容，像这样：
```vue
<alert-box>
  Something bad happened.
</alert-box>
```
可能会渲染出这样的东西：
<div style="background: pink;">
<strong>Error!</strong> 
Something bad happened.
</div>

```yaml
幸好，Vue 自定义的 <slot> 元素让这变得非常简单：
```
```vue
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

#### 组件注册
- 全局注册
到目前为止，我们只用过 Vue.component 来创建组件：
```vue
Vue.component('my-component-name', {
  // ... 选项 ...
})
```
这些组件是全局注册的。也就是说它们在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中。比如：
```vue
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })
```
- 局部注册
全局注册往往是不够理想的。比如，如果你使用一个像 webpack 这样的构建系统，全局注册所有的组件意味着即便你已经不再使用一个组件了，它仍然会被包含在你最终的构建结果中。这造成了用户下载的 JavaScript 的无谓的增加。
<br/>
在这些情况下，你可以通过一个普通的 JavaScript 对象来定义组件：
```vue
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```
然后在 components 选项中定义你想要使用的组件：
```vue
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```
:::warning 注意
注意局部注册的组件在其子组件中不可用。例如，如果你希望 ComponentA 在 ComponentB 中可用，则你需要这样写：
:::
或者如果你通过 Babel 和 webpack 使用 ES2015 模块，那么代码看起来更像：
```vue
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

- 模块系统：import/require 使用一个模块系统
在模块系统中局部注册
<br/>
然后你需要在局部注册之前导入每个你想使用的组件。例如，在一个假设的 ComponentB.js 或 ComponentB.vue 文件中：
```vue
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```
现在 ComponentA 和 ComponentC 都可以在 ComponentB 的模板中使用了。

- 基础组件的自动化全局注册
可能你的许多组件只是包裹了一个输入框或按钮之类的元素，是相对通用的。我们有时候会把它们称为基础组件，它们会在各个组件中被频繁的用到。
<br/>
所以会导致很多组件里都会有一个包含基础组件的长列表：
```vue
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```
而只是用于模板中的一小部分：
```vue
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```
幸好如果你使用了 webpack (或在内部使用了 webpack 的 Vue CLI 3+)，那么就可以使用 require.context 只全局注册这些非常通用的基础组件。这里有一份可以让你在应用入口文件 (比如 src/main.js) 中全局导入基础组件的示例代码：
```vue
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

#### 对象传值
```yaml
如果你想要将一个对象的所有属性都作为 prop 传入，你可以使用不带参数的 v-bind (取代 v-bind:prop-name)。例如，对于一个给定的对象 post：

post: {
  id: 1,
  title: 'My Journey with Vue'
}
下面的模板：

<blog-post v-bind="post"></blog-post>
等价于：

<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```
:::tip 说明
对于普通对象来说，我们通过父组件改变会，他的改变会流向子组件，但是子组件的改变是不会流向父组件，并且子组件修改普通属性，一般是会报警告的，不能这样使用
<br/>
注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。
:::
#### 类型的验证
```vue
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})

说明：
注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的属性 (如 data、computed 等) 在 default 或 validator 函数中是不可用的。
```

类型检查：
- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol : ES6中引入了一种新的<b>基础数据类型</b>

```
私有化属性可以通过 Symbol来处理
const CALC_FUNC = Symbol('Calc Data')
class Test{
    consturctor(opts = {}) {
        this.base = opts.base || 0
    }
    // 做一个计算，这个方法就是一个私有方法了
    [CALC_FUNC](a) {
        this.base += a
    }
}

```
<br/>
额外的，type 还可以是一个自定义的构造函数，并且通过 instanceof 来进行检查确认。例如，给定下列现成的构造函数：

```vue
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
你可以使用：

Vue.component('blog-post', {
  props: {
    author: Person
  }
})
来验证 author prop 的值是否是通过 new Person 创建的。
```
非 Prop 的特性: 是指传向一个组件，但是该组件并没有相应 prop 定义的特性
```vue
有了 inheritAttrs: false 和 $attrs，你就可以手动决定这些特性会被赋予哪个元素。在撰写基础组件的时候是常会用到的：

Vue.component('base-input', {
  inheritAttrs: false, // 这个是必须的，否则属性值就设置在了根元素上了，inheritAttrs = false，我们就可以自己来设置非Prop具体需要设置到哪个元素上了
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        // 传入的非Prop属性值都传递给input，
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

#### 基础组件的自动全局注册
```vue
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

记住<b>全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生</b>。[这里](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js)有一个真实项目情景。

### $attrs使用例子
$attrs结合inheritAttrs: false，可以将非Prop属性绑定到你想要绑定的非根节点上，如果inheritAttrs: true，非Prop属性就只能绑定到组件的根元素上

```vue
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```
:::tip 注意
inheritAttrs: false 选项不会影响 style 和 class 的绑定。
:::
这个模式允许你在使用基础组件的时候更像是使用原始的 HTML 元素，而不会担心哪个元素是真正的根元素：
```vue
<base-input
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>
```

### 自定义事件
:::tip 注意
事件名称默认是全部转换为小写，而不是驼峰式命名可以转换为横线分割的。
<br/>
事件名称不会像组件或Prop属性一下对大小写不敏感
<br/>
例如：
所以 v-on:myEvent 将会变成 v-on:myevent——导致 myEvent 不可
:::
### $listeners的例子
```vue
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

#### .sync修饰符
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。
<br/>
这也是为什么我们推荐以 update:myPropName 的模式触发事件取而代之。举个例子，在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
<br/>
```vue
this.$emit('update:title', newTitle)
```
然后父组件可以监听那个事件并根据需要更新一个本地的数据属性。例如：
```vue
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```
等价于：
为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：
```vue
<text-document v-bind:title.sync="doc.title"></text-document>
```
:::warning 告警
注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。取而代之的是，你只能提供你想要绑定的属性名，类似 v-model。
:::

### 插槽(slot)
然后你在 &lt;navigation-link&gt; 的模板中可能会写为：
```vue
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>

// 当组件渲染的时候，<slot></slot> 将会被替换为
<span class="fa fa-user"></span>
Your Profile。
// 插槽内可以包含任何模板代码，包括 HTML：
<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```
#### 插槽的编译作用域
当你想在一个插槽中使用数据时，例如：
```vue
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```
该插槽跟模板的其它地方一样可以访问相同的实例属性 (也就是相同的“作用域”)，而不能访问 &lt;navigation-link&gt; 的作用域。例如 url 是访问不到的：
```vue
<navigation-link url="/profile">
  Clicking here will send you to: {{ url }}
  <!--
  这里的 `url` 会是 undefined，因为 "/profile" 是
  _传递给_ <navigation-link> 的而不是
  在 <navigation-link> 组件*内部*定义的。
  -->
</navigation-link>
```
作为一条规则，请记住：
:::tip 注意
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。
:::

#### 插槽的后备内容
就是当没有使用插槽的时候使用默认的信息填充，如果有后备的内容是不会显示的
有时为一个插槽设置具体的后备 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。例如在一个 &lt;submit-button&gt; 组件中：
```vue
<button type="submit">
  <slot></slot>
</button>
```
我们可能希望这个 &lt;button&gt; 内绝大多数情况下都渲染文本“Submit”。为了将“Submit”作为后备内容，我们可以将它放在 &lt;slot&gt; 标签内：
```vue
<button type="submit">
  <slot>Submit</slot>
</button>
现在当我在一个父级组件中使用 <submit-button> 并且不提供任何插槽内容时：

<submit-button></submit-button>
后备内容“Submit”将会被渲染： <==>

<button type="submit">
  Submit
</button>
但是如果我们提供内容：

<submit-button>
  Save
</submit-button>
则这个提供的内容将会被渲染从而取代后备内容：

<button type="submit">
  Save
</button>
```
:::tip 说明
v-slot 指令自 Vue 2.6.0 起被引入，提供更好的支持 slot 和 slot-scope 特性的 API 替代方案。v-slot 完整的由来参见这份 RFC。在接下来所有的 2.x 版本中 slot 和 slot-scope 特性仍会被支持，但已经被官方废弃且不会出现在 Vue 3 中。
:::

#### 具名插槽
:::tip
自 2.6.0 起有所更新。如果需要使用已废弃的 slot 特性的语法在[这里](https://cn.vuejs.org/v2/guide/components-slots.html#%E5%BA%9F%E5%BC%83%E4%BA%86%E7%9A%84%E8%AF%AD%E6%B3%95)。
:::
有时我们需要多个插槽。例如对于一个带有如下模板的 &lt;base-layout&gt; 组件：
```vue
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```
对于这样的情况，&lt;slot&gt; 元素有一个特殊的特性：name。这个特性可以用来定义额外的插槽：
```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
一个不带 name 的 &lt;slot&gt; 出口会带有隐含的名字“default”。
<br/>
在向具名插槽提供内容的时候，我们可以在一个 &lt;template&gt; 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称：
<br/>
下面是使用插槽的例子：
```vue
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
一个不带 name 的 &lt;slot&gt; 出口会带有隐含的名字“default”。
<br/>
在向具名插槽提供内容的时候，我们可以在一个 &lt;template&gt; 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称：
```vue
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
现在 &lt;template&gt; 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 v-slot 的 &lt;template&gt; 中的内容都会被视为默认插槽的内容。
<br/>
然而，如果你希望更明确一些，仍然可以在一个 &lt;template&gt; 中包裹默认插槽的内容：
```vue
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
上面不管是否使用v-slot:default任何一种写法都会渲染出：
```vue
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```
注意 v-slot 只能添加在一个 &lt;template&gt; 上 (只有[一种例外情况](https://cn.vuejs.org/v2/guide/components-slots.html#%E7%8B%AC%E5%8D%A0%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD%E7%9A%84%E7%BC%A9%E5%86%99%E8%AF%AD%E6%B3%95))，这一点和已经废弃的 slot 特性不同。

#### 作用域插槽
:::tip
自 2.6.0 起有所更新。已废弃的使用<s> slot-scope 特性的语法在[这里](https://cn.vuejs.org/v2/guide/components-slots.html#%E5%BA%9F%E5%BC%83%E4%BA%86%E7%9A%84%E8%AF%AD%E6%B3%95)</s>。
:::
有时让插槽内容能够访问子组件中才有的数据是很有用的。例如，设想一个带有如下模板的 &lt;current-user&gt; 组件：
```vue
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```
我们想让它的后备内容显示用户的名，以取代正常情况下用户的姓，如下：
```vue
<current-user>
  {{ user.firstName }}
</current-user>
```
然而上述代码不会正常工作，因为只有 &lt;current-user&gt; 组件可以访问到 user 而我们提供的内容是在父级渲染的。
为了让 user 在父级的插槽内容中可用，我们可以将 user 作为 &lt;slot&gt; 元素的一个特性绑定上去：
```vue
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```
绑定在 &lt;slot&gt; 元素上的特性被称为插槽 prop。现在在父级作用域中，我们可以给 v-slot 带一个值来定义我们提供的插槽 prop 的名字：
<br/>
下面是使用插槽属性:
```vue
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>

独占插槽的简写(默认是default)：
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

多插槽数据作用域的方式
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>

ES2015的方式
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>

支持ES2015的属性重命名
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>

你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```
在这个例子中，我们选择将包含所有插槽 prop 的对象命名为 slotProps，但你也可以使用任意你喜欢的名字。

#### 动态插槽名
:::tip 说明
2.6.0 新增
:::
动态指令参数也可以用在 v-slot 上，来定义动态的插槽名：
```vue
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

#### 具名插槽的缩写
:::tip 说明
2.6.0 新增
<br/>
例如：v-slot:header可以缩写为#header
:::
跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。例如 v-slot:header 可以被重写为 #header：
```vue
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
:::tip 说明
如果你希望使用缩写的话，你必须始终以明确插槽名取而代之
:::
就是默认的信息也应该具有名称缩写为#default
```yaml
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

#### 使用插槽的示例
```yaml
例如，我们要实现一个 <todo-list> 组件，它是一个列表且包含布局和过滤逻辑：
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>

我们可以将每个 todo 作为父级组件的插槽，以此通过父级组件对其进行控制，然后将 todo 作为一个插槽 prop 进行绑定：

<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    我们为每个 todo 准备了一个插槽，
    将 `todo` 对象作为一个插槽的 prop 传入。
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- 后备内容 -->
      {{ todo.text }}
    </slot>
  </li>
</ul>

现在当我们使用 <todo-list> 组件的时候，我们可以选择为 todo 定义一个不一样的 <template> 作为替代方案，并且可以从子组件获取数据：

<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
这只是作用域插槽用武之地的冰山一角。想了解更多现实生活中的作用域插槽的用法，
我们推荐浏览诸如 [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller)、
[Vue Promised](https://github.com/posva/vue-promised) 和 [Portal Vue](https://github.com/LinusBorg/portal-vue) 等库。

#### keep-alive
具体可以参考[这里](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)
#### 异步组件
语法：
```yaml
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})

```
一个推荐的做法是将异步组件和 webpack 的 code-splitting 功能一起配合使用：
```yaml
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})

或者

Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：
```yaml
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

#### 处理加载状态
这里的异步组件工厂函数也可以返回一个如下格式的对象：
```vue
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

:::tip 注意
如果你希望在 [Vue Router](https://github.com/vuejs/vue-router) 的路由组件中使用上述语法的话，你必须使用 Vue Router 2.4.0+ 版本。
:::

#### $root的使用
示例
```vue
// Vue 根实例
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```
所有的子组件都可以将这个实例作为一个全局 store 来访问或使用。
```vue
// 获取根组件的数据
this.$root.foo

// 写入根组件的数据
this.$root.foo = 2

// 访问根组件的计算属性
this.$root.bar

// 调用根组件的方法
this.$root.baz()
```
:::warning 注意
对于 demo 或非常小型的有少量组件的应用来说这是很方便的。不过这个模式扩展到中大型应用来说就不然了。因此在绝大多数情况下，我们强烈推荐使用 Vuex 来管理应用的状态。
:::

### 访问父级组件
另外在一些可能适当的时候，你需要特别地共享一些组件库。举个例子，在和 JavaScript API 进行交互而不渲染 HTML 的抽象组件内，诸如这些假设性的 Google 地图组件一样：
```vue
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```
这个 &lt;google-map&gt; 组件可以定义一个 map 属性，所有的子组件都需要访问它。在这种情况下 &lt;google-map-markers&gt; 可能想要通过类似 this.$parent.getMap 的方式访问那个地图，
以便为其添加一组标记。你可以在[这里](https://jsfiddle.net/chrisvfritz/ttzutdxh/)查阅这种模式。
<br/>
在这个组件里，所有 &lt;google-map&gt; 的后代都需要访问一个 getMap 方法，以便知道要跟哪个地图进行交互。
不幸的是，使用 $parent 属性无法很好的扩展到更深层级的嵌套组件上。
这也是依赖注入的用武之地，它用到了两个新的实例选项：provide 和 inject。

##### provide
provide 选项允许我们指定我们想要提供给后代组件的数据/方法。在这个例子中，就是 &lt;google-map&gt; 内部的 getMap 方法：

```vue
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

##### inject
然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的属性：

```vue
inject: ['getMap']
```
你可以在[这里](https://jsfiddle.net/chrisvfritz/tdv8dt3s/)看到完整的示例。相比 $parent 来说，这个用法可以让我们在任意后代组件中访问 getMap，而不需要暴露整个 &lt;google-map&gt; 实例。
这允许我们更好的持续研发该组件，而不需要担心我们可能会改变/移除一些子组件依赖的东西。
同时这些组件之间的接口是始终明确定义的，就和 props 一样。

### 程序化的事件侦听器 $emit
现在，你已经知道了 $emit 的用法，它可以被 v-on 侦听，但是 Vue 实例同时在其事件接口中提供了其它的方法。我们可以：
- 通过 $on(eventName, eventHandler) 侦听一个事件
- 通过 $once(eventName, eventHandler) 一次性侦听一个事件
- 通过 $off(eventName, eventHandler) 停止侦听一个事件
你通常不会用到这些，但是当你需要在一个组件实例上手动侦听事件时，它们是派得上用场的。它们也可以用于代码组织工具。例如，你可能经常看到这种集成一个第三方库的模式：

```vue
// 一次性将这个日期选择器附加到一个输入框上
// 它会被挂载到 DOM 上。
mounted: function () {
  // Pikaday 是一个第三方日期选择器的库
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// 在组件被销毁之前，
// 也销毁这个日期选择器。
beforeDestroy: function () {
  this.picker.destroy()
}
```
这里有两个潜在的问题：
- 它需要在这个组件实例中保存这个 picker，如果可以的话最好只有生命周期钩子可以访问到它。这并不算严重的问题，但是它可以被视为杂物。
- 我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化地清理我们建立的所有东西。
你应该通过一个程序化的侦听器解决这两个问题：
```vue
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```
使用了这个策略，我甚至可以让多个输入框元素同时使用不同的 Pikaday，每个新的实例都程序化地在后期清理它自己：
```vue
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```
:::tip 注意
注意 Vue 的事件系统不同于浏览器的 EventTarget API。尽管它们工作起来是相似的，但是 $emit、$on, 和 $off 并不是 dispatchEvent、addEventListener 和 removeEventListener 的别名。
:::

### 递归组件
组件是可以在它们自己的模板中调用自身的。不过它们只能通过 name 选项来做这件事：
```yaml
name: 'unique-name-of-my-component'

当你使用 Vue.component 全局注册一个组件时，这个全局的 ID 会自动设置为该组件的 name 选项。
Vue.component('unique-name-of-my-component', {
  // ...
})
稍有不慎，递归组件就可能导致无限循环：
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
类似上述的组件将会导致“max stack size exceeded”错误，所以请确保递归调用是条件性的 (例如使用一个最终会得到 false 的 v-if)。
```

### 组件之间的循环引用
假设你需要构建一个文件目录树，像访达或资源管理器那样的。你可能有一个 &lt;tree-folder&gt; 组件，模板是这样的：
```yaml
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
还有一个 <tree-folder-contents> 组件，模板是这样的：
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
当你仔细观察的时候，你会发现这些组件在渲染树中互为对方的后代和祖先——一个悖论！
当通过 Vue.component 全局注册组件的时候，这个悖论会被自动解开。如果你是这样做的，那么你可以跳过这里。

```
然而，如果你使用一个模块系统依赖/导入组件，例如通过 webpack 或 Browserify，你会遇到一个错误：
<br/>
Failed to mount component: template or render function not defined.
为了解释这里发生了什么，我们先把两个组件称为 A 和 B。模块系统发现它需要 A，但是首先 A 依赖 B，但是 B 又依赖 A，但是 A 又依赖 B，如此往复。这变成了一个循环，不知道如何不经过其中一个组件而完全解析出另一个组件。为了解决这个问题，我们需要给模块系统一个点，在那里“A 反正是需要 B 的，但是我们不需要先解析 B。”
<br/>
在我们的例子中，把 &lt;tree-folder&gt; 组件设为了那个点。
我们知道那个产生悖论的子组件是 &lt;tree-folder-contents&gt; 组件，所以我们会等到生命周期钩子 beforeCreate 时去注册它：
在我们的例子中，把 &lt;tree-folder&gt; 组件设为了那个点。我们知道那个产生悖论的子组件是 &lt;tree-folder-contents&gt; 组件，所以我们会等到生命周期钩子 beforeCreate 时去注册它：
```vue
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}

或者 在本地注册组件的时候，你可以使用 webpack 的异步 import：
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```
这样问题就解决了！

### transition
过渡组件
```vue
这里是一个典型的例子：
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
// js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})

// cs 通过fade + （-enter-active , -leave-active）
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

```
#### 过渡的类名
在进入/离开的过渡中，会有 6 个 class 切换。
- 1. v-enter：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
- 2. v-enter-active：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
- 3. v-enter-to: 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
- 4. v-leave: 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
- 5. v-leave-active：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
- 6. v-leave-to: 2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。


## Mixin
代码混合，里面的数据格式和vue对象的属性设置可以完全一致
<br/>
主要是做重构方面使用Mixin很好，减少代码的冗余，并且功能分开,例子：
```vue
/**
 * 混入计算高度的组件,减少代码量
 */
export default {
  data() {
    return {
      // 最大的表格高度,初始化值尽量大一点，避免出现滚动条
      maxTableHeight: 1300,
      // 减去的数据
      deductNum: 200
    }
  },
  watch: {
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeTableHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeTableHandler)
  },
  mounted() {
    this.$_resizeTableHandler()
  },
  methods: {
    // 表格高度的计算
    $_resizeTableHandler() {
      const height = window.innerHeight
      let relHeight = height - this.deductNum
      if (relHeight < 120) {
        relHeight = 120// 默认的最大高度不小于120
      }
      this.maxTableHeight = relHeight
    }
  }
}


局部使用: 在vue的实例中添加属性
mixins: [TableHeightMixin],
如果高度不对可以调整在调用的地方定义的data数据中添加属性 =》
data() {
    return {
            ...
            deductNum: xxxx,
            ....
        } 
    }

```

## 自定义指令
```vue
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


// 如果想注册局部指令，组件中也接受一个 directives 的选项：
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}

// 然后你可以在模板中任何元素上使用新的 v-focus 属性，如下：
<input v-focus>
```
### 钩子函数
一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用
<br/>
所有的构造函数的参数都是(el、binding、vnode 和 oldVnode)
```vue
// 示例：
Vue.directive('color', {
    bind(el, binding, vnode, oldVnode) {
       // TODO bind代码....
    },
    inserted(el, binding, vnode, oldVnode) {
       // TODO inserted代码....
    },
    update(el, binding, vnode, oldVnode) {
       // TODO update代码....
    },
    componentUpdated(el, binding, vnode, oldVnode) {
       // TODO componentUpdated代码....
    },
    unbind(el, binding, vnode, oldVnode) {
       // TODO unbind代码....
    }
})

// 函数简写 在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子。比如这样写:
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})


// 一个改变颜色，并且当对象更新的时候也更新的方式
Vue.directive('color', {
    bind(el, binding) {
        const values = Object.assign({color: 'red'}, typeof binding.value === 'object' ? binding.value : {})
        // 测试使用dataset属性,组件之间共享的信息，可以使用它, 最终在元素上会有一个属性为 data-test="xxx"的属性
        // dataset的多个单词在html中使用横线隔开，在js中使用驼峰式首字母小写 例如：<label data-test-info> ==> js中： el.dataset.testInfo
        el.dataset.test = values.color
        el.style.color = values.color
    },
    update(el, binding) {
        const values = Object.assign({color: 'red'}, typeof binding.value === 'object' ? binding.value : {})
        // 测试使用dataset属性,组件之间共享的信息，可以使用它
        console.log(el.dataset.test)
        el.style.color = values.color
    }
})
```
<br/>
接下来我们来看一下钩子函数的参数 (即 el、binding、vnode 和 oldVnode)。
### 钩子函数参数

指令钩子函数会被传入以下参数：

- el：指令所绑定的元素，可以用来直接操作 DOM 。
- binding：一个对象，包含以下属性：
name：指令名，不包括 v- 前缀。
<br/>
value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
<br/>
oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
<br/>
expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
<br/>
arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
<br/>
modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

:::tip 注意
除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。
:::

## 插件
### 使用插件
通过全局方法 Vue.use() 使用插件。它需要在你调用 new Vue() 启动应用之前完成
```vue
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
// 也可以传入一个可选的选项对象：
Vue.use(MyPlugin, { someOption: true })

new Vue({
  // ...组件选项
})
```

### 开发插件
Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：
```vue
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```
:::tip 说明
[awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) 集合了大量由社区贡献的插件和库。
:::
使用插件到NPM的[例子](https://www.cnblogs.com/adouwt/p/9211003.html)
打包插件到NPM的[例子](https://www.cnblogs.com/adouwt/p/9655594.html)
使用[vue-cli初始化项目](https://www.cnblogs.com/anxiaoyu/p/7071143.html)
写一个[TOAST插件](https://www.jianshu.com/p/62c199d306e1)
### 将自己的[vue插件构建](https://github.com/wq907547122/my-test-toast-demo.git)并且上传到npm

参考如下：<br/>
打包插件到NPM的[例子](https://www.cnblogs.com/adouwt/p/9655594.html)
- 这里采用的是vue-cli 脚手架，版本是2.**。
在一个目录下执行命令：
```vue
1.先安装nodejs

2.使用npm install -g vue-cli
(建议在使用这步前先安装nrm来切换npm的源利器，使得下载资源更快速
npm install -g nrm
nrm ls(即可查看npm 的源利器有哪些)
nrm use (切换npm的源利器)
然后就可以使用npm install 你需要下载的包
)

3.构建自己的项目
vue init webpack myproject

4.进入包并且安装项目的依赖
cd myproject
npm install

```
- 添加打包插件源码的配置文件
在build目录下创建一个用于打包上传的js文件webpack.dist.conf.js,因为用到了sass所以添加了scss的解析器：
```vue{}
var path = require('path')
var webpack = require('webpack')
const utils = require('./utils')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './src/plugin/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'mytestToast.js', // 自己的打包到dist目录下的文件名称
    library: 'mytestToast', // library指定的就是你使用require时的模块名，这里便是require("vueAjaxUpload")
    libraryTarget: 'umd', //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader!style-loader!css-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

```
对应的package.json的配置信息
```vue
{
  "name": "vue-plugin-my-test-toast",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "wq <907547122@qq.com>",
  "private": false,
  "license": "Apache-2.0",
  "main": "dist/mytestToast.js",
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node build/build.js",
    "dist": "webpack --config build/webpack.dist.conf.js",
    "publish": "npm run dist && npm publish"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/wq907547122/my-test-toast-demo.git"
  },
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.22.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-loader": "^7.1.1",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-plugin-transform-vue-jsx": "^3.5.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-stage-2": "^6.22.0",
    "chalk": "^2.0.1",
    "copy-webpack-plugin": "^4.0.1",
    "css-loader": "^0.28.0",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^1.1.4",
    "friendly-errors-webpack-plugin": "^1.6.1",
    "html-webpack-plugin": "^2.30.1",
    "node-notifier": "^5.1.2",
    "node-sass": "^4.13.0",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "ora": "^1.2.0",
    "portfinder": "^1.0.13",
    "postcss-import": "^11.0.0",
    "postcss-loader": "^2.0.8",
    "postcss-url": "^7.2.1",
    "rimraf": "^2.6.0",
    "sass": "^1.23.7",
    "sass-loader": "^7.3.1",
    "semver": "^5.3.0",
    "shelljs": "^0.7.6",
    "uglifyjs-webpack-plugin": "^1.1.1",
    "url-loader": "^0.5.8",
    "vue-loader": "^13.3.0",
    "vue-style-loader": "^3.0.1",
    "vue-template-compiler": "^2.5.2",
    "webpack": "^3.6.0",
    "webpack-bundle-analyzer": "^2.9.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
  },
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}

```

### 插件开发
- 在src目录下创建目录plugin
plugin目录下载再创建index.js和toast.vue文件
<br/>
src/plugin/index.js内容如下:
```vue
import Toast from './toast.vue'

let currentToast
export default {
  install(Vue, options) {
    Vue.prototype.$toast = (message, toastOptions) => {
      // 避免出现多个 toast 重叠
      if(currentToast) {
        currentToast.close()
      }

      currentToast = createToast({
        Vue,
        message,
        propsData: toastOptions,
        onClose: () => {
          currentToast = null
        }
      })
    }
  }
}

function createToast({ Vue, message, propsData, onClose }) {
  const Constructor = Vue.extend(Toast)
  let toast = new Constructor({
    propsData
  })
  toast.$slots.default = [message]
  toast.$mount()
  toast.$on('close', onClose)
  // 添加元素的html中
  document.body.appendChild(toast.$el)
  return toast
}

```
src/plugin/toast.vue内容如下:
```vue
<template>
  <div class="wrapper" :class="toastClasses">
    <div class="toast" ref="toast">
      <div class="message">
        <slot v-if="!enableHtml"></slot>
        <div v-else v-html="$slots.default[0]"></div>
      </div>
      <div class="line" ref="line"></div>
      <span class="close" v-if="closeButton" @click="onClickClose">{{closeButton.text}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: "WheelToast",
    props: {
      autoClose: {
        type: [Boolean, Number],
        default: 5,
        validator(value) {
          return typeof value === 'boolean' || typeof value === 'number'
        }
      },
      closeButton: {
        type: Object,
        // 传 object 时得用函数返回，不然属性会被覆盖,跟 data 一个道理
        default() {
          return {
            text: "关闭",
            // 点击关闭按钮的回调函数
            callback: undefined
          }
        }
      },
      enableHtml: {
        type: Boolean,
        default: false
      },
      position: {
        type: String,
        default: "middle",
        validator(value) {
          return ["top", "middle", "bottom"].indexOf(value) >= 0;
        }
      }
    },
    computed: {
      toastClasses() {
        return [`position-${this.position}`];
      }
    },
    mounted() {
      this.updateStyle();
      this.execAutoClose();
    },
    methods: {
      updateStyle() {
        // 实现多行文字父元素需要用到 min-height，此时子元素 height 为 100% 获取不到父元素 height，因此异步获取父元素高
        this.$nextTick(() => {
          this.$refs.line.style.height = `${this.$refs.toast.getBoundingClientRect().height}px`;
        });
      },
      execAutoClose() {
        if (this.autoClose) {
          setTimeout(() => {
            this.close();
          }, this.autoClose * 1000);
        }
      },
      close() {
        this.$el.remove();
        this.$emit("close");
        this.$destroy();
      },
      log() {
        console.log("调用了 toast 的 log 方法");
      },
      onClickClose() {
        this.close();
        if (this.closeButton && typeof this.closeButton.callback === "function") {
          // 调用 callback 传入 this 可让调用回调时拿到 toast 实例，从而调用实例里的方法
          this.closeButton.callback(this);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  $font-size: 14px;
  $toast-min-height: 40px;
  $toast-bg: rgba(0, 0, 0, 0.75);
  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  @keyframes slide-down {
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .wrapper {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    $animation-duration: 300ms;
    &.position-top {
      top: 0;
      .toast {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        animation: slide-down $animation-duration;
      }
    }
    &.position-bottom {
      bottom: 0;
      .toast {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        animation: slide-up $animation-duration;
      }
    }
    &.position-middle {
      bottom: 50%;
      .toast {
        animation: fade-in $animation-duration;
      }
    }
  }
  .toast {
    display: flex;
    align-items: center;
    font-size: $font-size;
    min-height: $toast-min-height;
    line-height: 1.8;
    padding: 0 16px;
    color: white;
    background: $toast-bg;
    border-radius: 4px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
    .message {
      padding: 8px 0;
    }
    .close {
      padding-left: 16px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .line {
      margin-left: 16px;
      height: 100%;
      border-left: 1px solid #666;
    }
  }
</style>

```
然后可以测试自己的插件
<br/>
测试成功之后，我们发布到npm上
:::tip 注意
- 如果想要发布到npm我们需要[注册npm账号](https://cnodejs.org/topic/5823c4411120be9438b02a31)，注册账号很简单，在[npm登录](https://www.npmjs.com/login)的地方点击[注册按钮(Create Account)](https://www.npmjs.com/signup)，就可以注册成功，注册之后需要通过邮箱验证一下，
在我注册的时候发送了很多次都没有成功发送到我的邮箱，然后第二天再尝试发送到邮箱一次就成功了
- 然后在本地使用npm用户： 然后就可以在本地添加用户：
npm adduser
<br/>
username:
<br/>
password:
<br/>
email:
<br/>
查看用户：
npm whoami
:::

在项目有package.json的目录，发布插件，执行如下命令：
```vue
npm run publish
```
发布成功我们可以收到一封邮件，说明发布成功，我们后面就可以通过npm下载使用这个依赖了
<br/>
### 使用插件
```vue{1,3,20-23}
npm i vue-plugin-my-test-toast --save-dev 
因为使用了SASS样式,所以我们还需要css样式的依赖 
npm install css-loader vue-style-loader --save-dev 
还需要在webpack.base.conf.js添加样式scss的解析的规则配置:
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    ....
  },
  resolve: {
    ...
  },
  module: {
    rules: [
      ...
	  // 这里是scss的sass解析样式
      {
        test: /\.scss$/,
        loader: 'sass-loader!style-loader!css-loader',
      },
      ...
    ]
  },
  node: {
    ...
  }
}
```
然后可以在全局注册这个插件
```vue{25-35}
<template>
  <div>
    <button @click="showToast('top')">TOP</button>
    <button @click="showToast('middle')">MIDDLE</button>
    <button @click="showToast('bottom')">BOTTOM</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Toast from '@/plugin'
  Vue.use(Toast)
  export default {
    components: {},
    data() {
      return {}
    },
    filters: {},
    mounted: function () {
      this.$nextTick(function () {
      })
    },
    methods: {
      showToast(pos) {
        this.$toast(`您的余额为<span style="color: red;"> ${parseInt(Math.random() * 100)}</span>. 需要充值`, {
          enableHtml: true, // 是否开启内嵌html元素
          autoClose: false, // 是否自动关闭
          position: pos || 'top', // 展示位置
          closeButton: {  // 关闭按钮配置
            text: '充值',
            callback: (toast) => {
              toast.log() // 关闭后触发 toast 中的方法
            }
          }
        })
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style lang="scss" scoped>
</style>
```

## 路由vue-router2
### 动态路由匹配
我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：
```vue
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```
现在呢，像 /user/foo 和 /user/bar 都将映射到相同的路由。
<br/>
一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：
```vue
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```
你可以在一个路由中设置多段“路径参数”，对应的值都会设置到 $route.params 中。例如：
|模式	                        |匹配路径	            |$route.params                        |
|-------------------------------|:----------------------:|-----------------------------------:|
|/user/:username	            |/user/evan	            |{ username: 'evan' }                 |
|/user/:username/post/:post_id	|/user/evan/post/123	|{ username: 'evan', post_id: '123' } |



## Store
状态管理，相当于一个公共的数据中心，可以在不同组件都从他那里拿数据
<br/>
包括哪些:
- state
- action
- getter
- montain
- modules: 模块
### vue-router: 路由，就是在一个页面的某一个占位位置需要拿指定的哪个组件来填入(或者替换)

### vue的mvvm模型: 就是一个数据的双向绑定，即数据驱动，并且在页面做渲染
里面涉及的内容有对数据的观察者模式、虚拟Dom预处理提高加载的性能等等比较复杂的处理逻辑


