import { useLookAtTime } from "@/store/store";

export default class DebugLogger {
    private constructor(private store = useLookAtTime()) { }
    public logTimelineState(caller: string) {

        console.debug(`
        ${caller}:
        Timeline State:
        clientWidth: ${this.store.timelineElement?.clientWidth}
        scrollWidth: ${this.store.timelineElement?.scrollWidth}
        scrollLeft: ${this.store.timelineElement?.scrollLeft}
        spacerLeft: ${this.store.spacerLeft?.positionLeft}
        spacerRight: ${this.store.spacerRight?.positionLeft}
      ${this.store.timeEvents.map((t, i) => `
        timeEvent ${i} is at: ${t.positionCenter}`)}
        
        `)
    }

    private static instance: DebugLogger;
    public static get Instance() {
        return this.instance || (this.instance = new this());
    }
}