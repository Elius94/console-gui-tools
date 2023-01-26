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

GUI.refresh()


const mem = new Progress({
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
