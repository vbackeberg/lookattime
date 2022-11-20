<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ckeditor :editor="editor" v-model="value" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
import Vue from "vue";
import ClassicEditor from "@/../ckeditor-build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue2";

export default Vue.extend({
  name: "EditorWriteMode",

  props: {
    value: String
  },

  methods: {},

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
