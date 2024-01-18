import { ConsoleManager,ConfirmPopup, Box, InPageWidgetBuilder, InputPopup } from "../dist/esm/ConsoleGui.mjs"

const opt = {
    title: "Input Popup Test",
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

let nValue = 0
let sValue = ""

GUI.on("keypressed", (key) => {
    switch (key.name) {
    case "q":
        new ConfirmPopup({
            id: "popupQuit", title: "Are you sure you want to quit?"
        }).show().on("confirm", () => closeApp())
        break
    case "n":
        new InputPopup({
            id: "popupInput",
            title: "Enter a number:",
            value: nValue,
            maxLen: 3,
            numeric: true
        }).show().on("confirm", (value) => {
            console.log(`You entered: ${value}`)
            nValue = value
            refresh()
        })
        break
    case "s":
        new InputPopup({
            id: "popupInput",
            title: "Enter a string:",
            placeholder: "Write here...",
            value: sValue,
            numeric: false
        }).show().on("confirm", (value) => {
            console.log(`You entered: ${value}`)
            sValue = value
            refresh()
        })
        break
    default:
        break
    }
})

const closeApp = () => {
    console.clear()
    process.exit()
}

const b = new Box({
    id: "box",
    x: 2,
    y: 3,
    width: 45,
    height: 4,
    style: {
        boxed: true,
    }
})

const content = new InPageWidgetBuilder()

content.addRow({
    text: "Press 'n' to open a Numeric Input Popup",
    color: "rgb(255,0,0)",
    bg: "rgb(0,0,255)",
})

content.addRow({
    text: "Press 's' to open a String Input Popup",
    color: "blue",
})

b.setContent(content)

const b1 = new Box({
    id: "box1",
    x: 2,
    y: 7,
    width: 45,
    height: 4,
    style: {
        boxed: true,
    }
})


const refresh = () => {
    const content1 = new InPageWidgetBuilder()
    content1.clear()
    content1.addRow({
        text: `Numeric value: ${nValue}`,
        color: "rgb(255,0,0)",
        bg: "rgb(0,0,255)",
    })
    content1.addRow({
        text: `String value: ${sValue}`,
        color: "blue",
    })
    b1.setContent(content1)
    GUI.refresh()
}
