export async function load() {
    const timeEvents: TimeEvent[] = [{
        id: "1b686c64-fc61-4ee2-ab18-0e320b108efe",
        date: 1739034764,
        text: "text 1"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1735581730,
        text: "text 2"
    }]

    return { timeEvents }
}