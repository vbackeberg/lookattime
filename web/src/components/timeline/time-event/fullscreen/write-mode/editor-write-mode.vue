<template>
  <ckeditor :editor="editor" v-model="text" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
import Vue from "vue";
import ClassicEditor from "@/../ckeditor-build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue2";

/**
 * A component that wraps the CKEditor5
 */
export default Vue.extend({
  name: "EditorWriteMode",

  props: {
    value: String
  },

  methods: {},

  computed: {
    text: {
      get(): string {
        return this.value;
      },
      set(value: string) {
        this.$emit("input", value);
      }
    }
  },

  data() {
    return {
      editor: ClassicEditor,
      editorData: "<p>Your text here.</p>",
      editorConfig: {}
    };
  },

  components: {
    ckeditor: CKEditor.component
  }
});
</script>
<style lang="scss" scoped></style>
