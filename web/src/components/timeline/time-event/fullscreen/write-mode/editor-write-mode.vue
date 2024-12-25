<template>
  <ckeditor :editor="editor" v-model="text" :config="editorConfig"></ckeditor>
</template>

<script setup lang="ts">
import ClassicEditor from "@/../ckeditor-build/ckeditor";
import { useLookAtTime } from "@/store/store";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { computed } from "vue";

/**
 * A component that wraps the CKEditor5
 */

const emits = defineEmits({ text: String })
const store = useLookAtTime()

const props = defineProps({
  text: String,
  id: { type: String, required: true }
})

const text = computed({
  get: () => props.text,
  set: (value) => emits("text", value)
})

const editor = ClassicEditor;
const editorData = "<p>Your text here.</p>";
const editorConfig = {
  image: {
    upload: {
      types: ["jpeg", "gif", "png", "svg+xml"]
    }
  },
  simpleUpload: {
    uploadUrl:
      import.meta.env.VITE_API_URL +
      "/store-image?timeEventId=" +
      props.id +
      "&timelineId=" +
      store.selectedTimeline!.id +
      "&userId=" +
      store.user!.id
  },
  headers: {}
}

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
