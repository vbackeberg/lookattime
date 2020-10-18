<template>
  <div id="timeline">
    <box v-for="box in boxes" v-bind:key="box.id" v-bind="box"></box>
    <spacer-right v-bind="SpacerRight"></spacer-right>
    <spacer-left v-bind="SpacerLeft"></spacer-left>
    <spacer v-bind="spacerPageEdge"></spacer>
    <div
      class="timelineZero"
      v-bind:style="{ left: timelineZero + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts">
import Box from "@/components/Box.vue";
import Vue from "vue";
import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";
import Spacer from "@/components/Spacer.vue";
import SpacerLeft from "@/components/SpacerLeft.vue";
import SpacerRight from "@/components/SpacerRight.vue";
import store from "@/store";
import Repositioner from "@/timeline/repositioner";

let repositioner: Repositioner;

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer,
    SpacerLeft,
    SpacerRight
  },

  created() {
    window.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });

    store.commit("addBox", new BoxModel(500, 200, store.state.boxes.length));
    store.commit("setTimelineZero", 500);
  },

  mounted() {
    repositioner = new Repositioner(this.$el);
  },

  computed: {
    boxes(): BoxModel[] {
      return store.state.boxes;
    },

    SpacerRight(): SpacerModel {
      return store.state.SpacerRight;
    },

    SpacerLeft(): SpacerModel {
      return store.state.SpacerLeft;
    },

    spacerPageEdge(): SpacerModel {
      return store.state.spacerPageEdge;
    },

    timelineZero(): number {
      return store.state.timelineZero;
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      const element = this.$el;

      if (e.deltaY < 0) {
        repositioner.zoomIn(1.1, e.pageX + element.scrollLeft);
      } else if (e.deltaY > 0) {
        repositioner.zoomOut(0.92, e.pageX + element.scrollLeft);
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
  background-color: #ccc;
}

.timelineZero {
  height: 50px;
  width: 5px;
  background-color: #35b;
  position: absolute;
}
</style>
