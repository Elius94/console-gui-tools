import { ConsoleManager,ConfirmPopup, Box, InPageWidgetBuilder } from "../dist/esm/ConsoleGui.mjs"

const opt = {
    title: "Progress Bar Test",
    layoutOptions: {
        type: "single"
    },
    logLocation: "popup",
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

const b = new Box({
    id: "box",
    x: 2,
    y: 3,
    width: 17,
    height: 4,
    style: {
        boxed: true,
    }
})

const content = new InPageWidgetBuilder()

content.addRow({
    text: "Hello World!",
    color: "rgb(255,0,0)",
    bg: "rgb(0,0,255)",
})

content.addRow({
    text: "Testing Box!",
    color: "blue",
})

content.addRow({
    text: "Third Row",
    color: "cyan",
})


b.setContent(content)

new Box({
    id: "box1",
    x: 22,
    y: 3,
    width: 28,
    height: 3,
    draggable: true,
    style: {
        boxed: true,
    }
}).setContent(new InPageWidgetBuilder().addRow({ text: "This is a draggable Box!", color: "rgb(255,0,0)", bg: "rgb(0,0,255)"}))
