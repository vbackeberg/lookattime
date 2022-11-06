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
                  v-model="title"
                  :rules="[ruleNotEmpty]"
                />
                <v-text-field
                  label="Importance"
                  required
                  type="number"
                  v-model.number="importance"
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
                <text-area-with-editor v-model="text" />
              </v-col>
            </v-row> </v-container
        ></v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
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
          {{ this.editMode ? "Save" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */
import TextAreaWithEditor from "@/components/timeline/create-time-event-form/text-area-with-editor.vue";
import ImageReferenceModel from "@/models/image-reference-model";
import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import PositionTranslator from "@/timeline/position-translator";
import { VForm } from "@/types";
import { getExtension } from "mime";
import { v4 as uuid } from "uuid";
import Vue from "vue";
import TemporalConversion from "@/temporal-extensions/temporal-conversion";

export default Vue.extend({
  name: "CreateTimeEventForm",

  components: {
    TextAreaWithEditor
  },

  data() {
    return {
      // Form fields
      plainDate: null as null | string,
      plainTime: null as null | string,
      title: null as null | string,
      text: null as null | string,
      importance: null as null | number,

      // Form validation rules:
      ruleImportance: (v: number) =>
        !store.state.timeEvents
          .filter(timeEvent => timeEvent.id != this.timeEvent.id)
          .map(timeEvent => timeEvent.importance)
          .includes(Number(v)) ||
        "You have another time event with the same importance level. Please pick a different level!",
      ruleNotEmpty: (v: string) => !!v || "This field is required",

      // Form state
      valid: true,
      loading: false,
      datePickerOpen: false,
      timePickerOpen: false,
      timePickerVisible: false,

      // Images
      images: [] as File[],
      imageReferencesToDelete: [] as ImageReferenceModel[],
      imageReferencesToAdd: [] as ImageReferenceModel[]
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
  watch: {
    show(value) {
      if (value) {
        this.prefillForm(this.timeEvent);
      } else {
        this.reset();
      }
    }
  },

  methods: {
    prefillForm(timeEvent: TimeEventModel) {
      this.title = timeEvent.title;
      this.text = timeEvent.text;
      this.importance = timeEvent.importance;
      this.plainDate = TemporalConversion.plainDate(timeEvent.date);
      this.plainTime = TemporalConversion.plainTime(timeEvent.date);
    },

    async submit() {
      this.loading = true;

      this.prepareImagesForUpload();

      const action = this.editMode ? "updateTimeEvent" : "addTimeEvent";
      const timeEventId = this.editMode ? this.timeEvent.id : uuid();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.plainDate!, // secured by form validation rule
        this.plainTime
      );

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

        this.show = false;
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

    reset() {
      this.loading = false;
      this.images = [] as File[];
      this.imageReferencesToAdd = [] as ImageReferenceModel[];
      this.imageReferencesToDelete = [] as ImageReferenceModel[];
      (this.$refs.form as VForm).reset();
    }
  }
});
</script>

<style lang="scss"></style>
