<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new?
      </v-card-title>

      <v-card-text>
        <h3>Create dialog will now wait for the upload to finish</h3>
        <p>
          When creating or editing a time event, you will now see a loading
          circle on the submit button and the dialog won't disappear until the
          event and its images have successfully been uploaded. Currently, you
          can upload only one image, but we will soon remove this limitation!
          🖼️🖼️🖼️
        </p>
        <p>
          When editing, existing images will be shown below the upload field and
          you can delete them by click.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/loading-circle-on-create.gif"
          ></v-img>
        </p>
        <h3>Title and text are now mandatory and we validate correctly! 🔍</h3>
        <p>
          The next time you create a time event, you will see better validation
          feedback as we corrected the validation rules for your input. We fixed
          a lot of other bugs related to all various areas such as hiding and
          showing time markers.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/validation-works.gif"
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
