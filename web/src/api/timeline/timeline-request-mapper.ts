import TimelineModel from "@/models/timeline-model";
import TimelineRequest from "./timeline-request";

export default class TimelineRequestMapper {
  public static map(timeline: TimelineModel): TimelineRequest {
    return {
      id: timeline.id,
      userId: timeline.userId,
      title: timeline.title
    } as TimelineRequest;
  }
}
