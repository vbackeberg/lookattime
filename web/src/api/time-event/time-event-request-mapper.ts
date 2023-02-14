import TimeEventModel from "@/models/time-event/time-event-model";
import TimeEventRequest from "./time-event-request";

export default class TimeEventRequestMapper {
  public static map(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string
  ): TimeEventRequest {
    return {
      id: timeEvent.id,
      title: timeEvent.title,
      textValue: timeEvent.text,
      dateValue: timeEvent.date,
      importanceValue: timeEvent.importance,
      timelineId,
      userId
    } as TimeEventRequest;
  }
}
