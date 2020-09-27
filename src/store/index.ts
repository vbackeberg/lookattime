import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineZero: 500 //TODO initiate at center of screen
  },

  mutations: {
    changeTimelineZero(state, value: number) {
      state.timelineZero += value
    }
  },

  actions: {},

  modules: {}
});
