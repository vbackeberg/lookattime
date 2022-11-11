<!-- TODO not mutate prop -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="text-area">
    <div class="title-area">
      <div class="event-title">{{ title }}</div>
      <div class="event-subtitle">{{ date }}</div>
      <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
    </div>
    <editor-write-mode v-model="text" />
  </div>
</template>

<script lang="ts">
import store from "@/store/store";
import Vue from "vue";
import EditorWriteMode from "./editor-write-mode.vue";
export default Vue.extend({
  name: "TextAreaWriteMode",
  components: { EditorWriteMode },
  props: {
    id: String,
    text: String,
    title: String,
    date: Number,
    importance: Number,
    imageReferences: Array
  },
  data() {
    return {
      // Form validation rules:
      ruleImportance: (v: number) =>
        !store.state.timeEvents
          .filter(timeEvent => timeEvent.id != this.id)
          .map(timeEvent => timeEvent.importance)
          .includes(Number(v)) ||
        "You have another time event with the same importance level. Please pick a different level!",
      ruleNotEmpty: (v: string) => !!v || "This field is required"
    };
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
</style>
