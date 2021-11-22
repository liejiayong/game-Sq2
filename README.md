# Sq2

1024 类型游戏 JavaScript 原生插件 [效果预览](https://codepen.io/liejiayong/pen/KKvYRab)

由于公司业务需要，于是将 1024 类型游戏封装为插件，方便日后复用~

## 特性

- 兼容 pc ie9+ 及现代浏览器
- 支持移动端
- 支持可配置

<!-- ## Usage -->

<!-- ## install

```bash

npm i scratchers -S

``` -->

## use

首先创建元素

```html
<div id="gamePanel" class="game-stage"></div>
```

接着由于插件没有使用 JavaScript 为每个方块添加滑动动画，因此需要在每个方块设置动效

```css
.game-grid {
  transition: all 0.3s linear;
}
```

最后创建实例对象

```js
// 如果是移动端。本比例运算为解决移动端devicePixelRatio问题，按照设备实际尺寸来设置方块。现以移动端视觉稿宽为750为例进行换算，如：
var winWidth = $(window).width(),
  width = (winWidth / 7.5) * 1.52 /* 获取方块实际长度 */,
  height = (winWidth / 7.5) * 1.44 /* 获取方块实际高度 */,
  gap = (winWidth / 7.5) * 0.06; /* 获取方块实际间隔 */
width = Number(width.toFixed(2));
gap = Number(gap.toFixed(2));

// 如果是pc web端。使用视觉稿实际尺寸即可，如：
var width = 20,
  height = 20,
  gap = 20;

/* 上述移动端、pc web端二选一，根据实际情况来设置width、height、gap尺寸 */

// 初始化
var sq2Install = new Sq2(document.querySelector('#gamePanel'), {
  gridSizeWidth: width,
  gridSizeHeight: height,
  gridGap: gap,
  onReady: function () {
    console.log('>>>开始游戏前钩子函数');
  },
  onFinish: function () {
    console.log('>>>游戏结束钩子函数');
  },
  showGridValue: true /* 方块DOM是否展示文本，文本为grids每一项的value */,
  cls: {
    grid: 'game-grid' /* 方块通用类名 */,
    gridTpl: 'grid_' /* 动态方块类名prifix，用于记录方块的坐标 */,
  },
  /*
  方块状态。
  假设grids的每个方块为gird，
  因此单个gird为{ level: 0, value: 2, class: 'ico-g2', style: { 'background-color': 'rgb(166 78 221)', color: 'rgb(255,247,235)' } }

  对于每个方块的背景设置2中情景：
  情景一：使用class类名设置背景
  情景二：使用style内联样式设置背景

  上述情景二选一

  */
  grids: [
    { level: 0, value: 2, class: 'ico-g2' },
    {
      level: 1,
      value: 4,
      style: {
        'background-color': 'rgb(166 78 221)',
        color: 'rgb(255,247,235)',
      } /* 方块类名，用于方块设置内联样式的情景 */,
      // class: 'ico-g4', /* 方块类名，用于方块设置类名的情景 */,
    },
    {
      level: 2,
      value: 8,
      style: { 'background-color': 'rgb(242,177,121)', color: 'rgb(255,247,235)' },
      // class: 'ico-g8',
    },
    {
      level: 3,
      value: 16,
      style: { 'background-color': 'rgb(245,149,99)', color: 'rgb(255,247,235)' },
      // class: 'ico-g16',
    },
    {
      level: 4,
      value: 32,
      style: { 'background-color': 'rgb(237,93,59)', color: 'rgb(255,247,235)' },
      // class: 'ico-g32',
    },
    {
      level: 5,
      value: 64,
      style: { 'background-color': 'rgb(236,206,112)', color: 'rgb(255,247,235)' },
      // class: 'ico-g64',
    },
    {
      level: 6,
      value: 128,
      style: { 'background-color': 'rgb(237,204,97)', color: 'rgb(255,247,235)' },
      // class: 'ico-g128',
    },
    {
      level: 7,
      value: 256,
      style: { 'background-color': 'rgb(236,200,80)', color: 'rgb(255,247,235)' },
      // class: 'ico-g256',
    },
    {
      level: 8,
      value: 512,
      style: { 'background-color': 'rgb(237,197,63)', color: 'rgb(255,247,235)' },
      // class: 'ico-g512',
    },
    {
      level: 9,
      value: 1024,
      tyle: { 'background-color': 'rgb(238,194,46)', color: 'rgb(255,247,235)' },
      // class: 'ico-g1024',
    },
    {
      level: 10,
      value: 2048,
      style: { 'background-color': 'rgb(61,58,51)', color: 'rgb(255,247,235)' },
      // class: 'ico-g2048',
    },
    {
      level: 11,
      value: 4096,
      style: { 'background-color': 'rgb(141 144 251)', color: 'rgb(255,247,235)' },
      // class: 'ico-g4096',
    },
    {
      level: 12,
      value: 8192,
      style: { 'background-color': 'rgb(166 78 221)', color: 'rgb(255,247,235)' },
      // class: 'ico-g8192',
    },
  ],
  animateSpeed: 300,
});
```

## API

### Sq2(el, config)

构造函数 Sq2 需要配置挂载元素 el 和配置项 config

配置项默认参数如下

```js
{
  gridWidth: /* 列 */ 4,
  gridHeight: /* 行 */ 4,
  gridSizeWidth: /* 格子宽 */ 100,
  gridSizeHeight: /* 格子高 */ 100,
  gridGap: /* 间隙 */ 20,
  showGridValue: true /* 展示方块数字。方块DOM是否展示文本，文本为grids每一项的value */,
  /* 类命名空间 */
  cls: {
    grid: 'game-grid',
    gridTpl: 'grid_',
  },
  //grids的数组 方便修改 复用性强
  grids: [
    { level: 0, value: 2, style: { 'background-color': 'rgb(238,228,218)', color: 'black' } },
    {
      level: 1,
      value: 4,
      style: { 'background-color': 'rgb(238,224,200)', color: 'rgb(124,115,106)' },
    },
    {
      level: 2,
      value: 8,
      style: { 'background-color': 'rgb(242,177,121)', color: 'rgb(255,247,235)' },
    },
    {
      level: 3,
      value: 16,
      style: { 'background-color': 'rgb(245,149,99)', color: 'rgb(255,247,235)' },
    },
    {
      level: 4,
      value: 32,
      style: { 'background-color': 'rgb(237,93,59)', color: 'rgb(255,247,235)' },
    },
    {
      level: 5,
      value: 64,
      style: { 'background-color': 'rgb(236,206,112)', color: 'rgb(255,247,235)' },
    },
    {
      level: 6,
      value: 128,
      style: { 'background-color': 'rgb(237,204,97)', color: 'rgb(255,247,235)' },
    },
    {
      level: 7,
      value: 256,
      style: { 'background-color': 'rgb(236,200,80)', color: 'rgb(255,247,235)' },
    },
    {
      level: 8,
      value: 512,
      style: { 'background-color': 'rgb(237,197,63)', color: 'rgb(255,247,235)' },
    },
    {
      level: 9,
      value: 1024,
      style: { 'background-color': 'rgb(238,194,46)', color: 'rgb(255,247,235)' },
    },
    {
      level: 10,
      value: 2048,
      style: { 'background-color': 'rgb(61,58,51)', color: 'rgb(255,247,235)' },
    },
    {
      level: 11,
      value: 4096,
      style: { 'background-color': 'rgb(141 144 251)', color: 'rgb(255,247,235)' },
    },
    {
      level: 12,
      value: 8192,
      style: { 'background-color': 'rgb(166 78 221)', color: 'rgb(255,247,235)' },
    },
  ],
  animateSpeed: 300,
}
```

### Sq2.prototype.start()

初始化游戏

```js
sq2Install.start();
```

### Sq2.prototype.move(direction)

定义方块移动方法。可更加实际情况调用，如键盘方向盘、鼠标手势、移动端手势

方块可移动方向：

- up
- down
- left
- right

```js
sq2Install.move('up');
sq2Install.move('down');
sq2Install.move('left');
sq2Install.move('right');
```

### Sq2.prototype.removeAllListener()

移除监听方块的 listen 对象

```js
sq2Install.removeAllListener();
```

### Sq2.prototype.listen(fn)

添加方块创建时、移动时的监听事件。在方块移动、创建时触发

```js
/**
 * tag:create|move，事件标签。
 * state: Sq2创建时定义的grids方块状态
 * self: sq2Install实例对象
 *
 * */
sq2Install.listen(function ({ tag, state, self }) {
  console.log(`事件触发啦，当前标签为：${tag}，方块状态为：${state}，实例对象：${self}`);
});
```
