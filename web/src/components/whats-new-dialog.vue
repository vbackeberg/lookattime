<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new?
      </v-card-title>

      <v-card-text>
        <h3>Time Markers are back - now representing real dates!</h3>
        <p>
          It has been a long way, but we are finally there: Time Markers are now
          placed at meaningful dates along our timeline such as days, hours or
          years. The markers will fade in and out at pre-defined zoom levels
          depending on how deep we zoom in to our timeline. I describe the
          calculation on my <a href="https://valerianb.medium.com">blog</a>.
        </p>
        <h3>Timeline is back, too!</h3>
        <p>
          And the horizontal timeline is back from summer break, too. 🌴 Now,
          it's correctly positioned and fixed.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/time-markers-from-dates.gif"
          ></v-img>
        </p>

        <h3>What are we going to work on next? 👷‍♂️</h3>
        <p>
          We will fix the positioning of time markers such that they sit just
          below the horizontal time line in the middle of the screen.
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
