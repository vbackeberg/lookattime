import TimeEventModel from "@/models/time-event/time-event-model";
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
  public static async deleteUser(userId: string): Promise<void> {
    return axios.delete(
      process.env.VUE_APP_API_URL + "/delete-user?id=" + userId
    );
  }

  /**
   * Calls API to create a new user.
   *
   * @param user
   */
  public static async createUser(user: UserModel): Promise<void> {
    return axios.post(
      process.env.VUE_APP_API_URL + "/create-user",
      UserApiMapper.toApi(user)
    );
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
    return axios.post(
      process.env.VUE_APP_API_URL +
        "/store-image?imageId=" +
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
    const response = await axios.get(
      process.env.VUE_APP_API_URL + "/get-user?id=" + userId
    );

    return UserApiMapper.toModel(response.data);
  }

  /**
   * Calls API to delete a time event for given timeline and user.
   *
   * @param timeEventId
   * @param timelineId
   * @param userId
   */
  public static async deleteTimeEvent(
    timeEventId: string,
    timelineId: string,
    userId: string
  ): Promise<void> {
    return axios.delete(
      process.env.VUE_APP_API_URL +
        "/delete-time-event?id=" +
        timeEventId +
        "&timelineId=" +
        timelineId +
        "&userId=" +
        userId
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
      process.env.VUE_APP_API_URL + "/get-time-events?timelineId=" + timelineId
    );

    return (response.data as TimeEventResponse[]).map(
      (timeEventResponse: TimeEventResponse) =>
        TimeEventResponseMapper.map(timeEventResponse)
    );
  }

  /**
   * Calls API to delete a timeline for given user.
   *
   * @param timelineId
   * @param userId
   */
  public static async deleteTimeline(
    timelineId: string,
    userId: string
  ): Promise<void> {
    return axios.delete(
      process.env.VUE_APP_API_URL +
        "/delete-timeline?id=" +
        timelineId +
        "&userId=" +
        userId
    );
  }

  /**
   * Calls API to create a new timeline.
   *
   * @param timeline
   */
  public static async createTimeline(timeline: TimelineRequest): Promise<void> {
    return axios.post(
      process.env.VUE_APP_API_URL + "/create-timeline",
      timeline
    );
  }

  /**
   * Retrieves timelines for given user from API.
   *
   * @param userId
   */
  public static async getTimelines(userId: string): Promise<TimelineModel[]> {
    const response = await axios.get(
      process.env.VUE_APP_API_URL + "/get-timelines?userId=" + userId
    );

    return (response.data as TimelineModel[]).map((timeline: TimelineModel) =>
      TimelineResponseMapper.map(timeline)
    );
  }

  /**
   * Retrieves a timeline.
   *
   * @param timelineId
   */
  public static async getTimeline(timelineId: string): Promise<TimelineModel> {
    const response = await axios.get(
      process.env.VUE_APP_API_URL + "/get-timeline?id=" + timelineId
    );

    return TimelineResponseMapper.map(response.data);
  }

  /**
   * Calls API to update a time event for given timeline and user.
   *
   * @param timeEvent
   * @param timelineId
   * @param userId
   * 
   * @returns updated time event.
   */
  public static async createOrUpdateTimeEvent(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string
  ): Promise<TimeEventModel> {
    const response = await axios.post(
      process.env.VUE_APP_API_URL + "/update-time-event",
      TimeEventRequestMapper.map(timeEvent, timelineId, userId)
    );

    return TimeEventResponseMapper.map(response.data as TimeEventResponse);
  }
}
