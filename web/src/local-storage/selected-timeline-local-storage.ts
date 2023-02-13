export default class SelectedTimelineLocalStorage {
  public static getSelectedTimelineId(): string {
    return window.localStorage.getItem("selectedTimelineId") as string;
  }

  public static setSelectedTimelineId(selectedTimelineId: string) {
    window.localStorage.setItem("selectedTimelineId", selectedTimelineId);
  }
}
