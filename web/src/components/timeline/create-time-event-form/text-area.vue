<template>
  <div v-if="editor">
    <v-btn-toggle class="editor-toolbar" dense multiple>
      <v-btn
        @click="
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        "
        :disabled="
          !editor
            .can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        "
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </v-btn>
      <v-btn
        @click="
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        "
        :disabled="
          !editor
            .can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        "
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </v-btn>
    </v-btn-toggle>
    <editor-content :editor="editor" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";

export default Vue.extend({
  name: "TextArea",

  props: {
    value: String
  },

  mounted() {
    this.initializeEditor();
  },

  methods: {
    /**
     * Initializes the editor with extensions, styles and
     * an initial content derived from the `value` prop.
     *
     * Setting the content here affects the first opening of
     * the form, only.
     *
     * Subsequent external changes of the `value` prop are
     * manually set through `updateEditorContent()` triggered
     * by a watcher.
     *
     */
    initializeEditor() {
      this.editor = new Editor({
        content: this.value,
        onUpdate: ({ editor }) => {
          console.log("update " + editor);
          this.$emit("update:value", editor.getHTML());
        },
        extensions: [StarterKit],
        editorProps: {
          attributes: {
            class: "editor-text-area"
          }
        }
      });
    },

    updateEditorContent(value: string) {
      if (this.editor.getHTML() !== value) {
        this.editor.commands.setContent(value, false);
      }
    }
  },

  watch: {
    value(value) {
      this.updateEditorContent(value);
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
<style lang="scss">
@import "src/colors.scss";

.editor-toolbar {
  margin-bottom: 8px;
}

/** This class represents the editor container. */
.editor-text-area {
  padding: 8px;

  border-style: solid;
  border-color: $lat-border-color;
  border-radius: 4px;
  border-width: 1px;

  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    border-color: $lat-border-color-hover;
    border-width: 1px;
  }

  &:focus {
    outline-color: $lat-primary-color;
    outline-width: 2px;
  }
}
</style>
