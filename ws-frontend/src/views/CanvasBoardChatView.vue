<template>
  <div class="container">
    连接状态：{{connectState}}
    <div class="header">
      <div class="color-box">
        <div
            :class="{active: activeColor === c}"
            :style="{background: c}"
            class="pen-color"
            v-for="(c, index) in colors"
            :key="index"
            @click="changeActiveColor(c)"
        ></div>
      </div>
      <div>
        笔画宽度:<select v-model="activeWidth">
        <option v-for="(w, index) in widths" :key="index" :value="w">{{ w }}px</option>
      </select>
      </div>
      <div><button @click="resetCanvas">清空画布</button></div>
    </div>
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";

let colors = ref([
  '#000000',
  '#e32626',
  '#ffa400',
  '#ffdd00',
  '#2eff00',
  '#00ffbd',
  '#0051ff',
  '#bf00ff'

])
let activeColor = ref(colors.value[0])

const changeActiveColor = (c) => {
  activeColor.value = c
}


let widths = ref([1, 2, 4, 8, 10])
let activeWidth = ref(widths.value[0])

const resetCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

let canvas = null
let ctx = null
let ctx2 = null
onMounted(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  ctx2 = canvas.getContext('2d')
  let startPoint = {x: 0, y: 0}
  let painting = false
  canvas.onmousedown = function (e) {
    painting = true
    ctx.beginPath()
    ctx.strokeStyle = activeColor.value
    ctx.lineWidth = activeWidth.value
    ctx.lineJoin = 'round'
    let x = e.offsetX
    let y = e.offsetY
    startPoint = {x, y}
    canvas.onmousemove = function (e) {
      if (!painting) {
        return
      }
      ctx.moveTo(startPoint.x, startPoint.y)
      let newX = e.offsetX
      let newY = e.offsetY
      ws.send(JSON.stringify({point: [startPoint.x, startPoint.y, newX, newY], color: activeColor.value, width: activeWidth.value}))
      ctx.lineTo(newX, newY)
      startPoint = {x: newX, y: newY}
      ctx.stroke()
    }
    canvas.onmouseup = function () {
      painting = false
      canvas.onmousemove = null
    }
    canvas.onmouseleave = canvas.onmouseup
  }
})

const connectState = ref(0)
let ws = new WebSocket('ws://127.0.0.1:3000/chat/canvas-board-chat')
ws.onopen = () => {
  connectState.value = ws.readyState
}
ws.onmessage = (msg) => {
  let data = JSON.parse(msg.data)
  ctx2.save()
  ctx2.strokeStyle = data.color
  ctx2.lineWidth = data.width
  ctx2.beginPath()
  ctx2.moveTo(data.point[0], data.point[1])
  ctx2.lineTo(data.point[2], data.point[3])
  ctx2.stroke()
  ctx2.restore()
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  .color-box{
    display: flex;
    align-items: center;

    .pen-color {
      width: 20px;
      height: 20px;
      border-radius: 50px;
      margin-right: 5px;
      margin-bottom: 5px;

      &.active{
        border: 2px solid red;
        position: relative;
        &:after {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          position: absolute;
          top: 4px;
          left: 4px;
          background: #fff;
          border-radius: 50%;
        }
      }
    }
  }
}

</style>
