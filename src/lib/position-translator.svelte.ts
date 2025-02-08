
export let zoomLevel = $state(1_728_000_000_000)

export function toPosition(date: number) {
    return date / 1000000
}