<template>
  <editor-content v-if="editor" :editor="editor" />
</template>

<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export default Vue.extend({
  name: "EditorReadMode",

  props: {
    value: String
  },

  mounted() {
    this.initializeEditor();
  },

  methods: {
    initializeEditor() {
      this.editor = new Editor({
        content: this.value,
        extensions: [StarterKit, Image],
        editable: false,
        editorProps: {
          attributes: {
            class: "editor-area-shared"
          }
        }
      });
    }
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  data() {
    return {
      editor: (null as unknown) as Editor
    };
  },

  components: {
    EditorContent
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
</style>
