<!-- TODO not mutate prop -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="text-area">
    <div class="title-area">
      <div class="event-title">{{ title }}</div>
      <div class="event-subtitle">{{ date }}</div>
      <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
    </div>
    <editor-read-mode v-model="text" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EditorReadMode from "./editor-read-mode.vue";

export default Vue.extend({
  name: "TextAreaReadMode",
  components: { EditorReadMode },
  props: {
    text: String,
    title: String,
    date: Number,
    importance: Number,
    imageReferences: Array
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
</style>
