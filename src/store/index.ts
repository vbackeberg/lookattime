import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineZero: 500, //TODO initiate at center of screen

    boxes: [] as BoxModel[],
    spacerHighestBox: {} as SpacerModel,
    spacerPageEdge: {} as SpacerModel
  },

  mutations: {
    changeTimelineZero(state, value: number) {
      state.timelineZero += value;
    },
    addBox(state, box: BoxModel) {
      state.boxes.push(box);
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
