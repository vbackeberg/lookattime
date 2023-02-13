<template>
  <div class="container-fullscreen">
    <div class="container-content elevation-20">
      <v-card class="content">
        <text-area-write-mode
          v-if="writeMode"
          v-model="writeMode"
          v-bind:id="id"
        />
        <text-area-read-mode
          v-if="!writeMode"
          v-model="writeMode"
          v-bind:id="id"
        />

        <v-btn
          v-if="!readOnlyMode"
          class="buttons-top-right btn-edit"
          :class="{ 'btn-dark': writeMode }"
          color="white"
          icon
          :disabled="isTimeEventToBeCreated"
          v-on:click.stop="writeMode = !writeMode"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn
          class="buttons-top-right btn-close"
          color="white"
          icon
          v-on:click.stop="closeFullscreen()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import TextAreaWriteMode from "@/components/timeline/time-event/fullscreen/write-mode/text-area-write-mode.vue";
import TextAreaReadMode from "@/components/timeline/time-event/fullscreen/read-mode/text-area-read-mode.vue";
import { FullscreenToggled } from "./fullscreen-toggled";
import store from "@/store/store";
import { mapGetters } from "vuex";

/**
 * This fullscreen card is used for the fullscreen view of a time event.
 */
export default Vue.extend({
  props: {
    id: String,
    writeModeE: Boolean
  },

  components: {
    TextAreaWriteMode,
    TextAreaReadMode
  },

  data() {
    return {
      writeMode: false
    };
  },

  methods: {
    closeFullscreen() {
      if (store.state.timeEventToBeCreated) {
        store.commit("setTimeEventToBeCreated", null);
      }

      document.dispatchEvent(
        new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
          detail: {
            timeEventId: this.id,
            isFullscreen: false,
            writeMode: false
          }
        })
      );
    },

    toggleWriteMode() {
      this.writeMode = !this.writeMode;
    }
  },

  created() {
    this.writeMode = this.writeModeE;
  },

  computed: {
    ...mapGetters(["readOnlyMode"]),
    isTimeEventToBeCreated(): boolean {
      return store.state.timeEventToBeCreated !== null;
    }
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/time-event.scss";
@import "src/colors.scss";

.container-fullscreen {
  position: fixed;
  width: 100%;
  height: 100vh;
  padding-bottom: 100px; // app bar height + footer height
  z-index: 6;
}

.container-content {
  height: 100%;
  width: 75%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  border-color: #aaa !important;
  border-style: solid;
  border-radius: 16px;
  border-width: $box-border-width;

  overflow: hidden;

  .content {
    height: 100%;
    width: 100%;

    overflow-y: scroll;

    display: flex;
    flex-direction: column;

    .buttons-top-right {
      position: absolute;
      top: 8px;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .btn-close {
      right: 8px;
    }

    .btn-edit {
      right: 56px;
    }

    .btn-dark {
      background-color: $lat-primary-color + dd;
    }
  }
}
</style>
