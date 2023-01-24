import { ConsoleManager, Progress, ConfirmPopup } from "../dist/esm/ConsoleGui.mjs"

const opt = {
    title: "Increment Progress Bar",
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

const progressBarStyle = {
    background: "bgBlack",
    borderColor: "yellow",
    color: "magenta",
    boxed: true,
    showTitle: true,
    showValue: true,
    showPercentage: true,
    showMinMax: true
}
const progressDefault = new Progress("default", 25, 2, 1, 1, progressBarStyle, "precision", "horizontal", true, true)
progressDefault.setText("Increment by 1 (default)")
progressDefault.on("valueChanged", (value) => {
    console.log(`defaultInc: Value changed: ${value}`)
})

const pWithCustomIncrement = new Progress("inc", 25, 2, 1, 6, progressBarStyle, "precision", "horizontal", true, true)
const incrementValue = 20
pWithCustomIncrement.setIncrement(incrementValue)
pWithCustomIncrement.setText(`Increment by: ${incrementValue}`)

progressDefault.on("valueChanged", (value) => {
    console.log(`customInc: Value changed: ${value}`)
})

GUI.refresh()
