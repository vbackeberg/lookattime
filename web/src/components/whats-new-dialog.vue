<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new?
      </v-card-title>

      <v-card-text>
        <h3>New icon</h3>
        <p>
          Look at Time has a shiny new icon replacing the default vue icon. 👨‍🎨
          It will show up in your browser tab.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/logo-2.png"
          ></v-img>
        </p>
        <h3>Switching successfully between timelines!</h3>
        <p>
          Switching between timelines will now work as expected and not crash
          the visualization. Previously you had to reload the page after
          switching a timeline to allow for proper zooming.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/switching-timelines.gif"
          ></v-img>
        </p>
        <h3>What are we working on?</h3>
        <p>
          We are working on improving performance to give you the smooth zooming
          experience even with hundreds of time events. 👷
        </p>

        <h3>What are we going to work on next?</h3>
        <p>
          We are going to implement a sub-year time scale. That will allow you
          to zoom in into months, weeks, days and beyond. How about a timeline
          on the nanosecond scale?
        </p>

        <h3>What is this about?</h3>
        <p>
          Look at Time is tool made to visualize events in time. It is made for
          teachers, students and everyone who seeks to sort and present historic
          events. Start creating your first time event by clicking the big blue
          button in the bottom-right corner. After you have created your second
          time event, you will probably get a feeling for how the timeline works
          as spinning your mouse wheel will let you zoom in and out of the
          timeline.
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn width="100%" color="primary" @click="show = false">
          Yippee! Let's go!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "WhatsNewDialog",

  props: {
    value: Boolean
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit("input", value);
      }
    }
  }
});
</script>

<style scoped lang="scss"></style>
