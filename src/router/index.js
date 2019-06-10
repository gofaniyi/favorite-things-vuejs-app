import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/Categories.vue')
    },
    {
      path: '/favorites/add',
      name: 'favoriteadd',
      component: () => import('../views/Favorite.vue')
    },
    {
      path: '/favorites/:id/edit',
      name: 'favoriteedit',
      component: () => import('../views/Favorite.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/Favorites.vue')
    }
  ]
})

export default router
