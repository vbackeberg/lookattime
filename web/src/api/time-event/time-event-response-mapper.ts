import TimeEventModel from "@/models/time-event-model";
import TimeEventResponse from "@/api/time-event/time-event-response";
import PositionTranslator from "@/timeline/position-translator";
import Big from "big.js";

export default class TimeEventResponseMapper {
  public static map(response: TimeEventResponse): TimeEventModel {
    const date = new Big(response.dateValue);

    return new TimeEventModel(
      PositionTranslator.toAbsolutePosition(date),
      response.id,
      response.textValue,
      date,
      response.importanceValue,
      response.imageReferences,
      response.title
    );
  }
}
