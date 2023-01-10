import { ConsoleManager, Button, ConfirmPopup } from "../dist/esm/ConsoleGui.mjs"


const opt = {
    title: "Click the button",
    layoutOptions: {
        type: "single",
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
        new ConfirmPopup("popupQuit", "Are you sure you want to quit?").show().on("confirm", () => closeApp())
        break
    default:
        break
    }
})

const closeApp = () => {
    console.clear()
    process.exit()
}

const style1 = {
    borderColor: "red",
    color: "red",
}

const button = new Button("btnClickMe", "Click Me!", 11, 3, 10, 10, style1, { name: "r", ctrl: true })
button.on("click", () => {
    button.absoluteValues.x = Math.floor(Math.random() * 30)
    button.absoluteValues.y = Math.floor(Math.random() * 30)
    GUI.refresh()
})

GUI.refresh()