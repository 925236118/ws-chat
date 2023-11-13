<script setup>
import {onMounted} from "vue";
let canvas = null
let ctx = null
onMounted(() => {
  const img = new Image()
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  img.onload = () => {
    ctx.transform(1, 0.2, 1, 1, 0, 0)
    ctx.drawImage(img, 100, 100, 100, 100)
  }
  img.src = '/img1.jpg'

  canvas.onmousemove = function (e) {
    console.log('move')
    let offsetX = e.offsetX
    let offsetY = e.offsetY
    let centerX = canvas.width / 2
    let centerY = canvas.height / 2
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.transform(1, 0.2, 1, 1, 0, 0)
    ctx.drawImage(img, canvas.width / 2 - 100, canvas.height / 2 - 100, canvas.width / 2 + 100, canvas.height / 2 + 100)
  }
})
</script>

<template>
  <div class="container">
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<style scoped lang="stylus">

</style>
