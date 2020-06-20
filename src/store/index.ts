import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zoomFactor: 1,
    center: 0
  },
  mutations: {
    setCenter(state, value) {
      console.log("set center" + value);
      state.center = value;
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
