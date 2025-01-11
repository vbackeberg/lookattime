<template>
  <transition :name="`slide-${location}`">
    <v-card elevation="10" class="step-card" v-show="elementsFound" :style="locationStyle">
      <v-card-text class="black--text">{{ text }}</v-card-text>
    </v-card>
  </transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },

  /** The element to position the step at */
  anchorElementIdOrClass: { type: String, required: true },

  /**
   * The element to trigger the next step.
   * If undefined, the `anchorElement` triggers the next step
   */
  triggerElementIdOrClass: { type: String },

  /** Defines where to place the step card around the anchor element. */
  location: {
    type: String,
    required: true,
    validator: (v: string) => ["top", "bottom", "left", "right"].includes(v)
  },

  /** Any event type such as "wheel" */
  trigger: { type: String, default: "click" }
})

const elementsFound = ref(false)
const anchorElement = ref<DOMRect | null | undefined>(undefined)
let triggerElement: Element | null | undefined = undefined

const emits = defineEmits(["next"])

/**
 * Starts trying to position the step component at the right location.
 * The `anchorElement` may appear in the DOM before or after
 * the step component has been created.
 */
onMounted(() => {
  const observer = new MutationObserver(() => {
    findElements(observer);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})

async function findElements(mutationObserver: MutationObserver) {
  anchorElement.value = getElementByIdOrClass(props.anchorElementIdOrClass)?.getBoundingClientRect();
  triggerElement = getElementByIdOrClass(props.triggerElementIdOrClass ?? props.anchorElementIdOrClass);

  // Do not proceed until required elements are found.
  if (!anchorElement.value || !triggerElement) return;

  elementsFound.value = true;
  mutationObserver.disconnect();
  triggerElement.addEventListener(props.trigger, () => { emits("next"); });

  // Element isn't yet rendered, which would make it's height 0.
  await nextTick();
}

/**
 * Places the element next to the `anchorElement` if it is present.
 */
const locationStyle = computed(() => {
  if (!elementsFound.value) return {}

  const margin = 24;

  switch (props.location) {
    case "top": {
      const bottom = `${document.documentElement.clientHeight - anchorElement.value!.top + margin}px`;
      return { bottom, left: horizontalAlignCenter() }
    }
    // case "bottom": {
    //   step.value!.style!.top =
    //     anchorElement.bottom + margin + "px";

    //   horizontalAlignCenter();
    //   break;
    // }
    case "left": {
      const left = `${document.documentElement.clientWidth - anchorElement.value!.left + margin}px`;

      return { left, top: verticalAlignCenter() }
    }
    //   verticalAlignCenter();
    //   break;
    // }
    // case "right": {
    //   step.value!.style!.left =
    //     anchorElement.right + margin + "px";

    //   verticalAlignCenter();
    //   break;
    // }
  }
})

function verticalAlignCenter() {
  return `${anchorElement.value!.top + anchorElement.value!.height / 2 - 200 / 2}px`
}

function horizontalAlignCenter() {
  return `${anchorElement!.value!.left + anchorElement!.value!.width / 2 - 200 / 2}px`
}

function getElementByIdOrClass(elementIdOrClass: string): Element | null {
  return (
    document.getElementById(elementIdOrClass) ??
    document.getElementsByClassName(elementIdOrClass)[0]
  );
}
</script>
<style scoped>
:root {
  --width: 240px;
  --transitionDuration: 0.3s;
  --translatePx: 10px;
}

.step-card {
  position: fixed;
  max-width: var(--width);
  height: fit-content;
  z-index: 7;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transitionDuration);
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-var(--translatePx));
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all var(--transitionDuration);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(var(--translatePx));
  opacity: 0;
}

.slide-top-enter-active,
.slide-top-leave-active {
  transition: all var(--transitionDuration);
}

.slide-top-enter,
.slide-top-leave-to {
  transform: translateY(-var(--translatePx));
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all var(--transitionDuration);
}

.slide-bottom-enter,
.slide-bottom-leave-to {
  transform: translateY(var(--translatePx));
  opacity: 0;
}
</style>
