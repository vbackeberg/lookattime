<template>
<TextAreaWriteMode :show id="{{uuid()}}"></TextAreaWriteMode>
</template>

<script setup lang="ts">
import TextAreaWriteMode from './components/timeline/time-event/fullscreen/write-mode/text-area-write-mode.vue';

const show = true
</script>