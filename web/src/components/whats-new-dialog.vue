<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        What's new?
      </v-card-title>

      <v-card-text>
        <h3>Fully-featured editor for your Time Events!</h3>
        <p>
          The next time you will open up a time event you will be greeted by the
          all-new UI design for time event content. The most notable features
          are: Formatting with headlines, bold, italic, etc. Images along the
          text Quick toggling of edit and read mode On top of that, editing and
          creating time events now happens in-place without a separate modal and
          you have a real editor at your hands offering all the tools you would
          expect for text editing. I chose to go with a great editor called
          Ckeditor5 that is extendable and free.
        </p>
        <p>
          <v-img
            src="https://lookattime2.blob.core.windows.net/lookattime-assets/rich-text-editor.png"
          ></v-img>
        </p>

        <h3>What are we going to work on next? 👷‍♂️</h3>
        <p>
          There are still a few rocks in the system. You have to reload the page
          often after changing time events. These are going to be solved over
          the coming weeks.
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
