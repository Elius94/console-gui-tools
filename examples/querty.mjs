import { ConsoleManager, Progress, ConfirmPopup, Button } from "../dist/esm/ConsoleGui.mjs"

const opt = {
    title: "QWERTY Keyboard",
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

GUI.refresh()

// Definizione della posizione di ciascun tasto della tastiera QWERTY
const keys = [
    { label: "Q", x: 2, y: 2 }, { label: "W", x: 7, y: 2 }, { label: "E", x: 12, y: 2 }, { label: "R", x: 17, y: 2 },
    { label: "T", x: 22, y: 2 }, { label: "Y", x: 27, y: 2 }, { label: "U", x: 32, y: 2 }, { label: "I", x: 37, y: 2 },
    { label: "O", x: 42, y: 2 }, { label: "P", x: 47, y: 2 },

    { label: "A", x: 3, y: 5 }, { label: "S", x: 8, y: 5 }, { label: "D", x: 13, y: 5 }, { label: "F", x: 18, y: 5 },
    { label: "G", x: 23, y: 5 }, { label: "H", x: 28, y: 5 }, { label: "J", x: 33, y: 5 }, { label: "K", x: 38, y: 5 },
    { label: "L", x: 43, y: 5 },

    { label: "Z", x: 4, y: 8 }, { label: "X", x: 9, y: 8 }, { label: "C", x: 14, y: 8 }, { label: "V", x: 19, y: 8 },
    { label: "B", x: 24, y: 8 }, { label: "N", x: 29, y: 8 }, { label: "M", x: 34, y: 8 }
]

const style1 = {
    borderColor: "red",
    color: "red",
}

const keyBars = keys.map(key => new Button({
    id: key.label,
    x: key.x,
    y: key.y,
    length: 3,
    text: key.label,
    key: { name: key.label.toLowerCase(), ctrl: false },
    style: style1
}))

