<template>
  <div class="container-outer">
    <container-fullscreen
      v-if="isFullscreen"
      v-bind:imageSource="imageSource"
      v-bind:text="text"
      v-bind:title="title"
      v-on:toggleFullscreen="toggleFullscreen()"
      v-on:openContextMenu="openContextMenu"
    />
    <container-zoomable
      v-else
      v-bind:id="id"
      v-bind:text="text"
      v-bind:title="title"
      v-bind:date="date"
      v-bind:importance="importance"
      v-bind:imageSource="imageSource"
      v-bind:imageReferences="timeEvent.imageReferences"
      v-bind:expansionZoomLevels="expansionZoomLevels"
      v-on:toggleFullscreen="toggleFullscreen()"
      v-on:openContextMenu="openContextMenu"
    />
    <div class="buffer-bottom grow-transition"></div>
    <v-menu
      v-model="showContextMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      style="max-width: 600px"
    >
      <v-list>
        <v-list-item v-on:click.stop="showCreateTimeEventForm = true">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click.stop="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:timeEvent="{
        id,
        text,
        date,
        importance,
        imageReferences,
        title
      }"
      v-bind:editMode="true"
    />
  </div>
</template>

<script lang="ts">
import ImageReferenceModel from "@/models/image-reference-model";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";
import store from "@/store/store";
import Vue from "vue";
import FullscreenEventTarget from "@/timeline/fullscreen-event-target";
import ContainerFullscreen from "./container-fullscreen.vue";
import ContainerZoomable from "./container-zoomable.vue";
import TimeEventModel from "@/models/time-event-model";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    ContainerFullscreen,
    ContainerZoomable,
    CreateTimeEventForm
  },

  props: {
    id: String,
    text: String,
    date: Number,
    importance: Number,
    imageReferences: Array,
    title: String,
    expansionZoomLevels: Array
  },

  data() {
    return {
      isFullscreen: false,
      showCreateTimeEventForm: false,
      showContextMenu: false,
      x: 0,
      y: 0
    };
  },

  computed: {
    timeEvent(): TimeEventModel {
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index !== -1) {
        return store.state.timeEvents[index];
      } else {
        throw Error("Could not get time event index because it was not found");
      }
    },
    imageSource(): string {
      if (this.imageReferences.length < 1) {
        return "";
      }

      const imageReference = this.imageReferences[0] as ImageReferenceModel;

      return (
        process.env.VUE_APP_IMAGE_URL +
        imageReference.id +
        "." +
        imageReference.extension
      );
    }
  },

  methods: {
    openContextMenu(e: MouseEvent) {
      this.showContextMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showContextMenu = true;
      });
    },

    deleteEvent() {
      store.dispatch("deleteTimeEvent", this.id);
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      FullscreenEventTarget.Instance.dispatchEvent(
        new CustomEvent("fullscreen-toggled", {
          detail: { isFullscreen: this.isFullscreen }
        })
      );
    }
  }
});
</script>

<style scoped lang="scss">
.container-outer {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
}

.buffer-bottom {
  flex: 1 0 64px;
}
</style>
