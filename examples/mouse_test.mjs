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
        new ConfirmPopup({
            id: "popupQuit", 
            title: "Are you sure you want to quit?"
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

const style1 = {
    borderColor: "red",
    color: "red",
}

const btnProps = {
    id: "btnClickMe", 
    text: "Click Me! (Ctrl+R)", 
    x: 10, 
    y: 15, 
    style: style1,
    key: { name: "r", ctrl: true },
}

const button = new Button(btnProps)
button.on("click", () => {
    button.absoluteValues.x = Math.floor(Math.random() * 30)
    button.absoluteValues.y = Math.floor(Math.random() * 30)
    GUI.refresh()
})

GUI.refresh()