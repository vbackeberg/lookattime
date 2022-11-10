<template>
  <div v-if="editor">
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import { ColumnExtension } from "@gocapsule/column-extension";

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
        extensions: [StarterKit, ColumnExtension],
        editable: false,
        editorProps: {
          attributes: {
            class: "text-area"
          }
        }
      });
      this.editor.commands.setColumns(2);
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
/** This class is added on the editor container. */
::v-deep .text-area {
  padding: 8px;

  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);

  .column-block {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 24px;
    padding: 8px 0;
  }

  .column {
    overflow: auto;
    padding: 8px;
    margin: -8px;
  }
}
</style>
