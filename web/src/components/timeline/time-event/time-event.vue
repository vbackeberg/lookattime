<template>
  <div
    class="zoom-container zoom-transition zoomable"
    v-bind:style="[styleWidth, styleTranslate]"
  >
    <div
      class="grow-transition"
      v-bind:class="{
        'buffer-top-box': !collapse,
        'buffer-top-bubble': collapse,
        'buffer-top-dot': hide
      }"
    ></div>
    <div
      class="content grow-transition"
      v-bind:class="{
        box: !collapse,
        bubble: collapse,
        dot: hide
      }"
    >
      <!-- TODO check if still needed, as no enter leave animation exists. -->
      <transition>
        <v-card v-if="!hide" class="card" @contextmenu="openContextMenu">
          <v-img
            v-bind:src="imageSource"
            class="card-image white--text align-end"
            alt="time event image"
          >
            <v-card-title class="title-text" v-if="!collapse">{{
              title
            }}</v-card-title>
          </v-img>
          <v-card-text v-if="!collapse" class="card-text">{{
            text
          }}</v-card-text>
        </v-card>
      </transition>
    </div>
    <connector
      class="grow-transition"
      v-if="!hide"
      v-bind:class="{
        'connector-box': !collapse,
        'connector-bubble': collapse
      }"
    ></connector>
    <v-menu
      v-model="showContextMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      style="max-width: 600px"
    >
      <v-list>
        <v-list-item v-on:click="editEvent()">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import ImageReferenceModel from "@/models/image-reference-model";
import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Vue from "vue";
import Connector from "./connector.vue";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    Connector
  },

  props: {
    positionCenter: Number,
    id: String,
    text: String,
    importance: Number,
    imageReferences: Array,
    title: String
  },

  data() {
    return {
      styleWidth: {
        width: TimeEventModel.expandedWidth + "px"
      },

      showContextMenu: false,
      x: 0,
      y: 0
    };
  },

  computed: {
    styleTranslate(): object {
      return {
        transform:
          "translateX(" +
          (this.positionCenter - TimeEventModel.expandedWidthOffset) +
          "px)"
      };
    },

    timeEventIndex(): number {
      return store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );
    },

    imageSource(): string {
      if (this.imageReferences.length < 1) {
        return "";
      }

      const imageReference = this.imageReferences[0] as ImageReferenceModel;

      return (
        "https://lookattime2.blob.core.windows.net/lookattime2/" +
        imageReference.id +
        "." +
        imageReference.extension
      );
    },

    collapse(): boolean {
      if (
        this.shouldShrink(this.timeEventIndex, -1, TimeEventModel.expandedWidth)
      )
        return true;
      if (
        this.shouldShrink(this.timeEventIndex, 1, TimeEventModel.expandedWidth)
      )
        return true;
      return false;
    },

    hide(): boolean {
      if (
        this.shouldShrink(
          this.timeEventIndex,
          -1,
          TimeEventModel.collapsedWidth
        )
      )
        return true;
      if (
        this.shouldShrink(
          this.timeEventIndex,
          +1,
          TimeEventModel.collapsedWidth
        )
      )
        return true;
      return false;
    }
  },

  methods: {
    shouldShrink(
      currentTimeEventIndex: number,
      indexChange: number,
      width: number
    ): boolean {
      const neighbor =
        store.state.timeEvents[currentTimeEventIndex + indexChange];

      if (!neighbor) {
        return false;
      }

      const collision =
        (this.positionCenter +
          (indexChange * width) / 2 -
          (neighbor.positionCenter + (-indexChange * width) / 2)) *
          indexChange >
        0;

      if (!collision) {
        return false;
      }

      const hasPrecedence = this.importance > neighbor.importance;

      if (!hasPrecedence) {
        return true;
      }

      return this.shouldShrink(
        currentTimeEventIndex + indexChange,
        indexChange,
        width
      );
    },

    openContextMenu(e: MouseEvent) {
      console.log("contextmenu " + this.id);

      e.preventDefault();
      this.showContextMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showContextMenu = true;
      });
    },

    editEvent() {
      console.log("edit");
    },

    deleteEvent() {
      console.log("delete");
    }
  }
});
</script>

<style scoped lang="scss">
.zoom-container {
  position: absolute;
  height: 100%;
  backface-visibility: hidden; // Reduces subtle vertical position shifting when translateX
  pointer-events: none;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.grow-transition {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.buffer-top-box {
  flex: 0 1 auto;
}

.buffer-top-bubble {
  flex: 16 0 auto;
}

.buffer-top-dot {
  flex: 16 0 auto;
}

.content {
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

  overflow: hidden;
  font-size: 0.875em;
}

.box {
  flex: 5 1 50px;

  width: 100%;
  border-radius: 4px;
}

.bubble {
  flex: 0 0 auto;

  width: 50px;
  height: 50px; // The 50px bubble dimension is redundantly set in a lot of places such as width, image height and the model.
  margin-left: 125px;
  margin-right: 125px;
  border-radius: 25px;
}

.dot {
  flex: 0 0 auto;

  width: 16px;
  height: 8px;
  margin-left: 146px;
  margin-right: 146px;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  border: 1px solid #000;
  border-bottom: 0;
  background-color: #000;
}

.connector-box {
  flex: 1 0 50px;
}

.connector-bubble {
  flex: 1 0 2px;
}

.card {
  height: 100%;
  pointer-events: auto;

  display: flex !important;
  flex-direction: column;
}

.card-image {
  height: 40%;
  min-height: 50px;
  max-height: 200px;
}

.card-text {
  flex-grow: 1;
  overflow-y: auto;
  text-align: left;
}

.title-text {
  text-shadow: 0px 0px 3px #000;
}
</style>
