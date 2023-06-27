import { ConsoleManager, Button, ConfirmPopup, OptionPopup } from "../dist/esm/ConsoleGui.mjs"


const opt = {
    title: "Popup Test",
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
    borderColor: "green",
    color: "green",
}

const btnProps = {
    id: "btnOpen", 
    text: "Open a popup", 
    x: 10, 
    y: 15, 
    style: style1,
}

const button = new Button(btnProps)
button.on("click", () => {
    new OptionPopup({
        id: "testPopup",
        title: "Choose an option",
        options: [1, "string", 3],
        selected: "",
    }).show()
    GUI.refresh()
})

GUI.refresh()