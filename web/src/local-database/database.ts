import TimeEventRequestMapper from "@/api/time-event/time-event-request-mapper";
import TimeEventResponse from "@/api/time-event/time-event-response";
import TimeEventResponseMapper from "@/api/time-event/time-event-response-mapper";
import TimelineRequest from "@/api/timeline/timeline-request";
import TimelineResponse from "@/api/timeline/timeline-response";
import TimeEventModel from "@/models/time-event-model";
import Dexie, { Table } from "dexie";

export default class Database extends Dexie {
  private users: Table;
  private timelines: Table;
  private timeEvents: Table;

  private constructor() {
    super("database");

    this.version(1).stores({
      users: "id, nameValue",
      timelines: "id, userId, title",
      timeEvents: "id, timelineId, title, textValue, dateValue, importanceValue"
    });

    this.users = this.table("users");
    this.timelines = this.table("timelines");
    this.timeEvents = this.table("timeEvents");
  }

  public async deleteUser(id: string) {
    return this.users
      .where("id")
      .equals(id)
      .delete();
  }

  public async postUser(id: string, name: string) {
    return this.users.add({ id: id, nameValue: name });
  }

  public async postTimeEvent(timeEvent: TimeEventModel, timelineId: string) {
    const request = TimeEventRequestMapper.map(timeEvent, timelineId);

    this.timeEvents.add({
      id: request.id,
      timelineId: request.timelineId,
      title: request.title,
      textValue: request.textValue,
      dateValue: request.dateValue,
      importanceValue: request.importanceValue
    });
  }

  public async getTimeEvents(timelineId: string): Promise<TimeEventModel[]> {
    const response = (await this.timeEvents
      .where("timelineId")
      .equals(timelineId)
      .toArray()) as TimeEventResponse[];

    const timeEvents = [] as TimeEventModel[];
    for (let i = 0; i < response.length; i++) {
      timeEvents.push(TimeEventResponseMapper.map(response[i]));
    }

    return timeEvents;
  }

  public async postTimeline(timelineRequest: TimelineRequest) {
    this.timelines.add({
      id: timelineRequest.id,
      userId: timelineRequest.userId,
      title: timelineRequest.title
    });
  }

  public async getTimelines(userId: string): Promise<TimelineResponse[]> {
    return (await this.timelines
      .where("userId")
      .equals(userId)
      .toArray()) as TimelineResponse[];
  }

  private static instance: Database;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
