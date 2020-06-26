import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomLevel: 1,
    zoomFactor: 1,
    mousePosition: 0,
  },
  mutations: {
    setZoomLevel(state, value) {
      state.zoomLevel = value;
    },
    setZoomFactor(state, value) {
      state.zoomFactor = value;
    },
    setMousePosition(state, value) {
      state.mousePosition = value;
    },
  },
  actions: {},
  modules: {},
});
