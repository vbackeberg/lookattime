import TimeEventModel from "@/models/time-event-model";
import TimelineModel from "@/models/timeline-model";
import UserModel from "@/models/user-model";
import axios from "axios";
import ImageRequestMapper from "./image/image-request-mapper";
import TimeEventRequestMapper from "./time-event/time-event-request-mapper";
import TimeEventResponse from "./time-event/time-event-response";
import TimeEventResponseMapper from "./time-event/time-event-response-mapper";
import TimelineRequest from "./timeline/timeline-request";
import TimelineResponseMapper from "./timeline/timeline-response-mapper";
import UserApiMapper from "./user/user-api-mapper";

export default class HttpClient {
  /**
   * Calls API to delete a user.
   *
   * @param userId
   */
  static async deleteUser(userId: string) {
    const response = await axios.delete("/api/delete-user?id=" + userId);

    if (!response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }
  }

  /**
   * Calls API to create a new user.
   *
   * @param user
   */
  static async createUser(user: UserModel) {
    const response = await axios.post(
      "/api/create-user",
      UserApiMapper.toApi(user)
    );

    if (
      !response.status.toString().startsWith("2") &&
      !response.status.toString().startsWith("3")
    ) {
      throw new Error("Server responded with an error.");
    }
  }

  /**
   * Calls API to store an image.
   *
   * @param image
   * @param imageId
   * @param timeEventId
   * @param timelineId
   * @param userId
   */
  public static async storeImage(
    image: File,
    imageId: string,
    timeEventId: string,
    timelineId: string,
    userId: string
  ): Promise<void> {
    await axios.post(
      "/api/store-image?imageId=" +
        imageId +
        "&timeEventId=" +
        timeEventId +
        "&timelineId=" +
        timelineId +
        "&userId=" +
        userId,
      ImageRequestMapper.map(image)
    );
  }

  /**
   * Retrieves a user.
   *
   * @param userId
   */
  public static async getUser(userId: string): Promise<UserModel> {
    const response = await axios.get("/api/get-user?id=" + userId);

    return UserApiMapper.toModel(response.data);
  }

  /**
   * Calls API to delete a time event for given user.
   *
   * @param timeEventId
   * @param userId
   */
  static async deleteTimeEvent(timeEventId: string, userId: string) {
    const response = await axios.delete(
      "/api/delete-time-event?id=" + timeEventId + "&userId=" + userId
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }
  }

  /**
   * Calls API to create a new time event for given timeline and user.
   *
   * @param timeEvent
   * @param timelineId
   * @param userId
   */
  public static createTimeEvent(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string
  ) {
    axios.post(
      "/api/create-time-event",
      TimeEventRequestMapper.map(timeEvent, timelineId, userId)
    );
  }

  /**
   * Retrieves time events for given timeline from API.
   *
   * @param timelineId
   */
  public static async getTimeEvents(
    timelineId: string
  ): Promise<TimeEventModel[]> {
    const response = await axios.get(
      "/api/get-time-events?timelineId=" + timelineId
    );

    response.data as TimeEventResponse[];

    const timeEvents = [] as TimeEventModel[];
    for (let i = 0; i < response.data.length; i++) {
      timeEvents.push(TimeEventResponseMapper.map(response.data[i]));
    }

    return timeEvents;
  }

  /**
   * Calls API to delete a timeline for given user.
   *
   * @param timelineId
   * @param userId
   */
  static async deleteTimeline(timelineId: string, userId: string) {
    const response = await axios.delete(
      "/api/delete-timeline?id=" + timelineId + "&userId=" + userId
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }
  }

  /**
   * Calls API to create a new timeline.
   *
   * @param timeline
   */
  public static async createTimeline(timeline: TimelineRequest) {
    const response = await axios.post("/api/create-timeline", timeline);

    if (
      !response.status.toString().startsWith("2") &&
      !response.status.toString().startsWith("3")
    ) {
      throw new Error("Server responded with an error.");
    }
  }

  /**
   * Retrieves timelines for given user from API.
   *
   * @param userId
   */
  public static async getTimelines(userId: string): Promise<TimelineModel[]> {
    const response = await axios.get("/api/get-timelines?userId=" + userId);

    // TODO: Examine whether to catch 404 or work with empty array.

    const timelines = [] as TimelineModel[];
    for (let i = 0; i < response.data.length; i++) {
      timelines.push(TimelineResponseMapper.map(response.data[i]));
    }

    return timelines;
  }

  /**
   * Retrieves a timeline.
   *
   * @param timelineId
   */
  public static async getTimeline(timelineId: string): Promise<TimelineModel> {
    const response = await axios.get("/api/get-timeline?id=" + timelineId);

    return TimelineResponseMapper.map(response.data);
  }

  /**
   * Calls API to update a time event for given timeline and user.
   *
   * @param timeEvent
   * @param timelineId
   * @param userId
   */
  public static updateTimeEvent(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string
  ) {
    axios.post(
      "/api/update-time-event",
      TimeEventRequestMapper.map(timeEvent, timelineId, userId)
    );
  }
}
