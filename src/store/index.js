import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      isAuthenticated: !!localStorage.getItem('accessToken')
    }
  },
  mutations: {
    setAuth(state, isAuthenticated) {
      state.auth.isAuthenticated = isAuthenticated;
    }
  }
});