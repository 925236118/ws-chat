<template>
  <div class="container">
    <div class="header">
      用户名: <input type="text" v-model="username" :disabled="connectState">
      连接状态:<span :class="{connected: connectState, disconnected: !connectState}">{{connectState ? '已连接' : '未连接'}}</span>
      <template v-if="!ws || ws.readyState === 3">
        <button @click="connectServer">连接</button>
      </template>
      <template v-else>
        <button @click="disconnectServer">断开</button>
        <button @click="reconnect">重连</button>
      </template>
    </div>
    <div class="input-container">
      <textarea class="chat-input" name="" id="" cols="30" rows="10" v-model="message" :disabled="!connectState"></textarea>
    </div>
    <div class="footer">
      <button @click="sendMessage" :disabled="!connectState">发送</button>
    </div>
    <ul class="message-list">
      <li v-for="(msgItem, index) in reverseMsgList" :key="index" :class="msgItem.type" class="message-item">
        <span class="username">{{ msgItem.username }}</span> @
        <span class="datetime">{{formatTimeString(msgItem.time)}}</span> :
        <span class="content">{{ msgItem.content }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";

let connectState = ref(false)
const wsInit = () => {
  let ws = new WebSocket('ws://127.0.0.1:3000/chat')
  ws.onopen = () => {
    msgList.value.push({type: 'info', username: '你', content: '连接成功', time: new Date()})
    connectState.value = true
    ws.send(JSON.stringify({type: 'server', username: username.value, content: 'connected', time: new Date()}))
  }
  ws.onmessage = (msg) => {
    let messageData = JSON.parse(msg.data)
    let listShowTypes = ['info', 'error', 'message']
    if (listShowTypes.includes(messageData.type)) {
      msgList.value.push(messageData)
    } else if (messageData.type === 'echo') {
      messageData.username = '你'
      msgList.value.push(messageData)
    } else if (messageData.type === 'init') {
      msgList.value = [
        ...msgList.value.filter(item => ['info', 'error'].includes(item.type)),
        ...messageData.content
      ]

    }
  }
  ws.onclose = () => {
    msgList.value.push({type: 'info', username: '你', content: '连接断开', time: new Date()})
    connectState.value = false
  }
  return ws
}
// ws.value.readyState
// 1 已连接
// 3 已断开
let ws = ref(null)

let message = ref('')
let username = ref('')
let msgList = ref([])
const reverseMsgList = computed(() => {
  let result = []
  for (let i = msgList.value.length - 1; i >= 0; i--) {
    result.push(msgList.value[i])
  }
  return result
})
const reconnect = () => {
  if (ws.value.readyState === 1) {
    ws.value.close()
  }
  ws.value = wsInit()
}
const connectServer = () => {
  if (!username.value) {
    msgList.value.push({type: 'error', username: '你', content: '用户名不能为空', time: new Date()})
    return
  }
  ws.value = wsInit()
}
const disconnectServer = () => {
  ws.value.close()
}
const formatTimeString = (time) => {
  if (!time) {
    return ''
  }
  time = new Date(time)
  let y = time.getFullYear()
  let mon = ('0' + time.getMonth()).slice(-2)
  let d = ('0' + time.getDate()).slice(-2)
  let h = ('0' + time.getHours()).slice(-2)
  let m = ('0' + time.getMinutes()).slice(-2)
  let s = ('0' + time.getSeconds()).slice(-2)
  return `${y}/${mon}/${d} ${h}:${m}:${s}`
}
const sendMessage = () => {
  if (!message.value) {
    return
  }
  let data = {type: 'message', username: username.value, content: message.value, time: new Date()}
  ws.value.send(JSON.stringify(data))
  message.value = ''
}


</script>

<style scoped lang="stylus">
.container
  width 90%
  margin 0 auto
  height 100%
  background #eee
  padding-bottom 20px
  .header
    width 95%
    margin 0 auto 10px auto
    padding-top 10px

    .connected
      color green

    .disconnected
      color red

  .input-container
    width 100%
    text-align center
    .chat-input
      width 95%
      height 50px

  .footer
    width 95%
    margin 5px auto 0 auto
    padding-bottom 10px

  .message-list
    height 300px
    width 95%
    margin 0 auto
    background #fff
    padding-left 0
    overflow-y scroll

    .message-item
      padding 1px 5px
      list-style-type none

      &:nth-child(even)
        background #eee

      .username
        color black
      .datetime
        color black
      .content
        color black
        word-break break-all

      &.info
        .username
          color black
        .datetime
          color black
        .content
          color #31b9e5
      &.error
        .username
          color black
        .datetime
          color black
        .content
          color red
      &.message
        .username
          color black
        .datetime
          color black
        .content
          color black

</style>
