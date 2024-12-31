<template>
  <transition :name="`slide-${location}`">
    <v-card ref="step" elevation="10" class="step-card" v-show="elementsFound">
      <v-card-text class="black--text">{{ text }}</v-card-text>
    </v-card>
  </transition>
</template>

<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';

const step = useTemplateRef('step');

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

let elementsFound = false
let anchorElement = undefined as DOMRect | null | undefined

const emits = defineEmits(["next"])

/**
 * Starts trying to position the step component at the right location.
 * The `anchorElement` may appear in the DOM before or after
 * the step component has been created.
 */
onMounted(() => {
  const observer = new MutationObserver(() => {
    tryPlaceNearAnchorElement(observer);
  });

  tryPlaceNearAnchorElement(observer);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})

/**
 * Places the element next to the `anchorElement` if it is present.
 */
async function tryPlaceNearAnchorElement(mutationObserver: MutationObserver) {
  const anchorElement = getElementByIdOrClass(props.anchorElementIdOrClass)?.getBoundingClientRect();

  const triggerElement = getElementByIdOrClass(props.triggerElementIdOrClass ?? props.anchorElementIdOrClass);

  // Do not proceed until required elements are found.
  if (!anchorElement || !triggerElement) return;

  elementsFound = true;

  mutationObserver.disconnect();

  // Element isn't yet rendered, which would make it's height 0.
  await nextTick();

  const margin = 24;

  switch (props.location) {
    case "top": {
      step.value!.style!.bottom =
        document.documentElement.clientHeight -
        anchorElement.top +
        margin +
        "px";

      horizontalAlignCenter();
      break;
    }
    case "bottom": {
      step.value!.style!.top =
        anchorElement.bottom + margin + "px";

      horizontalAlignCenter();
      break;
    }
    case "left": {
      step.value!.style!.right =
        document.documentElement.clientWidth -
        anchorElement.left +
        margin +
        "px";

      verticalAlignCenter();
      break;
    }
    case "right": {
      step.value!.style!.left =
        anchorElement.right + margin + "px";

      verticalAlignCenter();
      break;
    }
  }

  triggerElement.addEventListener(trigger, () => { emits("next"); });
}

function verticalAlignCenter() {
  step.value!.style!.top =
    anchorElement!!.top +
    anchorElement!!.height / 2 -
    step.value!.offsetHeight / 2 +
    "px";
}

function horizontalAlignCenter() {
  step.value!.style!.left =
    anchorElement!!.left +
    anchorElement!!.width / 2 -
    step.value!.offsetWidth / 2 +
    "px";
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
