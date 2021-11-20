/*
 * @Description: 2048类游戏
 * @version: 0.1.0
 * @Author: liejiayong(809206619@qq.com)
 * @Date: 2021-11-17 11:54:01
 * @github url: https://github.com/liejiayong/game-Sq2
 * @LastEditors: liejiayong(809206619@qq.com)
 * @LastEditTime: 2021-11-20 17:01:29
 * @FilePath: \tool-library\plugin\js-game-sq1024\src\index.js
    -----------------
    |   |   |   |   |
    -----------------
    |   |   |   |   |
    -----------------
    |   |   |   |   |
    -----------------
    |   |   |   |   |
    -----------------
  the square of 2

  arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] => gridHeight * gridWidth - 1
  pos2coord {x: num%gridWidth , y: ~~(num/gridWidth)}
 */
// (function (win, doc) {
/* util */
/* prettier-ignore */ if(typeof Object.assign!=='function'){Object.defineProperty(Object,'assign',{value:function assign(target,varArgs){'use strict';if(target===null||target===undefined){throw new TypeError('Cannot convert undefined or null to object');}var to=Object(target);for(var index=1;index<arguments.length;index++){var nextSource=arguments[index];if(nextSource!==null&&nextSource!==undefined){for(var nextKey in nextSource){if(Object.prototype.hasOwnProperty.call(nextSource,nextKey)){to[nextKey]=nextSource[nextKey]}}}}return to},writable:true,configurable:true,})}
/* prettier-ignore */ (function(){var lastTime=0;var vendors=['webkit','moz','ms','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame']}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(callback){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){return callback(currTime+timeToCall)},timeToCall);lastTime=currTime+timeToCall;return id}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(id){clearTimeout(id)}}})();
/* prettier-ignore */ (function(){if(typeof window==='undefined'){return}var eventTarget;var supportTouch='ontouchstart'in window;if(!document.createTouch){document.createTouch=function(view,target,identifier,pageX,pageY,screenX,screenY){return new Touch(target,identifier,{pageX:pageX,pageY:pageY,screenX:screenX,screenY:screenY,clientX:pageX-window.pageXOffset,clientY:pageY-window.pageYOffset,},0,0)}}if(!document.createTouchList){document.createTouchList=function(){var touchList=TouchList();for(var i=0;i<arguments.length;i++){touchList[i]=arguments[i]}touchList.length=arguments.length;return touchList}}if(!Element.prototype.matches){Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector}if(!Element.prototype.closest){Element.prototype.closest=function(s){var el=this;do{if(el.matches(s))return el;el=el.parentElement||el.parentNode}while(el!==null&&el.nodeType===1);return null}}var Touch=function Touch(target,identifier,pos,deltaX,deltaY){deltaX=deltaX||0;deltaY=deltaY||0;this.identifier=identifier;this.target=target;this.clientX=pos.clientX+deltaX;this.clientY=pos.clientY+deltaY;this.screenX=pos.screenX+deltaX;this.screenY=pos.screenY+deltaY;this.pageX=pos.pageX+deltaX;this.pageY=pos.pageY+deltaY};function TouchList(){var touchList=[];touchList['item']=function(index){return this[index]||null};touchList['identifiedTouch']=function(id){return this[id+1]||null};return touchList}var initiated=false;function onMouse(touchType){return function(ev){if(ev.type==='mousedown'){initiated=true}if(ev.type==='mouseup'){initiated=false}if(ev.type==='mousemove'&&!initiated){return}if(ev.type==='mousedown'||!eventTarget||(eventTarget&&!eventTarget.dispatchEvent)){eventTarget=ev.target}if(eventTarget.closest('[data-no-touch-simulate]')==null){triggerTouch(touchType,ev)}if(ev.type==='mouseup'){eventTarget=null}}}function triggerTouch(eventName,mouseEv){var touchEvent=document.createEvent('Event');touchEvent.initEvent(eventName,true,true);touchEvent.altKey=mouseEv.altKey;touchEvent.ctrlKey=mouseEv.ctrlKey;touchEvent.metaKey=mouseEv.metaKey;touchEvent.shiftKey=mouseEv.shiftKey;touchEvent.touches=getActiveTouches(mouseEv);touchEvent.targetTouches=getActiveTouches(mouseEv);touchEvent.changedTouches=createTouchList(mouseEv);eventTarget.dispatchEvent(touchEvent)}function createTouchList(mouseEv){var touchList=TouchList();touchList.push(new Touch(eventTarget,1,mouseEv,0,0));return touchList}function getActiveTouches(mouseEv){if(mouseEv.type==='mouseup'){return TouchList()}return createTouchList(mouseEv)}function TouchEmulator(){window.addEventListener('mousedown',onMouse('touchstart'),true);window.addEventListener('mousemove',onMouse('touchmove'),true);window.addEventListener('mouseup',onMouse('touchend'),true)}TouchEmulator['multiTouchOffset']=75;if(!supportTouch){new TouchEmulator()}})();
var isNode = function (value) {
  return value !== undefined && value instanceof HTMLElement && value.nodeType === 1;
};
function isFunction(value) {
  return value && typeof value === 'function';
}
function addEvent(el, evName, fn, isClear) {
  var CONFIG_KEY_ANIMATION_STRING = 'animationend transitionend';
  isClear = isClear || false;

  if (!isNode(el)) throw 'the argument of el is not HTMLElement';
  if (!isFunction(fn)) throw 'the argument of fn must be a function';

  function agency(evt) {
    // console.log('evt,', evt);
    fn.bind(evt)();
    if (~CONFIG_KEY_ANIMATION_STRING.indexOf(evName)) {
      el.removeEventListener(evName, agency);
    }
  }
  el.addEventListener(evName, agency);

  if (isClear) {
    el = null;
  }
}

/* config */
var config = {
  gridWidth: /* 列 */ 4,
  gridHeight: /* 行 */ 4,
  gridSizeWidth: /* 格子宽 */ 100,
  gridSizeHeight: /* 格子高 */ 100,
  gridGap: /* 间隙 */ 20,
  showGridValue: true /* 展示方法数字 */,
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
};
var obj2sty = function obj2sty(obj) {
  var str = '';
  for (var k in obj) {
    str += ';' + k + ':' + obj[k];
  }
  return str;
};
/**
 * 获取每格位置
 * @param {number} width 方块宽度
 * @param {number} height 方块高度
 * @param {number} gap 方块间隔
 * @param {number} ix 方块坐标ix
 * @param {number} iy 方块坐标ix
 * @returns
 */
var getPos = function getPos(width, height, gap, ix, iy) {
  return {
    left: (width + gap) * ix + 'px',
    top: (height + gap) * iy + 'px',
  };
};
/**
 * 通过 getEmptyGridIndexArr INDEX获取坐标
 * @param {number} index
 * @param {number} gridWidth
 * @returns
 */
var getCoordByIndex2Pos = function getCoordByIndex2Pos(index, gridWidth) {
  return {
    x: index % gridWidth,
    y: Math.floor(index / gridWidth),
  };
};
/**
 * 获取空格子,返回空格的 INDEX 数组
 * @param {Array} arr 方块状态数组
 * @returns
 */
var getEmptyGridIndexArr = function getEmptyGridIndexArr(arr) {
  var ret = [];
  //JQ each index在前 OBJ在后 ，map相反
  arr.forEach(function (v, i) {
    if (v == null) {
      ret.push(i);
    }
  });
  return ret;
};
/**
 * 通过x,y获取index
 * @param {number} gridWidth
 * @param {number} x  方块坐标x
 * @param {number} y 方块坐标y
 * @returns
 */
var getIndex = function getIndex(gridWidth, x, y) {
  return gridWidth * y + x;
};
/**
 * 获取格子等级配置参数
 * @param {Array} state 方块状态
 * @param {number} x  方块坐标x
 * @param {number} y 方块坐标y
 * @returns
 */
var getGrid = function getGrid(state, gridWidth, x, y) {
  // console.log('getGrid getIndex', x, y);
  return state[getIndex(gridWidth, x, y)];
};

/**
 * 2048类游戏主引擎
 * @param {Element} el 挂载父元素
 * @param {Object} opts 配置
 */
var Sq2 = function (el, opts) {
  this.config = Object.assign({}, config, opts || {});
  this.el = el;
  this.watcher = [];
  this.slideTimestamp = /* 上一次滑动时间戳 */ 0;
  this.state = Array(this.config.gridHeight * this.config.gridWidth).fill(null);

  this.__init();
};

/**
 * 移动格子
 * @param {string} direction 移动方向
 * @returns
 */
Sq2.prototype.move = function (direction) {
  var t = this,
    state = t.state,
    config = t.config,
    width = config.gridSizeWidth,
    height = config.gridSizeHeight,
    gap = config.gridGap,
    gridWidth = config.gridWidth,
    gridHeight = config.gridHeight,
    slideTimestamp = t.slideTimestamp,
    timestamp = Date.now(),
    startX,
    startY,
    endX,
    endY,
    moveX,
    moveY,
    isCreate;

  // 动画时间。防止动画未结束就开始下一步
  if (timestamp - slideTimestamp < config.animateSpeed) {
    return false;
  } else {
    t.slideTimestamp = timestamp;
  }

  switch (direction) {
    case 'up':
      startX = 0;
      endX = gridWidth - 1;
      startY = 1;
      endY = gridHeight - 1;
      moveX = 0;
      moveY = -1;
      break;
    case 'down':
      startX = 0;
      endX = gridWidth - 1;
      startY = gridHeight - 2;
      endY = 0;
      moveX = 0;
      moveY = 1;
      break;
    case 'right':
      startX = gridWidth - 2;
      endX = 0;
      startY = 0;
      endY = gridHeight - 1;
      moveX = 1;
      moveY = 0;
      break;
    case 'left':
      startX = 1;
      endX = gridWidth - 1;
      startY = 0;
      endY = gridHeight - 1;
      moveX = -1;
      moveY = 0;

      break;
  }
  for (var x = startX; x >= Math.min(startX, endX) && x <= Math.max(startX, endX); startX > endX ? x-- : x++) {
    for (var y = startY; y >= Math.min(startY, endY) && y <= Math.max(startY, endY); startY > endY ? y-- : y++) {
      var gridDom = document.querySelector('.' + config.cls.gridTpl + x + '_' + y);
      var grid = getGrid(state, gridWidth, x, y);
      if (grid == null) continue;
      var target_coordinate = { x: x + moveX, y: y + moveY };
      var target_grid = getGrid(state, gridWidth, target_coordinate.x, target_coordinate.y);
      var moved = 0;
      if (startX == 0) {
        if (startY > endY) {
          //down
          while (target_coordinate.y < gridHeight - 1 && target_grid == null) {
            target_coordinate.y = target_coordinate.y + 1;
            target_grid = getGrid(state, gridWidth, target_coordinate.x, target_coordinate.y);
            if (++moved > Math.max(gridWidth, gridHeight)) break;
          }
          // console.log('move down', target_coordinate, target_grid);
        } else {
          //up
          while (target_coordinate.y > 0 && target_grid == null) {
            target_coordinate.y = target_coordinate.y - 1;
            target_grid = getGrid(state, gridWidth, target_coordinate.x, target_coordinate.y);
            if (++moved > Math.max(gridWidth, gridHeight)) break;
          }
          // console.log('move up', target_coordinate, target_grid);
        }
      } else {
        if (startX > endX) {
          //right
          while (target_coordinate.x < gridWidth - 1 && target_grid == null) {
            target_coordinate.x = target_coordinate.x + 1;
            target_grid = getGrid(state, gridWidth, target_coordinate.x, target_coordinate.y);
            if (++moved > Math.max(gridWidth, gridHeight)) break;
          }
          // console.log('move right', target_coordinate, target_grid);
        } else {
          //left
          while (target_coordinate.x > 0 && target_grid == null) {
            target_coordinate.x = target_coordinate.x - 1;
            target_grid = getGrid(state, gridWidth, target_coordinate.x, target_coordinate.y);

            if (++moved > Math.max(gridWidth, gridHeight)) break;
          }
          // console.log('move left', target_coordinate, target_grid);
        }
      }

      var position = getPos(width, height, gap, target_coordinate.x, target_coordinate.y);
      // console.log('>>>>>>>>>move grid ', gridDom, grid, target_coordinate, target_grid, position);
      /* 目标无方块则移动到目标 */
      if (target_grid == null) {
        state[getIndex(gridWidth, x, y)] = null;
        state[getIndex(gridWidth, target_coordinate.x, target_coordinate.y)] = grid;
        gridDom.style.top = position.top;
        gridDom.style.left = position.left;
        gridDom.className =
          config.cls.grid +
          ' ' +
          grid.class +
          ' ' +
          config.cls.gridTpl +
          target_coordinate.x +
          '_' +
          target_coordinate.y;
      } else if (target_grid.value == grid.value && !target_grid.justModified) {
        /* 目标存在方块 且目标方块与移动方块相同则合并升级 */
        var updateGrid = config.grids[grid.level + 1];
        updateGrid.justModified = true; //判断是否移动过
        state[getIndex(gridWidth, x, y)] = null;
        state[getIndex(gridWidth, target_coordinate.x, target_coordinate.y)] = updateGrid;
        gridDom.style.top = position.top;
        gridDom.style.left = position.left;
        addEvent(
          gridDom,
          'transitionend',
          (function (gridDom, target_coordinate, updateGrid, config) {
            return function () {
              gridDom.style.display = 'none';
              gridDom.className = '';
              var targetDom = document.querySelector(
                  '.' + config.cls.gridTpl + target_coordinate.x + '_' + target_coordinate.y
                ),
                sty = updateGrid.style;
              if (sty) {
                sty = obj2sty(sty);
                targetDom.style.cssText = targetDom.style.cssText + sty;
              }
              // console.log('targetDom', targetDom);
              targetDom.className =
                config.cls.grid +
                ' ' +
                config.cls.gridTpl +
                target_coordinate.x +
                '_' +
                target_coordinate.y +
                ' ' +
                updateGrid.class +
                ' ';
              if (config.showGridValue) targetDom.innerText = updateGrid.value;
              // console.log(merge block:>>>, targetDom, updateGrid);
            };
          })(gridDom, target_coordinate, updateGrid, config)
        );
        /* v1-backup */
        // gridDom.addEventListener(
        //   'transitionend',
        // (function (gridDom, target_coordinate, updateGrid) {
        //   return function () {
        //     gridDom.style.display = 'none';
        //     gridDom.className = '';
        //     var targetDom = document.querySelector('.grid_' + target_coordinate.x + '_' + target_coordinate.y),
        //       sty = updateGrid.style;
        //     sty = obj2sty(sty);
        //     targetDom.innerHTML = updateGrid.value;
        //     targetDom.style.cssText = targetDom.style.cssText + sty;
        //   };
        // })(gridDom, target_coordinate, updateGrid)
        // );
      } else if (target_grid.value != grid.value || moved >= 1) {
        // console.log('moved', moved);
        if (startX == 0) {
          if (startY > endY) {
            //down
            target_coordinate.y = target_coordinate.y - 1;
          } else {
            //up
            target_coordinate.y = target_coordinate.y + 1;
          }
        } else {
          if (startX > endX) {
            target_coordinate.x = target_coordinate.x - 1;
          } else {
            target_coordinate.x = target_coordinate.x + 1;
          }
        }
        if (target_coordinate.x == x && target_coordinate.y == y) {
          continue;
        }
        position = getPos(width, height, gap, target_coordinate.x, target_coordinate.y);
        // console.log('moved pos', moved, position);
        state[getIndex(gridWidth, x, y)] = null;
        state[getIndex(gridWidth, target_coordinate.x, target_coordinate.y)] = grid;

        gridDom.className =
          config.cls.grid +
          ' ' +
          grid.class +
          ' ' +
          config.cls.gridTpl +
          target_coordinate.x +
          '_' +
          target_coordinate.y;
        gridDom.style.top = position.top;
        gridDom.style.left = position.left;
      } else {
        continue;
      }
      isCreate = true;
    }
  }

  //清空移动属性
  for (var i = 0; i < state.length; i++) {
    if (state[i] == null) {
      continue;
    } else if (state[i].justModified) {
      delete state[i].justModified;
    }
  }

  t.watcher.forEach(function (fn) {
    fn && fn.bind(t)({ tag: 'moved', state: state, self: t });
  });

  // console.log('--move state', isCreate, state);
  if (isCreate) {
    setTimeout(t.create.bind(t), config.animateSpeed);
  }
};
/**
 * 创建方块
 * @param {*} level
 * @param {*} ix
 * @param {*} iy
 */
Sq2.prototype.create = function (level, ix, iy) {
  var t = this,
    state = t.state,
    config = t.config,
    grids = config.grids,
    gridWidth = config.gridWidth,
    gridHeight = config.gridHeight,
    width = config.gridSizeWidth,
    height = config.gridSizeHeight,
    gap = config.gridGap,
    emptyGrid = getEmptyGridIndexArr(state);
  // console.log('  Sq2.prototype.create', level, ix, iy, emptyGrid);
  if (!emptyGrid.length) return false;
  if (level > gridHeight * gridWidth - 1 || ix > gridWidth || iy > gridHeight)
    return 'level or x or y out of the range';

  //随机初始数字
  var grid;
  if (level != undefined) {
    grid = grids[level];
  } else {
    grid = Math.random() >= 0.5 ? grids[0] : grids[1];
  }

  //随机位置
  var gridIndex;
  if (ix != undefined && iy != undefined) {
    gridIndex = getIndex(gridWidth, ix, iy);
  } else {
    gridIndex = emptyGrid[Math.floor(Math.random() * emptyGrid.length)];
    // console.log('create gridIndex', emptyGrid, gridIndex, Math.random() * emptyGrid.length);
  }

  // 创建数字格
  var coordinate = getCoordByIndex2Pos(gridIndex, gridWidth),
    curPos = getPos(width, height, gap, coordinate.x, coordinate.y),
    nGrid = document.createElement('div'),
    sty = Object.assign(
      { position: 'absolute', width: width + 'px', height: width + 'px', top: curPos.top, left: curPos.left },
      grid.style || {}
    );
  if (sty) {
    sty = obj2sty(sty);
    nGrid.style.cssText = sty;
  }

  nGrid.className = config.cls.grid + ' ' + grid.class + ' ' + config.cls.gridTpl + coordinate.x + '_' + coordinate.y;
  if (config.showGridValue) nGrid.innerText = grid.value;
  this.el.appendChild(nGrid);
  state[gridIndex] = grid;

  t.watcher.forEach(function (fn) {
    fn && fn.bind(t)({ tag: 'create', state: state, self: t });
  });

  if (emptyGrid.length == 1) {
    var canmove = false;
    for (var x = 0; x < gridWidth && !canmove; x++) {
      for (var y = 0; y < gridHeight && !canmove; y++) {
        if (x > 0 && state[getIndex(gridWidth, x - 1, y)].value == state[getIndex(gridWidth, x, y)].value) {
          canmove = true;
        }
        if (x < gridWidth - 1 && state[getIndex(gridWidth, x + 1, y)].value == state[getIndex(gridWidth, x, y)].value) {
          canmove = true;
        }
        if (y > 0 && state[getIndex(gridWidth, x, y - 1)].value == state[getIndex(gridWidth, x, y)].value) {
          canmove = true;
        }
        if (y < gridWidth - 1 && state[getIndex(gridWidth, x, y + 1)].value == state[getIndex(gridWidth, x, y)].value) {
          canmove = true;
        }
      }
    }

    if (!canmove) {
      console.log('canmove onFinish', state);
      config.onFinish && config.onFinish(state);
      return false;
    }
  }

  return true;
};
/**
 * 开始游戏
 */
Sq2.prototype.start = function () {
  var t = this,
    conf = this.config;
  this.__init();
  this.state = Array(conf.gridHeight * conf.gridWidth).fill(null);
  conf.onReady && conf.onReady();

  t.create();
};
/**
 * 监听滑动、创建方块时回调
 * @param {Function} fn
 */
Sq2.prototype.listen = function (fn) {
  if (!isFunction(fn)) throw 'the argument of fn must be a function';
  this.watcher.push(fn);
};
/**
 * 移除所有监听
 */
Sq2.prototype.removeAllListener = function () {
  this.watcher = [];
};
Sq2.prototype.__init = function () {
  this.el.style.cssText = '-webkit-user-select:none;user-select:none;';
  this.el.innerHTML = '';
};

//   Object.defineProperty(win, 'Sq2', { value: Sq2, writable: false });
// })(window, document);
export default Sq2;
