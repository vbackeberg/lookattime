<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title> What's new? </v-card-title>

      <v-card-text>
        <h3>Tutorials & Tooltips 👨‍🏫</h3>
        <p>
          If you haven’t used Look at Time so far, a quick tutorial will guide
          you through the basics and help you create your first timeline with a
          few events. I hope you will like it!
        </p>
        <p>
          <v-img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JndN-PNnzsI9PUHvBOyTpg.png"></v-img>
        </p>

        <h3>What are we going to work on next? 👷‍♂️</h3>
        <p>
          It's time to pretty up the title and date area for the time event
          cards. Also, time events that have no image will soon look better.
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

<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits({ show: Boolean })
const props = defineProps({ show: Boolean })

const show = computed({
  get: () => props.show,
  set: (value) => emits("show", value)
})
</script>

<style scoped lang="scss"></style>
