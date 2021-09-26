<template>
  <div class="zoom-container zoom-transition zoomable">
    <div class="buffer-top grow-transition"></div>
    <div class="content grow-transition">
      <v-card class="card" v-on:contextmenu="openContextMenu">
        <v-img
          v-bind:src="imageSource"
          class="card-image white--text align-end"
          alt="time event image"
        >
          <v-card-title class="card-title">{{ title }}</v-card-title>
        </v-img>
        <v-card-text class="card-text">{{ text }}</v-card-text>
      </v-card>
    </div>
    <connector class="grow-transition"></connector>
    <v-menu
      v-model="showContextMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      style="max-width: 600px"
    >
      <v-list>
        <v-list-item v-on:click.stop="showCreateTimeEventForm = true">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click.stop="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <create-time-event-form
      v-model="showCreateTimeEventForm"
      v-bind:timeEvent="{ id, text, date, importance, imageReferences, title }"
      v-bind:editMode="true"
    />
  </div>
</template>

<script lang="ts">
import ImageReferenceModel from "@/models/image-reference-model";
import store from "@/store/store";
import Vue from "vue";
import Connector from "./connector.vue";
import CreateTimeEventForm from "@/components/timeline/create-time-event-form.vue";

export default Vue.extend({
  name: "TimeEvent",

  components: {
    Connector,
    CreateTimeEventForm
  },

  props: {
    id: String,
    text: String,
    date: Number,
    importance: Number,
    imageReferences: Array,
    title: String
  },

  mounted() {
    this.setHTMLElement();
    this.setInitialPosition();
  },

  data() {
    return {
      showContextMenu: false,
      x: 0,
      y: 0,

      showCreateTimeEventForm: false
    };
  },

  computed: {
    timeEventIndex(): number {
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index !== -1) {
        return index;
      } else {
        throw Error("Could not get time event index because it was not found");
      }
    },

    imageSource(): string {
      if (this.imageReferences.length < 1) {
        return "";
      }

      const imageReference = this.imageReferences[0] as ImageReferenceModel;

      return (
        process.env.VUE_APP_IMAGE_URL +
        imageReference.id +
        "." +
        imageReference.extension
      );
    }
  },

  methods: {
    openContextMenu(e: MouseEvent) {
      e.preventDefault();
      this.showContextMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showContextMenu = true;
      });
    },

    deleteEvent() {
      store.dispatch("deleteTimeEvent", this.id);
    },

    setHTMLElement() {
      store.state.timeEvents[this.timeEventIndex].htmlElement = this
        .$el as HTMLElement;
    },

    /*
     * Re-assign positionCenter for translateX on htmlElement to be set.
     */
    setInitialPosition() {
      store.state.timeEvents[this.timeEventIndex].positionCenter =
        store.state.timeEvents[this.timeEventIndex].positionCenter;
    }
  }
});
</script>

<style scoped lang="scss">
.zoom-container {
  position: absolute;
  left: -150px; // TranslateX refers to the center of the element, so we position the elements center at 0px by shifting it half its width to the left.
  width: 300px;
  height: 100%;
  backface-visibility: hidden; // Reduces subtle vertical position shifting when translateX
  pointer-events: none;
  content-visibility: auto;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.grow-transition {
  transition: all 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.buffer-top-box {
  flex: 0 1 auto;
}

.buffer-top-bubble {
  flex: 16 0 auto;
}

.buffer-top-dot {
  flex: 16 0 auto;
}

.content {
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

  overflow: hidden;
  font-size: 0.875em;
}

.box {
  flex: 5 1 50px;

  width: 100%;
  border-radius: 4px;
}

.bubble {
  flex: 0 0 auto;

  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.dot {
  flex: 0 0 auto;

  width: 16px;
  height: 8px;

  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  border: 1px solid #000;
  border-bottom: 0;
  background-color: #000;
}

.connector-box {
  flex: 1 0 50px;
}

.connector-bubble {
  flex: 1 0 2px;
}

.connector-dot {
  flex: 0 0 0;
}

.card {
  height: 100%;
  pointer-events: auto;

  display: flex;
  flex-direction: column;
}

.card-image {
  height: 40%;
  min-height: 50px;
  max-height: 200px;
}

.card-text {
  flex-grow: 1;
  overflow-y: auto;
  text-align: left;
}

.card-title {
  text-shadow: 0px 0px 3px #000;
}
</style>
