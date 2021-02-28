export default class SelectedTimelineLocalStorage {
  public getSelectedTimelineId(): string {
    return window.localStorage.getItem("selectedTimelineId") as string;
  }

  public setSelectedTimelineId(selectedTimelineId: string) {
    window.localStorage.setItem("selectedTimelineId", selectedTimelineId);
  }

  private static instance: SelectedTimelineLocalStorage;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
