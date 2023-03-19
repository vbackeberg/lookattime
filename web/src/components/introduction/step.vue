<template>
  <transition :name="`slide-${location}`">
    <v-card elevation="10" class="step-card" v-show="elementsFound"
      ><v-card-text class="black--text">{{ text }}</v-card-text></v-card
    >
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Step",

  props: {
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
  },

  data() {
    return {
      elementsFound: false,
      anchorElement: undefined as DOMRect | null | undefined,
      triggerElement: undefined as Element | null | undefined,
      mutationObserver: {} as MutationObserver
    };
  },

  /**
   * Starts trying to position the step component at the right location.
   * The `anchorElement` may appear in the DOM before or after
   * the step component has been created.
   */
  mounted() {
    const observer = new MutationObserver(() => {
      this.tryPlaceNearAnchorElement(observer);
    });

    this.tryPlaceNearAnchorElement(observer);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  methods: {
    /**
     * Places the element next to the `anchorElement` if it is present.
     */
    async tryPlaceNearAnchorElement(mutationObserver: MutationObserver) {
      this.anchorElement = this.getElementByIdOrClass(
        this.anchorElementIdOrClass
      )?.getBoundingClientRect();

      this.triggerElement = this.getElementByIdOrClass(
        this.triggerElementIdOrClass ?? this.anchorElementIdOrClass
      );

      // Do not proceed until required elements are found.
      if (!this.anchorElement || !this.triggerElement) return;

      this.elementsFound = true;

      mutationObserver.disconnect();

      // Element isn't yet rendered, which would make it's height 0.
      await this.$nextTick();

      const margin = 24;

      switch (this.location) {
        case "top": {
          (this.$el as HTMLElement).style.bottom =
            document.documentElement.clientHeight -
            this.anchorElement.top +
            margin +
            "px";

          this.horizontalAlignCenter();
          break;
        }
        case "bottom": {
          (this.$el as HTMLElement).style.top =
            this.anchorElement.bottom + margin + "px";

          this.horizontalAlignCenter();
          break;
        }
        case "left": {
          (this.$el as HTMLElement).style.right =
            document.documentElement.clientWidth -
            this.anchorElement.left +
            margin +
            "px";

          this.verticalAlignCenter();
          break;
        }
        case "right": {
          (this.$el as HTMLElement).style.left =
            this.anchorElement.right + margin + "px";

          this.verticalAlignCenter();
          break;
        }
      }

      this.triggerElement.addEventListener(this.trigger, () => {
        this.$emit("next");
      });
    },

    verticalAlignCenter() {
      (this.$el as HTMLElement).style.top =
        this.anchorElement!!.top +
        this.anchorElement!!.height / 2 -
        (this.$el as HTMLElement).offsetHeight / 2 +
        "px";

      console.log((this.$el as HTMLElement).style.top);
    },

    horizontalAlignCenter() {
      (this.$el as HTMLElement).style.left =
        this.anchorElement!!.left +
        this.anchorElement!!.width / 2 -
        (this.$el as HTMLElement).offsetWidth / 2 +
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
