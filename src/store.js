import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 1, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  state: {
    api: 'http://localhost:5000/api/v1',
    categories: [],
    favorites: [],
    categoriesAudits: [],
    favoritesAudits: []
  },
  mutations: {
    setCategories (state, payload) {
      state.categories = payload
    },
    setFavorites (state, payload) {
      state.favorites = payload
    },
    setCategoriesAudits (state, payload) {
      state.categoriesAudits = payload
    },
    setFavoritesAudits (state, payload) {
      state.favoritesAudits = payload
    }
  },
  actions: {
    getCategories ({ state, commit }) {
      let path = `${state.api}` + '/categories'
      let headers = {
        'Content-Type': 'application/json'
      }

      return axios.get(path, { headers: headers }).then(res => {
        commit('setCategories', res.data.data)
      })
    },
    getCategoriesAudits ({ state, commit }) {
      let path = `${state.api}` + '/categories/audits'
      let headers = {
        'Content-Type': 'application/json'
      }
      return axios.get(path, { headers: headers }).then(res => {
        commit('setCategoriesAudits', res.data.data)
      })
    },
    getFavoritesAudits ({ state, commit }) {
      let path = `${state.api}` + '/favorites/audits'
      let headers = {
        'Content-Type': 'application/json'
      }
      return axios.get(path, { headers: headers }).then(res => {
        commit('setFavoritesAudits', res.data.data)
      })
    },
    getFavorites ({ state, commit }, params) {
      let path = `${state.api}` + '/favorites'
      if (params.categoryId) {
        path = `${state.api}` + '/categories/' + params.categoryId + '/favorites'
      }
      let headers = {
        'Content-Type': 'application/json'
      }

      return axios.get(path, { headers: headers }).then(res => {
        commit('setFavorites', res.data.data)
      })
    },
    update ({ state }, data) {
      let headers = {
        'Content-Type': 'application/json'
      }

      let path = `${state.api}` + data.endpoint

      return new Promise((resolve, reject) => {
        axios.put(path, data.payload, { headers: headers })
          .then(res => {
            resolve(res.data.data)
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.message)
            }
          })
      })
    },
    delete ({ state, commit }, endpoint) {
      let headers = {
        'Content-Type': 'application/json'
      }

      let path = `${state.api}` + endpoint
      return new Promise((resolve, reject) => {
        axios.delete(path, { headers: headers })
          .then(() => {
            resolve()
          })
          .catch(error => {
            if (error) {
              reject(error.response.data.message)
            }
          })
      })
    },
    add ({ state }, data) {
      let headers = {
        'Content-Type': 'application/json'
      }
      let path = `${state.api}` + data.endpoint

      return new Promise((resolve, reject) => {
        axios.post(path, data.payload, { headers: headers })
          .then(res => {
            resolve(res.data.data)
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.message)
            }
          })
      })
    }
  }
})
