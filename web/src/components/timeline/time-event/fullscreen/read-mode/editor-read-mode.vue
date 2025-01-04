<template>
  <div class="ck-content" v-html="props.value"></div>
</template>

<script setup lang="ts">

const props = defineProps({
  value: String
})
</script>