export default class FullscreenEventTarget implements EventTarget {
  private eventTarget: EventTarget;
  constructor() {
    this.eventTarget = new EventTarget();
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.eventTarget.addEventListener(type, callback, options);
  }
  dispatchEvent(event: CustomEvent): boolean {
    return this.eventTarget.dispatchEvent(event);
  }
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void {
    this.eventTarget.removeEventListener(type, callback, options);
  }
  public static instance: FullscreenEventTarget;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
