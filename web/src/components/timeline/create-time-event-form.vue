<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Create your new event
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Year"
                  required
                  type="number"
                  v-model.number="timeEvent.date"
                  :rules="dateRules"
                />
                <v-text-field
                  label="Title"
                  required
                  type="text"
                  v-model="timeEvent.title"
                />
                <v-text-field
                  label="Importance"
                  required
                  type="number"
                  v-model.number="timeEvent.importance"
                  :rules="importanceRules"
                />
              </v-col>
              <v-col cols="12" sm="6" align-self="center">
                <v-file-input
                  accept="image/jpeg, image/gif, image/png, image/svg+xml"
                  outlined
                  small-chips
                  multiple
                  label="Add images"
                  v-model="images"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Text"
                  required
                  auto-grow
                  outlined
                  type="text"
                  v-model="timeEvent.text"
                /> </v-col
            ></v-row> </v-container
        ></v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click.stop="back()">
          Back
        </v-btn>
        <v-btn
          v-if="!editMode"
          :disabled="!valid"
          color="primary"
          @click.stop="create()"
        >
          Create
        </v-btn>
        <v-btn
          v-if="editMode"
          :disabled="!valid"
          color="primary"
          @click.stop="edit()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEventCreator from "@/timeline/time-event-creator";
import HttpClient from "@/api/http-client";
import { v4 as uuid } from "uuid";
import store from "@/store/store";
import ImageReferenceModel from "@/models/image-reference-model";
import { getExtension } from "mime";
import TimeEventModel from "@/models/time-event-model";
import PositionTranslator from "@/timeline/position-translator";

export default Vue.extend({
  name: "CreateTimeEventForm",

  data() {
    return {
      images: [] as File[],

      valid: true,
      importanceRules: [
        (v: number) =>
          !store.state.timeEvents
            .filter(timeEvent => timeEvent.id != this.timeEvent.id)
            .map(timeEvent => timeEvent.importance)
            .includes(Number(v)) ||
          "Another time event already holds the same importance level. Please pick a different level!"
      ],
      dateRules: [
        (v: number) =>
          !store.state.timeEvents
            .filter(timeEvent => timeEvent.id != this.timeEvent.id)
            .map(timeEvent => timeEvent.date)
            .includes(Number(v)) ||
          "You cannot place two events at the same date. Sorry!"
      ]
    };
  },

  props: {
    value: Boolean,
    editMode: Boolean,

    timeEvent: {
      type: Object
    }
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    async create() {
      // TODO: Error handling: If unsuccessful, do not close, show error, preserve entered data.
      // TODO: Merge adding time event and storing image into one call. No reason to have separate calls.
      const timeEvent = new TimeEventModel(
        PositionTranslator.toAbsolutePosition(this.timeEvent.date),
        uuid(),
        this.timeEvent.text,
        this.timeEvent.date,
        this.timeEvent.importance,
        [],
        this.timeEvent.title
      );

      await TimeEventCreator.Instance.addTimeEvent(timeEvent);

      if (this.images.length > 0) {
        await this.uploadImages(this.timeEvent);
      }

      this.cleanInputs();
      this.show = false;
    },

    async edit() {
      store.dispatch(
        "updateTimeEvent",
        new TimeEventModel(
          PositionTranslator.toAbsolutePosition(this.timeEvent.date),
          this.timeEvent.id,
          this.timeEvent.text,
          this.timeEvent.date,
          this.timeEvent.importance,
          this.timeEvent.imageReferences,
          this.timeEvent.title
        )
      );

      if (this.images.length > 0) {
        await this.uploadImages(this.timeEvent);
      }

      this.cleanInputs();
      this.show = false;
    },

    cleanInputs() {
      this.images = [] as File[];
    },

    async uploadImages(timeEvent: TimeEventModel) {
      const imageReferences: ImageReferenceModel[] = [];
      const storeImageTasks: Promise<void>[] = [];

      this.images.forEach(async image => {
        const imageId = uuid();

        storeImageTasks.push(
          HttpClient.storeImage(
            image,
            imageId,
            timeEvent.id,
            store.state.selectedTimeline.id,
            store.state.user.id
          )
        );

        imageReferences.push(
          new ImageReferenceModel(imageId, getExtension(image.type) as string)
        );
      });

      try {
        await Promise.all(storeImageTasks);
        timeEvent.imageReferences = imageReferences;
        store.commit("updateTimeEvent", timeEvent);
      } catch (e) {
        console.warn(e);
        store.dispatch("deleteTimeEvent", timeEvent);
      }
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
