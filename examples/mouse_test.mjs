import { ConsoleManager, Button } from "../dist/ConsoleGui.js"


const opt = {
    title: "Click the button",
    layoutOptions: {
        type: "single",
    },
    logLocation: "popup",
    enableMouse: false
}

const GUI = new ConsoleManager(opt)

GUI.on("keypressed", (key) => {
    console.log("Key pressed: " + key)
})

const style1 = {
    borderColor: "red",
    color: "red",
}

/*const button = new Button("btnClickMe", "Click Me!", 11, 3, 10, 10, style1)
button.on("click", () => {
    const winSize = { w: GUI.Terminal.width, h: GUI.Terminal.height }
    button.absoluteValues.x = Math.floor(Math.random() * winSize.w)
    button.absoluteValues.y = Math.floor(Math.random() * winSize.h)
})*/

GUI.refresh()