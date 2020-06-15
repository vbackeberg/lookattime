import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomFactor: 1,
    middle: 500
  },
  mutations: {
    updateZoom(state, value) {
      state.zoomFactor = value;
    },
    increaseZoom(state) {
      const zoomFactor = state.zoomFactor + 0.1;

      if (zoomFactor <= 3) {
        state.zoomFactor = zoomFactor;
      }
    },
    decreaseZoom(state) {
      const zoomFactor = state.zoomFactor - 0.1;

      if (zoomFactor > 0) {
        state.zoomFactor = zoomFactor;
      }
    }
  },
  actions: {},
  modules: {}
});
