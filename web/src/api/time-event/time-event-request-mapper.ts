import TimeEventModel from "@/models/time-event-model";
import TimeEventRequest from "./time-event-request";

export default class TimeEventRequestMapper {
  public static map(
    timeEvent: TimeEventModel,
    timelineId: string
  ): TimeEventRequest {
    return {
      id: timeEvent.id,
      timelineId: timelineId,
      title: timeEvent.title,
      textValue: timeEvent.text,
      dateValue: timeEvent.date,
      importanceValue: timeEvent.importance
    } as TimeEventRequest;
  }
}
