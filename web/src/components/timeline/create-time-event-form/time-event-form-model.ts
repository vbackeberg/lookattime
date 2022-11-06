import TimeEventModel from "@/models/time-event-model";

export declare type TimeEventFormModel = Pick<
  TimeEventModel,
  "id" | "title" | "text" | "date" | "importance" | "imageReferences"
>;
