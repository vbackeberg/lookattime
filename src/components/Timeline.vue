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
    <div id="connector-area">
      <connector
        v-for="box in boxes"
        :key="box.id"
        v-bind:box="box"
      ></connector>
    </div>
    <div id="horizontal-line"></div>
    <div id="buffer-bottom-area">
      <date v-for="box in boxes" :key="box.id" v-bind:box="box"></date>
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
import Repositioner from "@/timeline/repositioner";
import Connector from "@/components/timeline-element/Connector.vue";
import Date from "@/components/timeline-element/Date.vue";
import LeftSpaceExtender from "@/timeline/left-space-extender";
import LeftSpaceCutter from "@/timeline/left-space-cutter";

let repositioner: Repositioner;

export default Vue.extend({
  name: "Timeline",

  components: {
    Box,
    Spacer,
    SpacerLeft,
    Connector,
    Date
  },

  created() {
    window.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });
  },

  mounted() {
    store.commit("setTimelineZero", this.$el.clientWidth / 2);

    repositioner = new Repositioner(this.$el);
    new LeftSpaceExtender(this.$el, (this.$refs.spacerLeftElement as Vue).$el);
    new LeftSpaceCutter(this.$el, (this.$refs.spacerLeftElement as Vue).$el);
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
    }
  },

  methods: {
    changeZoom(e: WheelEvent) {
      if (e.deltaY < 0) {
        repositioner.zoomIn(1.1, e.pageX + this.$el.scrollLeft);
      } else if (e.deltaY > 0) {
        repositioner.zoomOut(0.92, e.pageX + this.$el.scrollLeft);
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

.timelineZero {
  height: 50px;
  width: 5px;
  background-color: #fff;
  position: absolute;
}

#buffer-top-area {
  flex: 1 0 20px;

  background-color: #eef;
}

#box-area {
  flex: 3;

  position: relative;
}

#connector-area {
  flex: 1;

  position: relative;
  background-color: #eef;
}

#horizontal-line {
  flex: 0 0 10px;

  width: 100%;
  background-color: #000;
}

#buffer-bottom-area {
  flex: 3;
}
</style>
