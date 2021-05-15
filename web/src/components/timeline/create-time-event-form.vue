<template>
  <v-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title class="headline justify-center">
        Create your new event
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
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
                <v-chip-group>
                  <v-chip
                    close
                    small
                    v-for="imageReference in timeEvent.imageReferences"
                    v-bind:key="imageReference.id"
                    @click.stop="deleteImageReference(imageReference)"
                    >{{ imageReference.id }}</v-chip
                  >
                </v-chip-group>
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
          :disabled="!valid || loading"
          color="primary"
          @click.stop="create()"
        >
          <v-progress-circular
            indeterminate
            size="24"
            v-if="loading"
          ></v-progress-circular>
          <span v-else>Create</span>
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
import { v4 as uuid } from "uuid";
import store from "@/store/store";
import TimeEventModel from "@/models/time-event-model";
import PositionTranslator from "@/timeline/position-translator";
import { VForm } from "@/types";
import ImageReferenceModel from "@/models/image-reference-model";
import { getExtension } from "mime";

export default Vue.extend({
  name: "CreateTimeEventForm",

  data() {
    return {
      images: [] as File[],

      loading: false,

      valid: true,
      importanceRules: [
        (v: number) =>
          !store.state.timeEvents
            .filter(timeEvent => timeEvent.id != this.timeEvent.id)
            .map(timeEvent => timeEvent.importance)
            .includes(Number(v)) ||
          "You have another time event with the same importance level. Please pick a different level!"
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
      type: Object,
      default() {
        return {
          date: undefined,
          title: undefined,
          importance: undefined,
          text: undefined,
          imageReferences: [] as ImageReferenceModel[]
        };
      }
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
      this.loading = true;

      const imageReferences: ImageReferenceModel[] = [];
      for (let i = 0; i < this.images.length; i++) {
        const imageId = uuid();
        const extension = getExtension(this.images[i].type) as string;

        this.images[i] = this.renameImage(this.images[i], imageId, extension);
        imageReferences.push(new ImageReferenceModel(imageId, extension));
      }

      const timeEvent = new TimeEventModel(
        PositionTranslator.toAbsolutePosition(this.timeEvent.date),
        uuid(),
        this.timeEvent.text,
        this.timeEvent.date,
        this.timeEvent.importance,
        imageReferences,
        this.timeEvent.title
      );

      try {
        await store.dispatch("addTimeEvent", {
          timeEvent,
          images: this.images
        });

        this.cleanInputs();
        this.show = false; //TODO It seems to close before await finishes.
        this.loading = false;
      } catch (e) {
        console.log("dispatch addTimeEvent failed: ", e);
      }
    },

    async edit() {
      this.loading = true;

      const imageReferences: ImageReferenceModel[] = [];
      this.images.forEach(image => {
        const imageId = uuid();
        const extension = getExtension(image.type) as string;

        image = this.renameImage(image, imageId, extension);
        imageReferences.push(new ImageReferenceModel(imageId, extension));
      });

      const timeEvent = new TimeEventModel(
        PositionTranslator.toAbsolutePosition(this.timeEvent.date),
        this.timeEvent.id,
        this.timeEvent.text,
        this.timeEvent.date,
        this.timeEvent.importance,
        this.timeEvent.imageReferences, // TODO: Update images, too. Existing images, need to be shown and be deletable.
        this.timeEvent.title
      );

      try {
        await store.dispatch("updateTimeEvent", {
          // TODO: Maybe combine create and edit.
          timeEvent,
          images: this.images
        });

        this.cleanInputs();
        this.show = false;
        this.loading = false;
      } catch (e) {
        console.log("dispatch updateTimeEvent failed: ", e);
      }
    },

    renameImage(image: File, imageId: string, extension: string): File {
      return new File([image], imageId + "." + extension, {
        type: image.type
      });
    },

    cleanInputs() {
      this.images = [] as File[];
      (this.$refs.form as VForm).reset();
    },

    back() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
