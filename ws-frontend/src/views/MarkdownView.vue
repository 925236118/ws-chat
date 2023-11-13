<template>
  <div class="markdown-view">
    <div class="markdown-editor">
      <textarea v-model="inputValue" :style="{height: `${textareaHeight}px`}" @change="inputChange"></textarea>
    </div>
    <div ref="htmlResult" class="theme-atom-one-dark markdown-body markdown-render-result" v-html="renderedResult"></div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import {computed, nextTick, onMounted, ref, watch} from "vue";

// import hljs from 'highlight.js/lib/core'
import hljs from 'highlight.js';
// import '../assets/theme.css'
// hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
// hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))

const md = new MarkdownIt({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const inputValue = ref('')

const htmlResult = ref(null)

const renderedResult = computed(() => {
  return md.render(inputValue.value)
})


const textareaHeight = ref(0)

const inputChange = () => {
}

onMounted(() => {
  // console.log(window.screen.height);
  textareaHeight.value = window.visualViewport.height - 5
})
</script>

<style lang="scss" scoped>

/* 去除默认样式 */
//textarea {
//  border: none;
//  outline: none;
//  padding: 0;
//  margin: 0;
//  -webkit-appearance: none;
//  -moz-appearance: none;
//  appearance: none;
//  background-image: none;
//  background-color: transparent;
//  font-size: inherit;
//  width: 100%;
//}
//
//textarea:focus {
//  outline: none;
//}

/* 自定义样式 */
//.mo-textarea {
//  display: inline-block;
//  resize: vertical;
//  padding: 5px 15px;
//  line-height: 1.5;
//  box-sizing: border-box;
//  //color: #606266;
//  //background-color: #fff;
//  border: 1px solid #dcdfe6;
//  border-radius: 4px;
//  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
//}

/* 提示文字 */
//.mo-textarea::placeholder {
//  color: #c0c4cc;
//}

/* 鼠标hover */
//.mo-textarea:hover {
//  border-color: #c0c4cc;
//}

/* 获得焦点 */
//.mo-textarea:focus {
//  border-color: #3677f0;
//}


.markdown-view {
  height: 100%;
  display: flex;

  .markdown-editor {
    border-right: 1px solid #dcdfe6;
    width: 50%;
    //background: #66b9ff;
    textarea {
      padding: 20px;
    }
  }

  .markdown-render-result {
    width: 50%;
    padding: 20px;
    //background: #ffbc29;
  }
}
</style>
