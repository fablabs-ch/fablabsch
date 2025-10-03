import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'

// Lazy load route components for code splitting
const Map = () => import('./pages/Map.vue')
const Labs = () => import('./pages/Labs.vue')
const Machines = () => import('./pages/Machines.vue')
const Space = () => import('./pages/Space.vue')
const About = () => import('./pages/About.vue')

const routes = [
  { path: '/', redirect: '/map' },
  { path: '/map/', component: Map },
  { path: '/labs/', component: Labs },
  { path: '/machines/', component: Machines },
  { path: '/space/:id', component: Space },
  { path: '/about/', component: About },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: decodeURIComponent(to.hash),
            top: 100,
            behavior: 'smooth',
          })
        }, 100)
      })
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

const vuetify = createVuetify({
  // Tree-shaking: Only import components/directives when vuetify autoImport is enabled
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#E10707',
          secondary: '#FFFFFF',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')

