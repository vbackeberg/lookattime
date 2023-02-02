import { validate as validUuid } from "uuid";
import TimeEventRequest from "./models/api/time-event-request";

export default class TimeEventRequestValidator {
    public static isValid(timeEventRequest: TimeEventRequest): boolean {
        return (
          validUuid(timeEventRequest.id) &&
          validUuid(timeEventRequest.timelineId) &&
          validUuid(timeEventRequest.userId) &&
          !isNaN(timeEventRequest.dateValue) &&
          !isNaN(timeEventRequest.importanceValue)
        );
      }
}