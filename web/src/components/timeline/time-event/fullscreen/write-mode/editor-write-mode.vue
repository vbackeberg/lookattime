<template>
  <ckeditor v-if="editor && config" :editor="editor" v-model="text" :config="config"></ckeditor>
</template>

<script setup lang="ts">
import { useLookAtTime } from "@/store/store";
import { computed, onMounted, ref } from "vue";
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  AutoImage,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  RemoveFormat,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline
} from "ckeditor5"

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

const isLayoutReady = ref(false);

const editor = ClassicEditor
const config = computed(() => {
  if (!isLayoutReady.value) {
    return undefined;
  }

  return {
    toolbar: {
      items: [
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        'removeFormat',
        '|',
        'specialCharacters',
        'horizontalLine',
        'link',
        'insertImage',
        'insertTable',
        'highlight',
        'blockQuote',
        'codeBlock',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      RemoveFormat,
      SimpleUploadAdapter,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline
    ],
    balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage'
      ],
      upload: { types: ["jpeg", "gif", "png", "svg+xml"] }
    },
    simpleUpload: { uploadUrl: `${window.location}/api/store-image?timeEventId=${props.id}&timelineId=${store.selectedTimeline!.id}&userId=${store.user!.id}` },
    licenseKey: 'GPL',
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  };
});

onMounted(() => {
  isLayoutReady.value = true;
});

</script>
<style>
@import 'ckeditor5/ckeditor5.css';

/* 
* This style sheet is not scoped because ckeditor resides outside this component
* and would not adopt scoped styles.
* This means the styles are global and might affect other ckeditor instances.
* However, there should not be any other ckeditor instances in the app.
*/

.ck.ck-editor[role="application"] {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.ck.ck-editor[role="application"] .ck-editor__main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.ck.ck-editor[role="application"] .ck-editor__main .ck-content:not(.ck-comment__input *) {
  flex: 1 0 auto;
}
</style>
