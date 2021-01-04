import TimeEventModel from "@/models/time-event-model";
import axios from "axios";
import TimeEventRequestMapper from "./time-event/time-event-request-mapper";
import TimeEventResponse from "./time-event/time-event-response";
import TimeEventResponseMapper from "./time-event/time-event-response-mapper";

export default class HttpClient {

  /**
   * Call API to delete a user.
   * 
   * @param userId 
   */
  static async deleteUser(userId: string) {
    const response = await axios.delete(
      "http://localhost:7071/api/delete-user?id=" + userId
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error("Server did not respond with status 2xx.");
    }
  }

  /**
   * Calls API to create a new user.
   * 
   * @param userId 
   * @param name 
   */
  static async postUser(userId: string, name: string) {
    const response = await axios.post("http://localhost:7071/api/create-user", {
      id: userId,
      nameValue: "User Name"
    });

    if (
      !response.status.toString().startsWith("2") &&
      !response.status.toString().startsWith("3")
    ) {
      throw new Error("Server responded with an error.");
    }
  }

  /**
   * Calls API to create a new time event for given timeline.
   * 
   * @param timeEvent 
   * @param timelineId 
   */
  public static postTimeEvent(timeEvent: TimeEventModel, timelineId: string) {
    axios.post(
      "http://localhost:7071/api/create-time-event",
      TimeEventRequestMapper.map(timeEvent, timelineId)
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
      "http://localhost:7071/api/get-time-events?timelineId=" + timelineId
    );

    response.data as TimeEventResponse[];

    const timeEvents = [] as TimeEventModel[];
    for (let i = 0; i < response.data.length; i++) {
      timeEvents.push(TimeEventResponseMapper.map(response.data[i]));
    }

    return timeEvents;
  }
}