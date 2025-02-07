export function toPosition(date: number) {
    return date / zoomLevel + dateZero
}

const dateZero = screen.availWidth / 2
const zoomLevel = 1