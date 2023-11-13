<template>
  <div class="container">
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
onMounted(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
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
      ctx.lineTo(newX, newY)
      startPoint = {newX, newY}
      ctx.stroke()
    }
    canvas.onmouseup = function () {
      painting = false
      canvas.onmousemove = null
    }
    canvas.onmouseleave = canvas.onmouseup
  }
})

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
