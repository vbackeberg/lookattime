import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineZero: 0,

    boxes: [] as BoxModel[],
    spacerHighestBox: {} as SpacerModel,
    spacerPageEdge: {} as SpacerModel
  },

  mutations: {
    setTimelineZero(state, value: number) {
      state.timelineZero = value;
    },
    addBox(state, box: BoxModel) {
      state.boxes.push(box);
      state.boxes.sort((a, b) => a.positionLeft - b.positionLeft);
    },
    setSpacerHighestBox(state, spacer: SpacerModel) {
      state.spacerHighestBox = spacer;
    },
    setSpacerPageEdge(state, spacer: SpacerModel) {
      state.spacerPageEdge = spacer;
    }
  },

  actions: {},

  modules: {}
});
