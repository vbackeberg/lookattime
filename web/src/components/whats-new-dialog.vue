<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new?
      </v-card-title>

      <v-card-text>
        <h3>Provide more information with full-screen view</h3>
        <p>
          The new full-screen mode allows you to add more text to your time
          events. Open it by clicking the expand symbol in top right corner.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/full-screen-events.gif"
          ></v-img>
        </p>
        <h3>What are we working on?</h3>
        <p>
          We are working on bringing back the actual timeline (the black stroke
          at the center of the screen).
        </p>

        <h3>What are we going to work on next?</h3>
        <p>
          The date below the time event should only show those parts of the date
          that matter for the scope. E.g. it should not show hours, minutes,
          seconds when you are viewing time events across years.
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
