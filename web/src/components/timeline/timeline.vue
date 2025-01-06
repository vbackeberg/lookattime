<template>
  <div ref="timeline" id="timeline">
    <div id="buffer-top-area">
      <!-- space management listens to this zoom-transition -->
      <svg id="spacer-left" class="spacer zoom-transition"></svg>
      <svg id="spacer-right" class="spacer"></svg>
      <svg id="spacer-viewport-right" class="spacer"></svg>
    </div>
    <div id="time-event-area">
      <time-event v-for="timeEvent in store.timeEvents" v-bind:key="timeEvent.id" v-bind:id="timeEvent.id"
        v-bind:imageReferences="timeEvent.imageReferences" v-bind:isFullscreen="timeEvent.isFullscreen"
        v-bind:writeMode="timeEvent.writeMode"
        v-on:openContextMenu="openContextMenu($event, timeEvent.id)"></time-event>
      <time-event-to-be-created v-if="store.timeEventToBeCreated" v-bind:id="store.timeEventToBeCreated.id"
        v-bind:imageReferences="store.timeEventToBeCreated.imageReferences"
        v-bind:writeMode="true"></time-event-to-be-created>
      <horizontal-line></horizontal-line>
    </div>
    <!-- TODO: When depth below years, show year as a big number underneath -->
    <div id="time-marker-area"></div>
    <v-tooltip location="top end" text="Add new time event" v-if="!store.readOnlyMode" transition="fade-transition">
      <template v-slot:activator="{ props }">
        <v-fab id="fab" v-bind="props" color="primary" icon="mdi-plus"
          @click.stop="createNewTimeEvent"></v-fab>
      </template>
    </v-tooltip>
    <v-overlay :value="store.loading">
      <div class="loading-container">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="loading-text fadeIn delay3s">
          Please wait while we are spinning up our database...
        </p>
        <v-btn rounded color="error" class="fadeIn delay8s" @click.stop="reloadPage()">refresh now</v-btn>
      </div>
    </v-overlay>

    <v-menu v-model="showContextMenu" :position-x="x" :position-y="y" absolute offset-y style="max-width: 600px">
      <v-list>
        <v-list-item v-on:click.stop="deleteEvent()">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import TimeEvent from "@/components/timeline/time-event/time-event.vue";
import SpaceObserver from "@/timeline/space-management/space-observer";
import ZoomObserver from "@/timeline/zooming/zoom-observer";
import ViewFocusTrigger from "@/timeline/viewport/view-focus-trigger";
import TimeEventModel from "@/models/time-event/time-event-model";
import Spacer from "@/models/spacer";
import CollisionCalculationTrigger from "@/timeline/collision/collision-calculation-trigger";
import TimeMarkerRecreationTrigger from "@/timeline/time-marker-management/time-marker-recreation-trigger";
import HorizontalLine from "@/components/timeline/horizontal-line.vue";
import { v4 as uuid } from "uuid";
import { Temporal } from "@js-temporal/polyfill";
import TimeEventToBeCreated from "./time-event/time-event-to-be-created.vue";
import { useLookAtTime } from "@/store/store";
import { nextTick, onMounted, useTemplateRef } from "vue";
import type { FullscreenToggled } from "./time-event/fullscreen/fullscreen-toggled";

const store = useLookAtTime();

let isFullscreen = false;
let showContextMenu = false;
let x = 0;
let y = 0;
let selectedTimeEventId = null as string | null

const timelineElement = useTemplateRef("timeline")

onMounted(async () => {
  setHTMLElements();
  setSpacers();

  store.timelineZero = timelineElement.value!.clientWidth / 2;

  initializeTimelineServices();

  await store.loadUser();

  document.addEventListener("fullscreen-toggled", (e) => {
    const event = e as CustomEvent<FullscreenToggled>;
    const index = store.timeEvents.findIndex(
      (timeEvent) => timeEvent.id == event.detail.timeEventId
    );

    if (index !== -1) {
      store.timeEvents[index].isFullscreen = event.detail.isFullscreen;
      store.timeEvents[index].writeMode = event.detail.writeMode;
    }
  });
})

function openContextMenu(e: MouseEvent, timeEventId: string) {
  selectedTimeEventId = timeEventId;

  showContextMenu = false;
  x = e.clientX;
  y = e.clientY;
  nextTick(() => {
    showContextMenu = true;
  });
}

function createNewTimeEvent() {
  const date = Temporal.Now.instant().epochSeconds;
  const timeEventToBeCreated = new TimeEventModel(
    uuid(),
    "",
    date,
    0, // TODO Shouldn't be set when creating. Maybe make 0 or -1 a reserved value for not set.
    [],
    ""
  );

  store.timeEventToBeCreated = timeEventToBeCreated;

  document.dispatchEvent(
    new CustomEvent<FullscreenToggled>("fullscreen-toggled", {
      detail: {
        timeEventId: timeEventToBeCreated.id,
        isFullscreen: true,
        writeMode: true
      }
    })
  );
}

function deleteEvent() {
  if (selectedTimeEventId) {
    store.deleteTimeEvent(selectedTimeEventId);
  }
  showContextMenu = false;
}

function setHTMLElements() {
  store.timelineElement = document.getElementById(
    "timeline"
  ) as HTMLElement;
}

function setSpacers() {
  store.spacerViewportRight = new Spacer(0, 1, "spacer-viewport-right");
  store.spacerLeft = new Spacer(0, 1, "spacer-left");
  store.spacerRight = new Spacer(0, 1, "spacer-right");
}

function initializeTimelineServices() {
  SpaceObserver.Instance;
  ZoomObserver.Instance;
  ViewFocusTrigger.Instance;
  CollisionCalculationTrigger.Instance;
  TimeMarkerRecreationTrigger.Instance;
}

function reloadPage() {
  location.href = location.href;
}
</script>

<style scoped lang="css">
#timeline {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  background-color: #fff;

  display: flex;
  flex-flow: column nowrap;
}

#time-event-area {
  flex: 5 0 200px;

  position: relative;
}

#time-marker-area {
  flex: 1 0 16px;

  position: relative;
}

#fab {
  position: fixed;
  bottom: 120px;
  right: 120px;
}

.spacer {
  box-sizing: border-box;
  position: absolute;
  height: 1px;
  width: 1px;
  transform-origin: left;
}

.loading-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  .loading-text {
    font-size: 1.2rem;
    margin-top: 64px;
  }

  .fadeIn {
    opacity: 0;
    visibility: hidden;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
    animation-name: fadeIn;
  }

  .delay3s {
    animation-delay: 3s;
  }

  .delay8s {
    animation-delay: 8s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      visibility: visible;
    }

    to {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
