<template>
  <div class="container-fullscreen">
    <v-card
      class="content elevation-0"
      v-on:contextmenu.prevent="openContextMenu"
    >
      <v-img
        v-bind:src="imageSource"
        class="card-image white--text align-end"
        aspect-ratio="2"
        alt="time event image"
      >
        <v-card-title class="card-title card-image-shadow">{{
          title
        }}</v-card-title>
      </v-img>
      <div class="columns">
        <v-card-text class="card-text">{{ text }}</v-card-text>
        <div class="images">
          <v-img
            v-bind:src="imageSource"
            class="card-image white--text align-end"
            alt="time event image"
            contain
          >
          </v-img>
          <v-card-text class="image-caption"
            >This is a subtitle for above image</v-card-text
          >
          <v-img
            v-bind:src="imageSource"
            class="card-image white--text align-end"
            alt="time event image"
            contain
          >
          </v-img>
          <v-card-text class="image-caption"
            >This is a subtitle for above image</v-card-text
          >
        </div>
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
  overflow-y: scroll;

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
    font-size: 2rem;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .columns {
    display: flex;
    align-items: flex-start;

    .card-text {
      width: 50%;
      text-align: justify;
      white-space: break-spaces;
    }

    .images {
      width: 50%;
      padding: 16px;

      .card-image {
        border-radius: 4px;
      }

      .image-caption {
        margin-bottom: 16px;
        text-align: center;
      }
    }
  }
}
</style>
