<template>
  <div class="container-fullscreen">
    <v-card
      class="content elevation-0"
      v-on:contextmenu.prevent="openContextMenu"
    >
      <v-card-title class="card-title">{{ title }}</v-card-title>
      <div class="columns">
        <v-card-text class="card-text">{{ text }}</v-card-text>
        <v-img
          v-bind:src="imageSource"
          class="card-image white--text align-end"
          alt="time event image"
          contain
        >
        </v-img>
      </div>
      <v-btn
        class="btn-full card-image-shadow"
        color="white"
        icon
        v-on:click.stop="toggleFullscreen()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>
  </div>
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
@import "./time-event.scss";

.container-fullscreen {
  width: 75%;
  margin: 8px auto;

  z-index: 6;
}

.content {
  height: 100%;
  max-width: 1000px;

  border-color: #aaa !important;
  border-style: solid;
  border-radius: 4px;
  border-width: $box-border-width;

  display: flex;
  flex-direction: column;

  .btn-full {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .card-title {
    justify-content: center;
  }

  .columns {
    display: flex;
    align-items: flex-start;
    overflow-y: scroll;

    .card-text {
      text-align: justify;
    }

    .card-image {
      flex: 1 1 auto;
      margin: 16px;
      border-radius: 4px;
    }
  }
}
</style>
