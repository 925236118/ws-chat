<script setup>
import {onMounted, ref} from "vue";
let canvas = null
let ctx = null
let colors = [
  '#000000',
  '#e32626',
  '#ffa400',
  '#ffdd00',
  '#2eff00',
  '#00ffbd',
  '#0051ff',
  '#bf00ff'
]
let ballArr = []
class Ball {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.dx = (Math.random() * 2) * [1, -1][Math.floor(Math.random() * 2)]
    this.dy = (Math.random() * 2) * [1, -1][Math.floor(Math.random() * 2)]
    if (this.dx + this.dy < 3) {
      this.dx += 1
      this.dy += 1
    }
    this.outScreen = false
    ballArr.push(this)
  }
  draw (ctx) {
    this.x = this.x + this.dx
    this.y = this.y + this.dy
    if ((this.x > canvas.width || this.x < 0) && (this.y > canvas.height || this.y < 0)) {
      this.outScreen = true
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}
const fps = ref(0)
let before = Date.now()
let now
let playing = false
let drawBallArr = () => {
  // console.log(ballArr.length);
  if (!ballArr.length) {
    playing = false
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ballArr.forEach(ball => {
    ball.draw(ctx)
  })
  for(let i = ballArr.length - 1; i>=0; i--) {
    if (ballArr[i].outScreen) {
      ballArr.splice(i, 1)
    }
  }

  ctx.restore()
  now = Date.now()
  fps.value = Math.ceil(1000 / (now - before))
  before = now
  requestAnimationFrame(drawBallArr)
}
const startAnimationLoop = () => {
  if (playing) {
    return
  }
  if (ballArr.length) {
    playing = true
    requestAnimationFrame(drawBallArr)
  }
}
onMounted(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.onmousemove = function (e) {
    new Ball(e.offsetX, e.offsetY, Math.random() * 20 + 10)
    startAnimationLoop()
  }


})
</script>

<template>
  <div class="container">
    {{ fps }}<br>
    <canvas id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<style scoped lang="scss">

</style>
