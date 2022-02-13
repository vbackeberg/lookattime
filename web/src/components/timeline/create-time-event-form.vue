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
                  :rules="titleRules"
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
                <!-- TODO It should not move when chip group changes -->
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
                    v-for="imageReference in imageReferences"
                    v-bind:key="imageReference.id"
                    @click:close="markImageForDeletion(imageReference)"
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
                  :rules="textRules"
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
          :disabled="!valid || loading"
          color="primary"
          @click.stop="submit()"
          ><v-progress-circular
            indeterminate
            size="24"
            v-if="loading"
          ></v-progress-circular>
          {{ this.editMode ? "Save" : "Create" }}
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
      imageReferencesToDelete: [] as ImageReferenceModel[],
      imageReferencesToAdd: [] as ImageReferenceModel[],

      loading: false,

      valid: true,
      dateRules: [
        (v: number) => !!v || "This field is required",
        (v: number) =>
          !store.state.timeEvents
            .filter(timeEvent => timeEvent.id != this.timeEvent.id)
            .map(timeEvent => timeEvent.date)
            .includes(Number(v)) ||
          "You cannot place two events at the same date. Sorry!"
      ],
      titleRules: [(v: string) => !!v || "This field is required"],
      importanceRules: [
        (v: number) => !!v || "This field is required",
        (v: number) =>
          !store.state.timeEvents
            .filter(timeEvent => timeEvent.id != this.timeEvent.id)
            .map(timeEvent => timeEvent.importance)
            .includes(Number(v)) ||
          "You have another time event with the same importance level. Please pick a different level!"
      ],
      textRules: [(v: string) => !!v || "This field is required"]
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
    },

    imageReferences(): ImageReferenceModel[] {
      return (this.timeEvent.imageReferences as ImageReferenceModel[])
        .filter(
          imageReference =>
            !this.imageReferencesToDelete.includes(imageReference)
        )
        .concat(this.imageReferencesToAdd);
    }
  },

  methods: {
    async submit() {
      this.loading = true;

      this.prepareImagesForUpload();

      const action = this.editMode ? "updateTimeEvent" : "addTimeEvent";
      const timeEventId = this.editMode ? this.timeEvent.id : uuid();

      try {
        await store.dispatch(action, {
          timeEvent: new TimeEventModel(
            PositionTranslator.toAbsolutePosition(this.timeEvent.date),
            timeEventId,
            this.timeEvent.text,
            this.timeEvent.date,
            this.timeEvent.importance,
            this.imageReferences,
            this.timeEvent.title
          ),
          images: this.images
        });

        this.close();
      } catch (e) {
        console.log("dispatch " + action + " failed: ", e);
        this.loading = false;
      }
    },

    prepareImagesForUpload() {
      for (let i = 0; i < this.images.length; i++) {
        const imageId = uuid();
        const extension = getExtension(this.images[i].type) as string;

        this.images[i] = this.renameImage(this.images[i], imageId, extension);
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
    },

    close() {
      this.clearInput();
      this.show = false;
      this.loading = false;
    },

    clearInput() {
      this.images = [] as File[];
      this.imageReferencesToDelete = [] as ImageReferenceModel[];
      (this.$refs.form as VForm).reset();
    },

    back() {
      this.clearInput();
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
