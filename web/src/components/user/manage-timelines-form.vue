<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Pick a timeline or create a new one!
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-list>
            <v-list-item-group v-model="selectedTimelineIndex">
              <v-list-item
                v-for="timeline in timelines"
                :key="timeline.id"
                v-on:click="select(timeline)"
              >
                {{ timeline.title }}
              </v-list-item>
              <v-list-item v-on:click="create()">
                Create new timeline</v-list-item
              >
            </v-list-item-group>
          </v-list>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click.stop="back()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { v4 as uuid } from "uuid";
import store from "@/store/store";
import TimelineModel from "@/models/timeline-model";

export default Vue.extend({
  name: "ManageTimelinesForm",

  props: {
    value: Boolean
  },

  data() {
    return {
      selectedTimelineIndex: 0
    };
  },

  created() {
    this.selectedTimelineIndex = this.timelines.indexOf(
      store.state.selectedTimeline
    );
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit("input", value);
      }
    },

    timelines() {
      return store.state.timelines;
    }
  },

  methods: {
    select(timeline: TimelineModel) {
      store.dispatch("setSelectedTimeline", timeline);

      this.show = false;
    },

    async create() {
      this.show = false;

      const timeline = new TimelineModel(
        uuid(),
        store.state.user.id,
        "Timeline"
      );

      await store.dispatch("addTimeline", timeline);
      store.dispatch("setSelectedTimeline", timeline);
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
