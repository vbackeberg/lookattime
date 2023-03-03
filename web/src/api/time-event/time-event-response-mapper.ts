import TimeEventResponse from "@/api/time-event/time-event-response";
import TimeEventModel from "@/models/time-event/time-event-model";

export default class TimeEventResponseMapper {
  public static map(response: TimeEventResponse): TimeEventModel {
    return new TimeEventModel(
      response.id,
      response.textValue,
      response.dateValue,
      response.importanceValue,
      response.imageReferences,
      response.title
    );
  }
}
