<template>
  <div id="fullscreen-container">
    <div id="fullscreen-container-content" class="elevation-20">
      <v-card id="fullscreen-content">
        <div class="buttons-top-right">
          <v-btn
          v-if="!readOnlyMode"
          class=""
          :class="{ 'btn-dark': writeMode }"
          icon
          :disabled="isTimeEventToBeCreated"
          v-on:click.stop="writeMode = !writeMode"
          ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn
            class=""
            icon
            v-on:click.stop="closeFullscreen()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

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

#fullscreen-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  padding-bottom: 100px; // app bar height + footer height
  z-index: 6;
}

#fullscreen-container-content {
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

  #fullscreen-content {
    height: 100%;
    width: 100%;

    overflow-y: scroll;

    display: flex;
    flex-direction: column;

    .buttons-top-right {
      display: flex;
      justify-content: end;
      padding: 8px;
      gap: 4px;
    }

    .btn-dark {
      background-color: colors.$lat-primary-color + dd;
    }
  }
}
</style>
