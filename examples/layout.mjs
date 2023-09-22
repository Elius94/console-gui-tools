import { ConsoleManager,ConfirmPopup, PageBuilder } from "../dist/esm/ConsoleGui.mjs"

const opt = {
    title: "Layout Test",
    layoutOptions: {
        type: "quad",
        boxed: true, // Set to true to enable boxed layout
        showTitle: true, // Set to false to hide title
        changeFocusKey: "ctrl+l", // Change layout with ctrl+l to switch to the logs page
        boxColor: "yellow",
        boxStyle: "bold",
        fitHeight: true,
    },
    logLocation: 1,
    enableMouse: true
}

const GUI = new ConsoleManager(opt)

GUI.on("exit", () => {
    closeApp()
})

GUI.on("keypressed", (key) => {
    switch (key.name) {
    case "q":
        new ConfirmPopup({
            id: "popupQuit", title: "Are you sure you want to quit?"
        }).show().on("confirm", () => closeApp())
        break
    default:
        break
    }
})

const closeApp = () => {
    console.clear()
    process.exit()
}

GUI.refresh()

const loremIpsumPage = new PageBuilder()

loremIpsumPage.addRow({
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    color: "red",
    bg: "blue",
})

loremIpsumPage.addRow({
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    color: "blue",
    bg: "red",
})

loremIpsumPage.addRow({
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    color: "green",
    bg: "yellow",
})

loremIpsumPage.addRow({
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    color: "yellow",
    bg: "green",
})

loremIpsumPage.addRow({
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    color: "cyan",
    bg: "magenta",
})

const loremIpsumOverflowedPage = new PageBuilder()

// add some random text to the page
for (let i = 0; i < 100; i++) {
    loremIpsumOverflowedPage.addRow({
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        color: "red",
        bg: "blue",
    })
}

GUI.setPage(loremIpsumPage, 0, "Lorem Ipsum")
GUI.setPage(loremIpsumOverflowedPage, 3, "Lorem Ipsum Overflowed")
GUI.setPage(new PageBuilder(), 2, "Page 3")

console.log("Done")