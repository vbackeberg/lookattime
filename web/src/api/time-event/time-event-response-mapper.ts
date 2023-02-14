import TimeEventResponse from "@/api/time-event/time-event-response";
import TimeEventModel from "@/models/time-event/time-event-model";
import PositionTranslator from "@/timeline/position-translator";

export default class TimeEventResponseMapper {
  public static map(response: TimeEventResponse): TimeEventModel {
    return new TimeEventModel(
      PositionTranslator.toAbsolutePosition(response.dateValue),
      response.id,
      response.textValue,
      response.dateValue,
      response.importanceValue,
      response.imageReferences,
      response.title
    );
  }
}
