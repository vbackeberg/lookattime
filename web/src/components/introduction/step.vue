<template>
  <v-tooltip content-class="bg-background elevation-4" width="400" :location="props.location"
    transition="fade-transition" :activator="`#${props.anchorElementId}`" v-model="show" v-if="anchorFound">
    {{ text }}
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  text: string,

  /** The element to position the step at */
  anchorElementId: string,

  /**
   * The element to trigger the next step.
   * If undefined, the `anchorElement` triggers the next step
   */
  triggerElementId?: string,

  /** Defines where to place the step card around the anchor element. */
  location: "top" | "bottom" | "left" | "right",

  /** Any event type such as "wheel" */
  trigger?: string
}>(), { trigger: "click", triggerElementId: (props) => props.anchorElementId })

const anchorFound = ref(false)
new MutationObserver((_, o) => {
  if (!document.getElementById(props.anchorElementId)) return
  anchorFound.value = true
  o.disconnect()
}).observe(document.body, {
  childList: true,
  subtree: true
});

document.getElementById(props.triggerElementId)?.addEventListener(props.trigger, () => { show.value = false; emits("next"); });
const show = ref(true);
const emits = defineEmits(["next"])
</script>
<style scoped></style>
