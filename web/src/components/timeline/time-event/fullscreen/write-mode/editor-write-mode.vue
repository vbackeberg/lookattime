<template>
  <ckeditor :editor="editor" v-model="text" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
import Vue from "vue";
import ClassicEditor from "@/../ckeditor-build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import store from "@/store/store";

/**
 * A component that wraps the CKEditor5
 */
export default Vue.extend({
  name: "EditorWriteMode",

  props: {
    value: String,
    id: String
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
      editorConfig: {
        image: {
          upload: {
            types: ["jpeg", "gif", "png", "svg+xml"]
          }
        },
        simpleUpload: {
          uploadUrl:
            process.env.VUE_APP_API_URL +
            "/store-image?timeEventId=" +
            this.id +
            "&timelineId=" +
            store.state.selectedTimeline.id +
            "&userId=" +
            store.state.user.id
        },
        headers: {}
      }
    };
  },

  components: {
    ckeditor: CKEditor.component
  }
});
</script>
<style lang="scss">
/* 
* This style sheet is not scoped because ckeditor resides outside this component
* and would not adopt scoped styles.
* This means the styles are global and might effect other ckeditor instances.
* However, there should not be any other ckeditor instances in the app.
*/

.ck.ck-editor[role="application"] {
  flex: 1 0 auto;

  display: flex;
  flex-direction: column;

  .ck-editor__main {
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;

    .ck-content:not(.ck-comment__input *) {
      flex: 1 0 auto;
    }
  }
}
</style>
