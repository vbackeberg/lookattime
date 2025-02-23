export async function load() {
    const timeEvents: TimeEvent[] = [{
        id: "1b686c64-fc61-4ee2-ab18-0e320b108efe",
        date: 1_738_964_130,
        text: "text 1"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_737_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_735_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_736_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_737_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_734_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_733_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_732_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_731_581_730,
        text: "text 2"
    }, {
        id: "9081f515-a072-45dd-b6ab-15f971578092",
        date: 1_730_581_730,
        text: "text 2"
    }].toSorted((a, b) => a.date - b.date)

    return { timeEvents }
}