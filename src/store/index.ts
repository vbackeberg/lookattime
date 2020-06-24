import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomFactor: 1,
    mousePosition: 0
  },
  mutations: {
    setZoomFactor(state, value) {
      state.zoomFactor = value;
    },
    setMousePosition(state, value) {
      state.mousePosition = value;
    }
  },
  actions: {},
  modules: {}
});
