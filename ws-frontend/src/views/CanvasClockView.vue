<template>
  <div class="container">
    <canvas id="canvas" height="500" width="500"></canvas>
  </div>
</template>

<script setup>
import {onMounted} from "vue";

let canvas = null
let ctx = null
const drawClock = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let now = new Date()
  let h = now.getHours()
  h = h > 12 ? h - 12 : h
  let min = now.getMinutes()
  let sec = now.getSeconds()

  ctx.save()
  ctx.translate(250, 250)
  ctx.rotate(Math.PI * -0.5)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1

  ctx.save()
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.rotate(Math.PI / 6)
    ctx.moveTo(105, 0)
    ctx.lineTo(120, 0)
    ctx.fillText(i + 1, 90, 4)
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.lineWidth = 3
  for (let i = 0; i < 60; i++) {
    ctx.beginPath()
    ctx.moveTo(115, 0)
    ctx.lineTo(120, 0)
    ctx.rotate(Math.PI / 30)
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.rotate(Math.PI / 6 * h + Math.PI / 30 / 12 * min)
  ctx.lineWidth = 5
  ctx.strokeStyle = 'black'
  ctx.moveTo(-10, 0)
  ctx.lineTo(50, 0)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.rotate(Math.PI / 30 * min)
  ctx.lineWidth = 3
  ctx.strokeStyle = 'black'
  ctx.moveTo(-10, 0)
  ctx.lineTo(80, 0)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.rotate(Math.PI / 30 * sec)
  ctx.lineWidth = 3
  ctx.strokeStyle = 'red'
  ctx.moveTo(-10, 0)
  ctx.lineTo(80, 0)
  ctx.stroke()
  ctx.restore()

  ctx.restore()

  requestAnimationFrame(drawClock)
}
onMounted(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  drawClock()



})
</script>

<style>
#canvas {
  border: 1px solid #000;
}
</style>
