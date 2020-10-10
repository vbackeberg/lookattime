import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timelineZero: 0,
    zoomLevel: 1,

    boxes: [] as BoxModel[],
    spacerHighestBox: {} as SpacerModel,
    spacerLowestBox: {} as SpacerModel,
    spacerPageEdge: {} as SpacerModel
  },

  mutations: {
    setTimelineZero(state, value: number) {
      state.timelineZero = value;
    },
    changeZoomLevel(state, value: number) {
      state.zoomLevel *= value;
    },

    addBox(state, box: BoxModel) {
      state.boxes.push(box);
      state.boxes.sort((a, b) => a.positionCenter - b.positionCenter);
    },
    //TODO: Refactor this to initiate with spacers and only allow setting new positions
    // to allow for proper change tracking. Spacers are never replaced by new ones, so
    // it is useless and deceiving to offer this method.
    setSpacerHighestBox(state, spacer: SpacerModel) {
      state.spacerHighestBox = spacer;
    },
    setSpacerLowestBox(state, spacer: SpacerModel) {
      state.spacerLowestBox = spacer;
    },
    setSpacerPageEdge(state, spacer: SpacerModel) {
      state.spacerPageEdge = spacer;
    }
  },

  actions: {},

  modules: {}
});
