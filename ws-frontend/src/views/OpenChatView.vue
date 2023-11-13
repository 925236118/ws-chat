<template>
  <div class="open-chat">

    <div class="header">
      <div class="header-container">

        <RadioGroup class="tab" v-model="activeTab" type="button" button-style="solid">
          <Radio
              v-for="(tab, index) in tabList"
              :key="index"
              @click="changeTab(tab)"
              :label="tab.name"
          >{{tab.title}}</Radio>
        </RadioGroup>
        <div class="logo"><Icon type="ios-chatbubbles" /></div>
        <remaindPoint class="remaind-point"></remaindPoint>
        <Button type="default" size="default" style="font-size: 18px" class="clear" @click="clearMessageList" shape="circle"><Icon type="md-trash" /></Button>
      </div>
    </div>

    <div class="container">
      <Form action="./" inline v-if="activeTab === 'chat'" :disabled="dis">
        <FormItem label="">
          <Checkbox v-model="useContext">使用上下文</Checkbox>
        </FormItem>
        <FormItem>
          <Select v-model="messageRole">
            <Option v-for="(op, index) in roleList" :value="op">{{ op }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input @on-enter="submit" clearable type="text" v-model="inputValue" class="question-input" />
        </FormItem>
        <FormItem>
          <Button @click="submit">提交</Button>
        </FormItem>
      </Form>

      <Form inline v-if="activeTab === 'image'" :disabled="dis">
        <FormItem>
          <Input @on-enter="submitImage" clearable type="text" v-model="inputValue" class="question-input" />
        </FormItem>
        <FormItem>
          <Select v-model="drawStyle">
            <Option v-for="(op, index) in drawStyleOptions" :value="op.value">{{ op.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="drawSize">
            <Option v-for="(op, index) in drawSizeOptions" :value="op.value">{{ op.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="drawModel">
            <Option v-for="(op, index) in drawModelOptions" :value="op">{{ op }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button @click="submitImage">提交</Button>
        </FormItem>
      </Form>

      <List id="messageList" class="message-list" border>
        <ListItem class="message-item" v-for="(message, index) in messageList" :key="index">
          <div>
            <span class="type" :class="{[message.type]: true}">{{ message.type }}</span>
          </div>
          <div class="content">
            <template v-if="message.type !== 'image'">
              <p v-for="(mp, index) in message.content.split('\n').filter(m => m)" :key="index">{{mp}}</p>
            </template>
            <template v-else>
              <img width="500" height="500" :src="message.content" />
            </template>
          </div>
        </ListItem>
      </List>
    </div>
  </div>
</template>

<script setup>
import {nextTick, ref} from "vue";
import remaindPoint from '../components/RemaindPoint.vue'
import { ajax } from '@/utils/require'
import {Button, Checkbox, List} from "view-ui-plus";

let tabList = ref([
  {
    name: 'chat',
    title: '对话',
  },
  {
    name: 'image',
    title: '图片',
  },
])
let activeTab = ref(tabList.value[0].name)

let drawModelOptions = ref([
  'stable-diffusion-xl-1024-v1-0',
  'stable-diffusion-xl-1024-v0-9',
  'stable-diffusion-xl-beta-v2-2-2',
  'stable-diffusion-512-v2-1',
  'stable-diffusion-v1-5'
])
let drawModel = ref('stable-diffusion-xl-1024-v1-0')
let drawStyleOptions = ref([
  {value: '3D', label: '3D (3d-model)'},
  {value: '胶片', label: '胶片 (analog-film)'},
  {value: '动漫', label: '动漫 (anime)'},
  {value: '剧场', label: '剧场 (cinematic)'},
  {value: '卡通', label: '卡通 (comic-book)'},
  {value: '数字', label: '数字 (digital-art)'},
  {value: '增强', label: '增强 (enhance)'},
  {value: '奇幻', label: '奇幻 (fantasy-art)'},
  {value: '投影', label: '投影 (isometric)'},
  {value: '线画', label: '线画 (line-art)'},
  {value: '多边形', label: '多边形 (low-poly)'},
  {value: '复合', label: '复合 (modeling-compound)'},
  {value: '霓虹', label: '霓虹 (neon-punk)'},
  {value: '折纸', label: '折纸 (origami)'},
  {value: '摄影', label: '摄影 (photographic)'},
  {value: '像素', label: '像素 (pixel-art)'},
  {value: '纹理', label: '纹理 (tile-textur)'}
])
let drawStyle = ref('卡通')

let drawSizeOptions = ref([
  {value: '256x256', label: '256x256(80p)'},
  {value: '512x512', label: '512x512(90p)'},
  {value: '1024x1024', label: '1024x1024(100p)'}
])
let drawSize = ref('1024x1024')

let inputValue = ref('')
let messageList = ref([])
let contextId = ref(null)
let dis = ref(false)
let useContext = ref(true)

let roleList = ref([
  'system',
  'user',
  'assistant'
])
let messageRole = ref(roleList.value[1])
const changeTab = function (tab) {
  activeTab.value = tab.name
}

const submit = function () {
  if (!inputValue.value) return
  messageList.value.push({type: messageRole.value, content: inputValue.value})

  if (messageRole.value === 'system') {
    inputValue.value = ''
    nextTick(() => {
      const messageListDom = document.getElementById('messageList')
      const domHeight = messageListDom.scrollHeight
      messageListDom.scrollTo(0, domHeight + 500)
    })
    return
  }

  dis.value = true

  let messages = []
  if (useContext.value) {
    messages = messageList.value
        .filter(message => roleList.value.indexOf(message.type) !== -1)
        .map(message => ({role: message.type, content: message.content}))
  } else {
    messages = [
      {role: messageRole.value, content: inputValue.value}
    ]
  }
  let data = {
    message: messages
  }
  ajax('http://localhost:3000/open-ai/chat', {
    method: 'post',
    body: JSON.stringify(data)
  }).then((res) => {
    if (res.choices && res.choices[0].message.content) {
      messageList.value.push({type: 'assistant', content: res.choices[0].message.content})
      inputValue.value = ''
    }
  }).catch(e => {
    console.error(e)
  }).finally(() => {
    dis.value = false
    nextTick(() => {
      const messageListDom = document.getElementById('messageList')
      const domHeight = messageListDom.scrollHeight
      messageListDom.scrollTo(0, domHeight + 500)
    })
  })
}

const submitImage = function () {
  if (!inputValue.value) return
  messageList.value.push({type: 'draw', content: inputValue.value})
  dis.value = true
  let promptString = `@draw:${drawStyle.value}:${drawModel.value} ${inputValue.value}`
  let data = {
    prompt: promptString,
    size: drawSize.value
  }
  ajax('http://localhost:3000/open-ai/draw', {
    method: 'post',
    body: JSON.stringify(data),
  }).then((res) => {
    messageList.value.push({type: 'image', content: res.data[0].url})
    inputValue.value = ''
  }).catch(e => {
    console.error(e)
  }).finally(() => {
    dis.value = false
    nextTick(() => {
      const messageListDom = document.getElementById('messageList')
      const domHeight = messageListDom.scrollHeight
      messageListDom.scrollTo(0, domHeight + 500)
    })
  })
}

const clearMessageList = () => {
  messageList.value = []
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.open-chat {
  .container {
    width: 80%;
    margin: 0 auto;
  }
  .header {
    width: 100%;
    background: #58b2ff;
    height: 50px;
    .header-container {
      position: relative;
      width: 80%;
      margin: 0 auto;
      display: flex;
      padding-top: 10px;
      .logo {
        flex: 10;
        text-align: center;
        color: #ffffff;
        font-size: 20px;

      }
      .tab {
        //position: absolute;
        //top: 10px;
        //display: flex;
        li {
          list-style: none;
          width: 50px;
          background: #ffffff;
          border: 1px solid #cbcbcb;
          text-align: center;
          cursor: pointer;
          &.active {
            background: cornsilk;
          }
        }
      }

      .remaind-point {
        flex: 1;
        //position: absolute;
        //right: 0px;
        //top: 15px;
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      .clear {
        //position: absolute;
        //right: 90px;
        //top: 10px;

      }
    }
  }


  .question-input {
    width: 300px;
  }
  .message-list {
    height: 700px;
    overflow-y: scroll;
    //border: 1px solid #000;

    .message-item {
      margin: 5px 0;
      display: flex;
      align-items: flex-start;

      .type {
        padding: 0 3px;
        border-radius: 3px;
        display: inline-block;
        width: 80px;
        text-align: center;
        color: white;
        margin: 0 10px;

        &.system {
          background: #ffe066;
        }

        &.user {
          background: #66b9ff;
        }

        &.assistant {
          background: #ff2554;
        }

        &.draw {
          background: #ff6bfa;
        }

        &.image {
          background: #ffbc29;
        }
      }
      .content {
        p {
          margin-bottom: 5px;
        }
      }
    }
  }
}

.ivu-form-item {
  margin-bottom: 3px;
}
</style>
