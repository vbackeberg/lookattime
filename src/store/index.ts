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

    spacerPageEdge: {
      positionLeft: 0,
      color: "#aaa",
      width: SpacerModel.width
    } as SpacerModel
  },

  getters: {
    spacerLeft(state): SpacerModel {
      return {
        positionLeft:
          state.boxes[0].positionCenter - state.boxes[0].width / 2 - SpacerModel.width,
        color: "#aaa",
        width: SpacerModel.width
      } as SpacerModel;
    },
    spacerRight(state): SpacerModel {
      const highestBox = state.boxes[state.boxes.length - 1];

      return {
        positionLeft: highestBox.positionCenter + highestBox.width / 2,
        color: "#aaa",
        width: SpacerModel.width
      } as SpacerModel;
    }
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

    setSpacerPageEdgePosition(state, positionLeft: number) {
      state.spacerPageEdge.positionLeft = positionLeft;
    }
  },

  actions: {},

  modules: {}
});
