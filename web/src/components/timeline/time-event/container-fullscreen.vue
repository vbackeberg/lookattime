<template>
  <v-card
    class="content elevation-0"
    v-on:contextmenu.prevent="openContextMenu"
  >
    <v-img
      v-bind:src="imageSource"
      class="card-image white--text align-end"
      alt="time event image"
    >
      <v-card-title class="card-title card-image-shadow">{{
        title
      }}</v-card-title>
      <v-btn
        class="btn-full card-image-shadow"
        color="white"
        icon
        v-on:click.stop="toggleFullscreen()"
      >
        <v-icon>mdi-arrow-expand</v-icon>
      </v-btn>
    </v-img>
    <v-card-text class="card-text">{{ text }}</v-card-text>
  </v-card>
</template>
<script lang="ts">
import store from "@/store/store";
import Vue from "vue";

/**
 * This fullscreen card is used for the fullscreen view of a time event.
 */
export default Vue.extend({
  props: {
    text: String,
    title: String,
    importance: Number,
    imageSource: String
  },
  methods: {
    toggleFullscreen() {
      this.$emit("toggleFullscreen");
    },
    openContextMenu(e: MouseEvent) {
      this.$emit("openContextMenu", e);
    }
  },

  mounted() {
    (this.$el as HTMLElement).style.transform =
      "translateX(" + store.state.timelineElement.scrollLeft + "px)";
  }
});
</script>

<style lang="scss" scoped>
.content {
  width: 75%;
  max-width: 1000px;
  margin: 8px auto;

  flex: 1 0 0;

  border-color: #aaa !important;
  border-style: solid;
  border-radius: 4px;
  border-width: 1px;
  z-index: 6;

  .card-text {
    flex: 1 1 auto;
  }

  .card-image {
    flex: 1 1 auto;
  }

  .card-text {
    flex-grow: 1;
    overflow-y: auto;
    text-align: left;
  }

  .btn-full {
    position: absolute;
    top: 2px;
    right: 2px;
  }
}
</style>
