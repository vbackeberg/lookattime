<template>
  <ckeditor
    :editor="editor"
    v-model="editorData"
    :config="editorConfig"
  ></ckeditor>
</template>
<script lang="ts">
import Vue from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      }
    };
  },

  components: {
    ckeditor: CKEditor.component
  }
});
</script>
<style lang="scss" scoped>
@import "src/colors.scss";
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";

.container {
  flex: 1 0 auto;
  padding: 0;

  display: flex;
  flex-direction: column;
}
</style>
