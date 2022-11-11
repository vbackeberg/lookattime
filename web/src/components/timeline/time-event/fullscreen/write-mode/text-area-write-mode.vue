<template>
  <div class="text-area">
    <div class="title-area">
      <!-- title and importance -->
      <v-row>
        <v-col cols="10">
          <v-text-field
            class="event-title flex-grow-3"
            outlined
            full-width
            label="Title"
            required
            type="text"
            v-model="title"
            :rules="[ruleNotEmpty]"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="flex-grow-1"
            label="Importance"
            required
            type="number"
            v-model.number="importance"
            :rules="[ruleImportance, ruleNotEmpty]"
          />
        </v-col>
      </v-row>
      <!-- date and time picker -->
      <v-row>
        <div class="d-flex">
          <v-menu
            v-model="datePickerOpen"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="plainDate"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[ruleNotEmpty]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="plainDate"
              @input="datePickerOpen = false"
            ></v-date-picker>
          </v-menu>

          <v-btn
            small
            depressed
            fab
            color="grey lighten-4"
            class="mx-1 my-auto"
            @click.stop="timePickerVisible = !timePickerVisible"
          >
            <v-icon>mdi-clock-time-four-outline</v-icon>
          </v-btn>

          <v-menu
            ref="menu"
            v-model="timePickerOpen"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="plainTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-fade-transition>
                <v-text-field
                  v-model="plainTime"
                  label="Time"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  v-show="timePickerVisible"
                ></v-text-field>
              </v-fade-transition>
            </template>
            <v-time-picker
              v-if="timePickerOpen"
              v-model="plainTime"
              use-seconds
              full-width
              @click:second="$refs.menu.save(plainTime)"
            ></v-time-picker>
          </v-menu>
        </div>
      </v-row>
      <!-- TODO: Maybe, add relationships to other dates here. (like wikipedia tags below title) -->
    </div>
    <editor-write-mode v-model="text" />

    <div>
      <v-btn color="secondary" text @click.stop="show = false">
        Back
      </v-btn>
      <v-btn
        :disabled="!valid || loading"
        color="primary"
        @click.stop="submit()"
        ><v-progress-circular
          indeterminate
          size="24"
          v-if="loading"
        ></v-progress-circular>
        {{ this.updateMode ? "Save" : "Create" }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ImageReferenceModel from "@/models/image-reference-model";
import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import TemporalConversion from "@/temporal-extensions/temporal-conversion";
import PositionTranslator from "@/timeline/position-translator";
import Vue from "vue";
import EditorWriteMode from "./editor-write-mode.vue";
import { v4 as uuid } from "uuid";
import { getExtension } from "mime";

export default Vue.extend({
  name: "TextAreaWriteMode",
  components: { EditorWriteMode },
  props: {
    id: String
  },
  data() {
    return {
      // Form validation rules:
      ruleImportance: (v: number) =>
        !store.state.timeEvents
          .filter(timeEvent => timeEvent.id != this.id)
          .map(timeEvent => timeEvent.importance)
          .includes(Number(v)) ||
        "You have another time event with the same importance level. Please pick a different level!",
      ruleNotEmpty: (v: string) => !!v || "This field is required",

      // Date picker state:
      datePickerOpen: false,
      timePickerOpen: false,
      timePickerVisible: false,

      // Form fields:
      plainDate: null as null | string,
      plainTime: null as null | string,
      title: null as null | string,
      text: null as null | string,
      importance: null as null | number,

      // Images
      imageFiles: [] as File[],

      imageReferencesToDelete: [] as ImageReferenceModel[],
      imageReferencesToAdd: [] as ImageReferenceModel[],

      // Form state:
      valid: true,
      loading: false
    };
  },

  created() {
    if (this.id !== null) {
      this.populateForm();
    }
  },

  computed: {
    imageReferences(): ImageReferenceModel[] {
      const imageReferences = (this.imageReferences ??
        []) as ImageReferenceModel[];

      return imageReferences
        .filter(
          imageReference =>
            !this.imageReferencesToDelete.includes(imageReference)
        )
        .concat(this.imageReferencesToAdd);
    },

    updateMode(): boolean {
      return this.id !== null;
    }
  },

  methods: {
    populateForm() {
      const index = store.state.timeEvents.findIndex(
        timeEvent => timeEvent.id === this.id
      );

      if (index === -1) {
        throw Error("Could not get time event index because it was not found");
      } else {
        const timeEvent = store.state.timeEvents[index];

        this.title = timeEvent.title;
        this.text = timeEvent.text;
        this.importance = timeEvent.importance;
        this.plainDate = TemporalConversion.plainDate(timeEvent.date);
        this.plainTime = TemporalConversion.plainTime(timeEvent.date);
      }
    },

    /**
     * Submits an update or creation of a time event.
     *
     * All non-null asserted calls are secured by form validation rules.
     */
    async submit() {
      this.loading = true;

      this.prepareImagesForUpload();

      const action = this.updateMode ? "updateTimeEvent" : "addTimeEvent";
      const timeEventId = this.updateMode ? this.id : uuid();
      const date = TemporalConversion.epochSeconds(
        this.plainDate!,
        this.plainTime
      );

      try {
        await store.dispatch(action, {
          timeEvent: new TimeEventModel(
            PositionTranslator.toAbsolutePosition(date),
            timeEventId,
            this.text!,
            date,
            this.importance!,
            this.imageReferences,
            this.title!
          ),
          images: this.imageFiles
        });
      } catch (e) {
        console.log("dispatch " + action + " failed: ", e);
        this.loading = false;
      }
    },

    prepareImagesForUpload() {
      for (let i = 0; i < this.imageFiles.length; i++) {
        const imageId = uuid();
        const extension = getExtension(this.imageFiles[i].type) as string;

        this.imageFiles[i] = this.renameImage(
          this.imageFiles[i],
          imageId,
          extension
        );
        this.imageReferencesToAdd.push(
          new ImageReferenceModel(imageId, extension)
        );
      }
    },

    renameImage(image: File, imageId: string, extension: string): File {
      return new File([image], imageId + "." + extension, {
        type: image.type
      });
    },

    markImageForDeletion(imageReferenceToDelete: ImageReferenceModel) {
      this.imageReferencesToDelete.push(imageReferenceToDelete);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "src/components/timeline/time-event/fullscreen/fullscreen.scss";
</style>
