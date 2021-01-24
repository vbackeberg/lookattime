import TimelineModel from "@/models/timeline-model";
import TimelineResponse from "./timeline-response";

export default class TimelineResponseMapper {
  public static map(response: TimelineResponse): TimelineModel {
    const userId = response.userId ? response.userId : "";
    return new TimelineModel(response.id, userId, response.title);
  }
}
