<template>
  <div id="timeline">
    <div id="buffer-top-area">
      <spacer v-bind="spacerRight"></spacer>
      <spacer-left ref="spacerLeftElement" v-bind="spacerLeft"></spacer-left>
      <spacer v-bind="spacerPageEdge"></spacer>
    </div>
    <div id="box-area">
      <box v-for="box in boxes" :key="box.id" v-bind="box"></box>
    </div>
    <div
      id="horizontal-line"
      v-bind:style="{ width: horizontalLineWidth + 'px' }"
    ></div>
    <div id="buffer-bottom-area">
      <date v-for="box in boxes" :key="box.id" v-bind:box="box"></date>
      <timeMarker
        v-for="timeMarker in timeMarkers"
        :key="timeMarker.id"
      ></timeMarker>
    </div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/timeline-element/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";
import SpacerLeft from "@/components/SpacerLeft.vue";
import store from "@/store";
import Zoomer from "@/timeline/zoomer";
import Date from "@/components/timeline-element/Date.vue";
import SpaceWatcher from "@/timeline/space-watcher";
import TimeMarkerModel from "@/models/marker-model";
import TimeMarker from "@/components/TimeMarker.vue";

let zoomer: Zoomer;

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer,
    SpacerLeft,
    Date,
    TimeMarker
  },

  mounted() {
    store.commit("setTimelineZero", this.$el.clientWidth / 2);

    zoomer = Zoomer.Instance;
    new SpaceWatcher(this.$el, (this.$refs.spacerLeftElement as Vue).$el);

    window.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });
  },

  computed: {
    boxes(): BoxModel[] {
      return store.state.boxes;
    },

    spacerRight(): SpacerModel {
      return store.getters.spacerRight;
    },

    spacerLeft(): SpacerModel {
      return store.getters.spacerLeft;
    },

    spacerPageEdge(): SpacerModel {
      return store.state.spacerPageEdge;
    },

    horizontalLineWidth(): number {
      return Math.max(
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width,
        this.spacerRight.positionLeft + this.spacerRight.width
      );
    },

    //TODO: Move time markers into separate component
    timeMarkers(): TimeMarkerModel[] {
      return store.state.timeMarkers;
    },

    timeMarkerDistance(): number {
      return store.getters.timeMarkerDistance;
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        zoomer.zoom(1.1, e.pageX + this.$el.scrollLeft);
      } else if (e.deltaY > 0) {
        zoomer.zoom(0.92, e.pageX + this.$el.scrollLeft);
      }
    }
  },

  watch: {
    timeMarkerDistance(newDistance) {
      if (newDistance > 500) {
        const newArray = [] as TimeMarkerModel[];

        for (let i = 0; i < store.state.timeMarkers.length; i++) {
          newArray[newArray.length] = store.state.timeMarkers[i];

          newArray[newArray.length] = new TimeMarkerModel(
            store.state.timeMarkers[i].positionCenter + newDistance / 2,
            store.state.timeMarkers.length + i
          );
        }
      }
    }
  }
});
</script>

<style scoped lang="scss">
#timeline {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  background-color: #fff;

  display: flex;
  flex-flow: column nowrap;
}

#buffer-top-area {
  flex: 1 0 20px;
}

#box-area {
  flex: 2 0 200px;

  position: relative;
}

#horizontal-line {
  flex: 0 0 10px;

  background-color: #000;
}

#buffer-bottom-area {
  flex: 4;
}
</style>
