<template>
  <transition :name="`slide-${location}`">
    <v-card elevation="10" class="step-card" v-show="elementsFound"><v-card-text class="black--text">{{ text
        }}</v-card-text></v-card>
  </transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps({
  text: { type: String, required: true },

  /** The element to position the step at */
  anchorElementIdOrClass: { type: String, required: true },

  /**
   * The element to trigger the next step.
   * If undefined, the `anchorElement` triggers the next step
   */
  triggerElementIdOrClass: String,

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
let triggerElement = undefined as Element | null | undefined
let mutationObserver = {} as MutationObserver

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
    anchorElement = getElementByIdOrClass(
      anchorElementIdOrClass
    )?.getBoundingClientRect();

    triggerElement = getElementByIdOrClass(
      triggerElementIdOrClass ?? anchorElementIdOrClass
    );

    // Do not proceed until required elements are found.
    if (!anchorElement || !triggerElement) return;

    elementsFound = true;

    mutationObserver.disconnect();

    // Element isn't yet rendered, which would make it's height 0.
    await $nextTick();

    const margin = 24;

    switch (location) {
      case "top": {
        ($el as HTMLElement).style.bottom =
          document.documentElement.clientHeight -
          anchorElement.top +
          margin +
          "px";

        horizontalAlignCenter();
        break;
      }
      case "bottom": {
        ($el as HTMLElement).style.top =
          anchorElement.bottom + margin + "px";

        horizontalAlignCenter();
        break;
      }
      case "left": {
        ($el as HTMLElement).style.right =
          document.documentElement.clientWidth -
          anchorElement.left +
          margin +
          "px";

        verticalAlignCenter();
        break;
      }
      case "right": {
        ($el as HTMLElement).style.left =
          anchorElement.right + margin + "px";

        verticalAlignCenter();
        break;
      }
    }

    triggerElement.addEventListener(trigger, () => {
      $emit("next");
    });
  },

  verticalAlignCenter() {
    ($el as HTMLElement).style.top =
      anchorElement!!.top +
      anchorElement!!.height / 2 -
      ($el as HTMLElement).offsetHeight / 2 +
      "px";

    console.log(($el as HTMLElement).style.top);
  },

  horizontalAlignCenter() {
    ($el as HTMLElement).style.left =
      anchorElement!!.left +
      anchorElement!!.width / 2 -
      ($el as HTMLElement).offsetWidth / 2 +
      "px";
  },

  getElementByIdOrClass(elementIdOrClass: string): Element | null {
    return (
      document.getElementById(elementIdOrClass) ??
      document.getElementsByClassName(elementIdOrClass)[0]
    );
  }
}
});
</script>
<style lang="scss" scoped>
$width: 240px;

.step-card {
  position: fixed;
  max-width: $width;
  height: fit-content;
  z-index: 7;
}

$transitionDuration: 0.3s;
$translatePx: 10px;

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all $transitionDuration;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-$translatePx);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all $transitionDuration;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX($translatePx);
  opacity: 0;
}

.slide-top-enter-active,
.slide-top-leave-active {
  transition: all $transitionDuration;
}

.slide-top-enter,
.slide-top-leave-to {
  transform: translateY(-$translatePx);
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all $transitionDuration;
}

.slide-bottom-enter,
.slide-bottom-leave-to {
  transform: translateY($translatePx);
  opacity: 0;
}
</style>
