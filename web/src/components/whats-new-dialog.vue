<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new and what's to come?
      </v-card-title>

      <v-card-text>
        <p>
          Welcome to Look at Time! Here, you can find out what we are currently
          working on and what we plan to work on next.
        </p>

        <h3>What's new?</h3>
        <h4>Editing and deleting time events</h4>
        <p>
          Right-click and select edit to change any content of your time event.
          Right-click and select delete to delete a time event. It's that easy.
          😎
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/how-to-edit.gif"
          ></v-img>
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/how-to-delete.gif"
          ></v-img>
        </p>

        <h4>Sharing</h4>
        <p>
          You can use the sharing feature to share your timeline with others!
          Viewers of your timeline will not be able to modify it. 😉 But beware:
          Once shared, you cannot revoke view access to your timeline. You can
          however delete everything from it.
        </p>

        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/how-to-share.gif"
          ></v-img>
        </p>

        <h3>What are we working on right now?</h3>
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
          This tool is made to visualize events in time. It is made for
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
