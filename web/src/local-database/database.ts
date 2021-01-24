import TimeEventRequestMapper from "@/api/time-event/time-event-request-mapper";
import TimeEventResponse from "@/api/time-event/time-event-response";
import TimeEventResponseMapper from "@/api/time-event/time-event-response-mapper";
import TimelineRequest from "@/api/timeline/timeline-request";
import UserApiModel from "@/api/user/user-api-model";
import UserApiMapper from "@/api/user/user-api-mapper";
import TimeEventModel from "@/models/time-event-model";
import UserModel from "@/models/user-model";
import Dexie, { Table } from "dexie";
import TimelineModel from "@/models/timeline-model";
import TimelineResponse from "@/api/timeline/timeline-response";
import TimelineResponseMapper from "@/api/timeline/timeline-response-mapper";
import TimelineRequestMapper from "@/api/timeline/timeline-request-mapper";

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

  public async getUser(): Promise<UserApiModel> {
    return ((await this.users.toArray()) as UserApiModel[])[0];
  }

  public async deleteUser(id: string) {
    return this.users
      .where("id")
      .equals(id)
      .delete();
  }

  public async createUser(user: UserModel) {
    return this.users.add(UserApiMapper.toApi(user));
  }

  public async createTimeEvent(
    timeEvent: TimeEventModel,
    timelineId: string,
    userId: string
  ) {
    const request = TimeEventRequestMapper.map(timeEvent, timelineId, userId);

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

  public async createTimeline(timeline: TimelineModel) {
    const request = TimelineRequestMapper.map(timeline);

    this.timelines.add({
      id: request.id,
      userId: request.userId,
      title: request.title
    });
  }

  public async getTimelines(userId: string): Promise<TimelineModel[]> {
    const response = (await this.timelines
      .where("userId")
      .equals(userId)
      .toArray()) as TimelineResponse[];

    const timelines = [] as TimelineModel[];
    for (let i = 0; i < response.length; i++) {
      timelines.push(TimelineResponseMapper.map(response[i]));
    }

    return timelines;
  }

  private static instance: Database;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
