import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'
import Map from './pages/Map.vue'
import Labs from './pages/Labs.vue'
import Machines from './pages/Machines.vue'
import Space from './pages/Space.vue'
import About from './pages/About.vue'

const routes = [
  { path: '/', redirect: '/map' },
  { path: '/map/', component: Map },
  { path: '/labs/', component: Labs },
  { path: '/machines/', component: Machines },
  { path: '/space/:id', component: Space },
  { path: '/about/', component: About },
]

const router = createRouter({
  history: createWebHistory(),
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
  components,
  directives,
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

