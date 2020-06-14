import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomFactor: 1
  },
  mutations: {
    updateZoom(state, value) {
      state.zoomFactor = value;
    }
  },
  actions: {},
  modules: {}
});
