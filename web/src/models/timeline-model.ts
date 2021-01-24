export default class TimelineModel {
  id: string;
  userId: string;
  title: string;
  constructor(id: string, userId: string, title: string) {
    this.id = id;
    this.userId = userId;
    this.title = title;
  }
}
