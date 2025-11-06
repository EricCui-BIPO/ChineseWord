import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  // 汉字学习相关路由
  {
    path: '/word',
    name: 'WordHome',
    component: () => import('@/views/WordHome.vue')
  },
  {
    path: '/study',
    name: 'Study',
    component: () => import('@/views/StudyMode.vue')
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/views/ReviewMode.vue')
  },
  // 成语学习相关路由
  {
    path: '/idiom',
    name: 'IdiomHome',
    component: () => import('@/views/IdiomHome.vue')
  },
  {
    path: '/idiom/study',
    name: 'IdiomStudy',
    component: () => import('@/views/IdiomStudyMode.vue')
  },
  {
    path: '/idiom/review',
    name: 'IdiomReview',
    component: () => import('@/views/IdiomReviewMode.vue')
  },
  // 五子棋游戏路由
  {
    path: '/gomoku',
    name: 'Gomoku',
    component: () => import('@/views/GomokuGame.vue')
  },
  // 贪吃蛇游戏路由
  {
    path: '/snake',
    name: 'Snake',
    component: () => import('@/views/SnakeGame.vue')
  },
  // 抓娃娃游戏路由
  {
    path: '/claw-machine',
    name: 'ClawMachine',
    component: () => import('@/views/ClawMachineGame.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

