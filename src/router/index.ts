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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

