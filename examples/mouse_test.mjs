import { ConsoleManager, Button } from "../dist/ConsoleGui.js"


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
    process.exit()
})

const style1 = {
    borderColor: "red",
    color: "red",
}

const button = new Button("btnClickMe", "Click Me!", 11, 3, 10, 10, style1)
button.on("click", () => {
    button.absoluteValues.x = Math.floor(Math.random() * 30)
    button.absoluteValues.y = Math.floor(Math.random() * 30)
    GUI.refresh()
})

GUI.refresh()