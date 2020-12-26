import TimeEventModel from "@/models/time-event-model";
import TimeEventResponse from "@/api/time-event-response";
import PositionTranslator from "@/timeline/position-translator";

export default class TimeEventResponseMapper {
  public static map(response: TimeEventResponse): TimeEventModel {
    return new TimeEventModel(
      PositionTranslator.toAbsolutePosition(response.date),
      response.id,
      response.text,
      response.date,
      response.importance,
      response.imageIds
    );
  }
}
