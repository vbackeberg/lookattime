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

    spacerHighestBox: {
      positionLeft: 0,
      width: 200,
      height: 10,
      color: "#f3a"
    } as SpacerModel,
    spacerLowestBox: {
      positionLeft: 0,
      width: 200,
      height: 10,
      color: "#3f7"
    } as SpacerModel,
    spacerPageEdge: {
      positionLeft: 0,
      width: 200,
      height: 10,
      color: "#afa"
    } as SpacerModel
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

    setSpacerHighestBoxPosition(state, positionLeft: number) {
      state.spacerHighestBox.positionLeft = positionLeft;
    },
    setSpacerLowestBoxPosition(state, positionLeft: number) {
      state.spacerLowestBox.positionLeft = positionLeft;
    },
    setSpacerPageEdgePosition(state, positionLeft: number) {
      state.spacerPageEdge.positionLeft = positionLeft;
    }
  },

  actions: {},

  modules: {}
});
