<template>
  <div class="ck-content" v-html="value"></div>
</template>

<script setup lang="ts">

const props = defineProps({
  value: String
})
</script>