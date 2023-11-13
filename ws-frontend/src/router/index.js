import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView  from '../views/ChatView.vue'
import OpenChatView  from '../views/OpenChatView.vue'
import CanvasClockView  from '../views/CanvasClockView.vue'
import CanvasBoardView  from '../views/CanvasBoardView.vue'
import CanvasBallView  from '../views/CanvasBallView.vue'
import CanvasPicView  from '../views/CanvasPicView.vue'
import CanvasBoardChatView  from '../views/CanvasBoardChatView.vue'
import MarkdownView  from '../views/MarkdownView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView
  },
  {
    path: '/open-chat',
    name: 'open-chat',
    component: OpenChatView
  },
  {
    path: '/canvas-clock',
    name: 'canvasClock',
    component: CanvasClockView
  },
  {
    path: '/canvas-board',
    name: 'canvasBoard',
    component: CanvasBoardView
  },
  {
    path: '/canvas-board-chat',
    name: 'CanvasBoardChat',
    component: CanvasBoardChatView
  },
  {
    path: '/canvas-ball',
    name: 'canvasBall',
    component: CanvasBallView
  },
  {
    path: '/canvas-pic',
    name: 'canvasPicView',
    component: CanvasPicView
  },
  {
    path: '/markdown',
    name: 'markdown',
    component: MarkdownView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
