<template>
  <div v-if="editor">
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";

export default Vue.extend({
  name: "text-area-read-mode",

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
        extensions: [StarterKit],
        editable: false,
        editorProps: {
          attributes: {
            class: "text-area"
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

<style lang="scss" scoped></style>
