import { EventEmitter } from "events"
import { ConsoleManager } from "../../ConsoleGui.js"

/**
 * @class ButtonPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with That asks for a confirm. 
 * Emits the following events: 
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {string} message - The message of the popup.
 * @param {Array<string>} buttons - The buttons of the popup (default is ["Yes", "No"]).
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 * 
 * @example const popup = new ButtonPopup("popup1", "Choose the option", ["YES", "NO", "?"]).show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
 */
export class ButtonPopup extends EventEmitter {
    constructor(id, title = "Confirm?", message = "", buttons = ["Ok", "Cancel", "?"], visible = false) {
        super()
            /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.message = message
        this.buttons = buttons
        this.selected = 0 // The selected option
        this.visible = visible
        this.marginTop = 4
        this.startIndex = 0
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this)
            const message = `ButtonPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerWiget(this)
    }

    boxChars = {
        normal: {
            topLeft: "┌",
            topRight: "┐",
            bottomLeft: "└",
            bottomRight: "┘",
            horizontal: "─",
            vertical: "│"
        },
        selected: {
            topLeft: "╔",
            topRight: "╗",
            bottomLeft: "╚",
            bottomRight: "╝",
            horizontal: "═",
            vertical: "║"
        }
    }

    /**
     * @function keyListner(str, key)
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof ButtonPopup
     */
    keyListner(str, key) {
        switch (key.name) {
            case 'left':
                if (this.selected > 0 && this.selected <= this.buttons.length) {
                    this.selected--
                } else {
                    return
                }
                break
            case 'right':
                if (this.selected >= 0 && this.selected < this.buttons.length - 1) {
                    this.selected++
                } else {
                    return
                }
                break
            case 'return':
                {
                    this.emit(`confirm`, this.buttons[this.selected])
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            case 'escape':
                {
                    this.emit(`cancel`)
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            case 'q':
                {
                    this.CM.emit('exit')
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            default:
                break
        }
        this.CM.refresh()
    }

    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    show() {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    hide() {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof ButtonPopup
     */
    isVisible() {
        return this.visible
    }

    /**
     * @description This function is used to add the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    manageInput() {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListner.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    unManageInput() {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id)
        return this
    }

    /**
     * @description This function is used to draw the ButtonPopup to the screen in the middle.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    draw() {
        const offset = 1
        const borderSize = 2
        const spaceBetweenButtons = 1
        let maxRowLength = 0
        let buttonGrid = []
        let rowLength = 0
        let rows = 0

        this.buttons.forEach((button, index) => {
            const newButtonLength = button.length + (2 * borderSize) + spaceBetweenButtons
                // Divide into rows and columns the buttons (balance the buttons number between rows and columns)
            if (rowLength + newButtonLength > this.CM.Screen.width - (2 * offset)) {
                rows++
                if (buttonGrid[rows]) {
                    buttonGrid[rows].push(button)
                } else {
                    buttonGrid[rows] = [button]
                }
                rowLength = newButtonLength
                if (rowLength > maxRowLength) {
                    maxRowLength = rowLength - spaceBetweenButtons
                }
            } else {
                if (buttonGrid[rows]) {
                    buttonGrid[rows].push(button)
                } else {
                    buttonGrid[rows] = [button]
                }
                rowLength += newButtonLength
                if (rowLength > maxRowLength) {
                    maxRowLength = rowLength - spaceBetweenButtons
                }
            }
        })
        let title = `${this.title}`
        if (title.length > this.CM.Screen.width - (2 * offset)) {
            title = this.CM.truncate(title, this.CM.Screen.width - (2 * offset), true)
        }
        let msg = this.message ? `${this.message}` : ''
        if (msg.length > this.CM.Screen.width - (2 * offset)) {
            msg = this.CM.truncate(msg, this.CM.Screen.width - (2 * offset), true)
        }
        let windowWidth = title.length + (2 * offset)
        if (windowWidth < msg.length) {
            windowWidth = msg.length + (2 * offset)
        }
        if (windowWidth < maxRowLength) {
            windowWidth = maxRowLength + (2 * offset)
        }
        const halfWidthTitle = Math.round((windowWidth - title.length) / 2)
        const halfWidthMessage = Math.round((windowWidth - msg.length) / 2)

        let header = "┌"
        for (let i = 0; i < windowWidth; i++) {
            header += "─"
        }
        header += "┐\n"
        header += `│${" ".repeat(halfWidthTitle)}${title}${" ".repeat(windowWidth - halfWidthTitle - title.length)}│\n`
        header += "├" + "─".repeat(windowWidth) + "┤\n"

        let footer = "└"
        for (let i = 0; i < windowWidth; i++) {
            footer += "─"
        }
        footer += "┘\n"

        let content = ""
        if (msg !== "") {
            content += `│${" ".repeat(halfWidthMessage)}${msg}${" ".repeat(windowWidth - halfWidthMessage - msg.length)}│\n`
        }
        buttonGrid.forEach((row) => {
            for (let k = 0; k < 3; k++) {
                const buttonLength = row.map(button => button.length + (2 * borderSize) + spaceBetweenButtons)
                const sumRowLength = buttonLength.reduce((a, b) => a + b, 0) - spaceBetweenButtons
                const emptySpace = windowWidth - sumRowLength >= 0 ? windowWidth - sumRowLength : 0
                row.forEach((button, colIndex) => {
                    const btnBoxType = this.selected === this.buttons.indexOf(button) ? "selected" : "normal"
                    if (colIndex < row.length) {
                        if (colIndex === 0) {
                            content += `│${" ".repeat(emptySpace / 2)}`
                        }
                        if (k === 0) {
                            content += `${this.boxChars[btnBoxType].topLeft}${this.boxChars[btnBoxType].horizontal.repeat(borderSize > 1 ? 2 * (borderSize - 1) + button.length : button.length)}${this.boxChars[btnBoxType].topRight}`
                        } else if (k === 1) {
                            content += `${this.boxChars[btnBoxType].vertical}${borderSize > 1 ? " ".repeat(borderSize-1):""}${button}${borderSize > 1 ? " ".repeat(borderSize-1):""}${this.boxChars[btnBoxType].vertical}`
                        } else if (k === 2) {
                            content += `${this.boxChars[btnBoxType].bottomLeft}${this.boxChars[btnBoxType].horizontal.repeat(borderSize > 1 ? 2 * (borderSize - 1) + button.length : button.length)}${this.boxChars[btnBoxType].bottomRight}`
                        } else {
                            this.CM.error("Error in ButtonPopup draw function")
                        }
                        if (colIndex === row.length - 1) {
                            content += " ".repeat(emptySpace / 2) + "│\n"
                        } else {
                            content += " ".repeat(spaceBetweenButtons)
                        }
                    } else if (colIndex === row.length) {
                        content += " ".repeat(emptySpace / 2) + "│\n"
                    }
                })
            }
        })



        const windowDesign = `${header}${content}${footer}`
        windowDesign.split('\n').forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)), this.marginTop + index)
            this.CM.Screen.write({ text: line, style: { color: 'white' } })
        })
        return this
    }
}

export default ButtonPopup