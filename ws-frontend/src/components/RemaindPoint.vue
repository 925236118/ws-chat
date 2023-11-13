<template>
  <div class="remaind-point">
    <span class="point">{{points}}</span>
    <span class="refresh" @click="getRemaindPoint"><Icon type="md-refresh" /></span>
  </div>
</template>

<script setup>
import { ajax } from '@/utils/require'
import {onMounted, ref} from "vue";

const points = ref(0)
const getRemaindPoint = () => {
  ajax('http://localhost:3000/open-ai/billing', {
    method: 'get'
  })
    .then(res => {
      points.value = res.total_available
    })
}
onMounted(() => {
  getRemaindPoint()
  setInterval(() => {
    getRemaindPoint()
  }, 60 * 1000)
})
</script>

<style scoped lang="scss">
.remaind-point {
  color: white;
  .point {
    display: inline-block;
    margin-right: 5px;
  }
  .refresh {
    cursor: pointer;
  }
}
</style>
