import { ConsoleManager, Progress, ConfirmPopup } from "../dist/esm/ConsoleGui.mjs"

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

const p1 = new Progress({
    id: "htop-mem",
    x: 2,
    y: 1,
    label: "Mem",
    length: 40,
    min: 0,
    max: 100,
    unit: "G",
    style: {
        boxed: true,
        theme: "htop",
        showMinMax: false,
    }
})

setInterval(() => {
    p1.setValue(Math.floor(Math.random() * 100))
}, 400)

new Progress({
    id: "interactive",
    x: 2,
    y: 3,
    length: 40,
    thickness: 3,
    label: "Interactive Progress (use scroll wheel)",
    min: 0,
    max: 100,
    value: 50,
    interactive: true,
    increment: 1,
    style: {
        boxed: true,
        theme: "precision",
        color: "green",
        showMinMax: true,
    }
})

const p2 = new Progress({
    id: "vertical",
    x: 2,
    y: 6,
    label: "Vertical Progress",
    length: 20,
    min: 0,
    max: 100,
    unit: "%",
    orientation: "vertical",
    style: {
        boxed: true,
        theme: "precision",
        showMinMax: false,
        showLabel: true,
    }
})

setInterval(() => {
    p2.setValue(Math.floor(Math.random() * 100))
}, 400)


