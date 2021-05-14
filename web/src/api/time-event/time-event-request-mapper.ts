import TimeEventModel from "@/models/time-event-model";
import TimeEventRequest from "./time-event-request";

export default class TimeEventRequestMapper {
  public static map(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string,
    images: File[]
  ): FormData {
    const formData = new FormData();

    formData.append(
      "timeEvent",
      new Blob(
        [
          JSON.stringify({
            id: timeEvent.id,
            title: timeEvent.title,
            textValue: timeEvent.text,
            dateValue: timeEvent.date,
            importanceValue: timeEvent.importance,
            imageReferences: timeEvent.imageReferences
          })
        ],
        { type: "application/json" }
      )
    );
    formData.append(
      "timelineId",
      new Blob([timelineId], { type: "text/plain" })
    );
    formData.append("userId", new Blob([userId], { type: "text/plain" }));
    images.forEach(image => formData.append("image", image));

    return formData;
  }
}
