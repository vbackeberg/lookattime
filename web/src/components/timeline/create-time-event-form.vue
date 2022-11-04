<!-- eslint-disable vue/no-mutating-props -->
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
                      <v-expand-x-transition>
                        <v-text-field
                          v-model="plainTime"
                          label="Time"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          v-show="timePickerVisible"
                        ></v-text-field>
                      </v-expand-x-transition>
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

                <v-text-field
                  label="Title"
                  required
                  type="text"
                  v-model="timeEvent.title"
                  :rules="[ruleNotEmpty]"
                />
                <v-text-field
                  label="Importance"
                  required
                  type="number"
                  v-model.number="timeEvent.importance"
                  :rules="[ruleImportance, ruleNotEmpty]"
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
                  :rules="[ruleNotEmpty]"
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
/* eslint-disable vue/no-mutating-props */
import Vue from "vue";
import { v4 as uuid } from "uuid";
import store from "@/store/store";
import TimeEventModel from "@/models/time-event-model";
import PositionTranslator from "@/timeline/position-translator";
import { VForm } from "@/types";
import ImageReferenceModel from "@/models/image-reference-model";
import { getExtension } from "mime";
import { Temporal } from "@js-temporal/polyfill";

export default Vue.extend({
  name: "CreateTimeEventForm",

  data() {
    return {
      images: [] as File[],
      imageReferencesToDelete: [] as ImageReferenceModel[],
      imageReferencesToAdd: [] as ImageReferenceModel[],

      plainDate: null,
      plainTime: null,

      datePickerOpen: false,
      timePickerOpen: false,
      timePickerVisible: false,

      loading: false,
      valid: true,

      // Form validation rules:
      ruleImportance: (v: number) =>
        !store.state.timeEvents
          .filter(timeEvent => timeEvent.id != this.timeEvent.id)
          .map(timeEvent => timeEvent.importance)
          .includes(Number(v)) ||
        "You have another time event with the same importance level. Please pick a different level!",
      ruleNotEmpty: (v: string) => !!v || "This field is required"
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date = this.parseDate(this.plainDate!, this.plainTime);

      try {
        await store.dispatch(action, {
          timeEvent: new TimeEventModel(
            PositionTranslator.toAbsolutePosition(date),
            timeEventId,
            this.timeEvent.text,
            date,
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

    /**
     * Converts existing date into a ZonedDateTime and changes date to `plainDate` and time to `plainTime`.
     */
    parseDate(plainDate: string, plainTime: string | null) {
      const date = Temporal.Instant.from(
        `${plainDate}T${plainTime ? plainTime : "00:00:00"}+0000`
      ).epochSeconds;
      return date;
    },

    close() {
      this.clearInput();
      this.show = false;
      this.loading = false;
    },

    clearInput() {
      this.images = [] as File[];
      this.imageReferencesToAdd = [] as ImageReferenceModel[];
      this.imageReferencesToDelete = [] as ImageReferenceModel[];
      (this.$refs.form as VForm).reset();
    },

    back() { // TODO: probably obsolete
      this.clearInput();
      this.show = false;
    }
  }
});
</script>

<style lang="scss"></style>
