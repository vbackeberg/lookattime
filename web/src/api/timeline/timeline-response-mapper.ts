import TimelineModel from "@/models/timeline-model";
import TimelineResponse from "./timeline-response";

export default class TimelineResponseMapper {
  public static map(response: TimelineResponse): TimelineModel {
    return new TimelineModel(response.id, "", response.title);
  }
}
