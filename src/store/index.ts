import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomFactor: 1,
    mousePosition: 0
  },
  mutations: {
    increaseZoom(state) {
      const zoomFactor = state.zoomFactor + 0.01;

      if (zoomFactor <= 2) {
        state.zoomFactor = zoomFactor;
      } else {
        console.log("increase reached: " + zoomFactor);
      }
    },

    decreaseZoom(state) {
      const zoomFactor = state.zoomFactor - 0.01;

      if (zoomFactor > 0) {
        state.zoomFactor = zoomFactor;
      } else {
        console.log("decrease reached: " + zoomFactor);
      }
    },

    setMousePosition(state, value) {
      state.mousePosition = value;
    }
  },
  actions: {},
  modules: {}
});
