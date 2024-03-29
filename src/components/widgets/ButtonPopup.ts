import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs, EOL } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"
import { boxChars, PhisicalValues, truncate } from "../Utils.js"

/**
 * @description The configuration for the ButtonPopup class.
 * @typedef {Object} ButtonPopupConfig
 * 
 * @prop {string} id - The id of the popup.
 * @prop {string} title - The title of the popup.
 * @prop {string} message - The message of the popup.
 * @prop {Array<string>} [buttons] - The buttons of the popup (default is ["Ok", "Cancel", "?"]).
 * @prop {boolean} [visible] - If the popup is visible. Default is false (make it appears using show()).
 *
 * @export
 * @interface ButtonPopupConfig
 */
// @type definition
export interface ButtonPopupConfig {
    id: string,
    title: string,
    message?: string,
    buttons?: Array<string>,
    visible?: boolean,
}

/**
 * @class ButtonPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with That asks for a confirm. 
 * 
 * ![ButtonPopup](https://user-images.githubusercontent.com/14907987/165752116-b796f41a-e4fe-45db-8c90-5d97318bd17a.gif)
 * 
 * Emits the following events: 
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * @param {ButtonPopupConfig} config - The configuration of the popup.
 * 
 * @example ```ts
 * const popup = new ButtonPopup({
 *  id: "popup1", 
 *  title: "Choose the option", 
 *  buttons: ["YES", "NO", "?"],
 * }) 
 * popup.show() // show the popup
 * popup.on("confirm", () => {
 *  console.log("User confirmed")
 * })
 * popup.on("cancel", () => {
 *  console.log("User canceled")
 * })
 * ```
 */
export class ButtonPopup extends EventEmitter {
    readonly CM: ConsoleManager
    readonly id: string
    title: string
    message: string
    readonly buttons: string[]
    selected: number
    private hovered: number
    private visible: boolean
    private marginTop: number
    parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetY: number
    private absoluteValues: PhisicalValues
    private buttonsAbsoluteValues: PhisicalValues[] = []
    private dragging = false
    private dragStart: { x: number, y: number } = { x: 0, y: 0 }
    private focused = false

    public constructor(config: ButtonPopupConfig) {
        if (!config) throw new Error("The config is required")
        const { id, title, message, buttons = ["Ok", "Cancel", "?"], visible = false } = config
        if (!id) throw new Error("The id is required")
        if (!title) throw new Error("The title is required")
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.message = message || ""
        this.buttons = buttons
        this.selected = 0 // The selected option
        this.hovered = -1 // The selected option
        this.visible = visible
        this.marginTop = 4
        this.offsetX = 0
        this.offsetY = 0
        this.absoluteValues = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        }
        if (this.CM.popupCollection[this.id]) {
            this.CM.unregisterPopup(this)
            const message = `ButtonPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerPopup(this)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {any} key - The key object.
     * @memberof ButtonPopup
     */
    public keyListener(_str: string, key : KeyListenerArgs): void {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        switch (key.name) {
        case "left":
            if (this.selected > 0 && this.selected <= this.buttons.length) {
                this.selected--
            } else {
                return
            }
            break
        case "right":
            if (this.selected >= 0 && this.selected < this.buttons.length - 1) {
                this.selected++
            } else {
                return
            }
            break
        case "return":
            {
                this.emit("confirm", this.buttons[this.selected])
                this.CM.unregisterPopup(this)
                this.hide()
                //delete this
            }
            break
        case "escape":
            {
                this.emit("cancel")
                this.CM.unregisterPopup(this)
                this.hide()
                //delete this
            }
            break
        case "q":
            {
                this.CM.emit("exit")
                this.CM.unregisterPopup(this)
                this.hide()
                //delete this
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
    public show(): ButtonPopup {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
            this.CM.unfocusOtherWidgets(this.id)
        }
        return this
    }

    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    public hide(): ButtonPopup {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.restoreFocusInWidgets()
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof ButtonPopup
     */
    public isVisible(): boolean {
        return this.visible
    }

    /**
     * @description This function is used to return the PhisicalValues of the popup (x, y, width, height).
     * @memberof ButtonPopup
     * @private
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    public getPosition(): PhisicalValues {
        return this.absoluteValues
    }

    /**
     * @description This function is used to add the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    private manageInput(): ButtonPopup {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListener.bind(this))
        if (this.CM.mouse) this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    private unManageInput(): ButtonPopup {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id)
        if (this.CM.mouse) this.CM.removeMouseListener(`${this.id}_mouse`)
        return this
    }

    /**
     * @description This function is used to manage the mouse events on the OptionPopup.
     * @param {MouseEvent} event - The string of the input.
     * @memberof OptionPopup
     */
    private mouseListener = (event: MouseEvent) => {
        const x = event.data.x
        const y = event.data.y

        //this.CM.log(event.name)
        if (x > this.absoluteValues.x && x < this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y < this.absoluteValues.y + this.absoluteValues.height) {
            // The mouse is inside the popup
            //this.CM.log("Mouse inside popup")
            if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                // find the selected button of the click using the this.buttonsAbsoluteValues array
                for (let i = 0; i < this.buttonsAbsoluteValues.length; i++) {
                    const button = this.buttonsAbsoluteValues[i]
                    if (x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height) {
                        this.selected = i
                        this.CM.refresh()
                        break
                    }
                }
                this.focused = true
                return
            }
            if (event.name === "MOUSE_LEFT_BUTTON_RELEASED") {
                if (this.focused) {
                    if (this.buttons && this.buttons.length === 2 && this.buttons[0].toLowerCase() === "yes" && this.buttons[1].toLowerCase() === "no") { // If the popup is a yes/no popup
                        if (this.selected === 0) {
                            this.emit("confirm")
                        } else {
                            this.emit("cancel")
                        }
                    } else {
                        this.emit("confirm", this.buttons[this.selected])
                    }
                    this.CM.unregisterPopup(this)
                    this.hide()
                    //delete this
                }
                return
            }
            if (event.name === "MOUSE_MOTION") {
                for (let i = 0; i < this.buttonsAbsoluteValues.length; i++) {
                    const button = this.buttonsAbsoluteValues[i]
                    if (x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height) {
                        this.hovered = i
                        this.CM.refresh()
                        break
                    }
                }
            }
        } else {
            this.focused = false
        }
        if (event.name === "MOUSE_DRAG" && event.data.left === true && this.dragging === false && this.focused) {
            // check if the mouse is on the header of the popup (first three lines)
            if (x > this.absoluteValues.x && x < this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y < this.absoluteValues.y + 3/* 3 = header height */) {
                this.dragging = true
                this.dragStart = { x: x, y: y }
            }
        } else if (event.name === "MOUSE_DRAG" && event.data.left === true && this.dragging === true) {
            if ((y - this.dragStart.y) + this.absoluteValues.y < 0) {
                return // prevent the popup to go out of the top of the screen
            }
            if ((x - this.dragStart.x) + this.absoluteValues.x < 0) {
                return // prevent the popup to go out of the left of the screen
            }
            this.offsetX += x - this.dragStart.x
            this.offsetY += y - this.dragStart.y
            this.dragStart = { x: x, y: y }
            this.CM.refresh()
        } else if (event.name === "MOUSE_LEFT_BUTTON_RELEASED" && this.dragging === true) {
            this.dragging = false
            this.CM.refresh()
        }
    }

    /**
     * @description This function is used to draw the ButtonPopup to the screen in the middle.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    public draw(): ButtonPopup {
        const offset = 1
        const borderSize = 2
        const spaceBetweenButtons = 1
        let maxRowLength = 0
        const buttonGrid: string[][] = []
        let rowLength = 0
        let rows = 0
        
        this.buttons.forEach((button) => {
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
            title = truncate(title, this.CM.Screen.width - (2 * offset), true)
        }
        let windowWidth = title.length + (2 * offset)
        const msg = this.message ? `${this.message}` : ""
        let mstLines = msg.split(EOL)
        if (mstLines.length > 0) {
            mstLines = mstLines.map((line) => {
                if (line.length > this.CM.Screen.width - (2 * offset)) {
                    return truncate(line, this.CM.Screen.width - (2 * offset), true)
                }
                return line
            })
        }
        mstLines.forEach((line) => {
            if (line.length > windowWidth) {
                windowWidth = line.length
            }
        })
        
        if (windowWidth < maxRowLength) {
            windowWidth = maxRowLength + (2 * offset)
        }
        const halfWidthTitle = Math.round((windowWidth - title.length) / 2)
        const halfWidthMessage = mstLines.map((line) => Math.round((windowWidth - line.length) / 2))
        
        let header = boxChars["normal"].topLeft
        for (let i = 0; i < windowWidth; i++) {
            header += boxChars["normal"].horizontal
        }
        header += `${boxChars["normal"].topRight}${EOL}`
        header += `${boxChars["normal"].vertical}${" ".repeat(halfWidthTitle)}${title}${" ".repeat(windowWidth - halfWidthTitle - title.length)}${boxChars["normal"].vertical}${EOL}`
        header += `${boxChars["normal"].left}${boxChars["normal"].horizontal.repeat(windowWidth)}${boxChars["normal"].right}${EOL}`
        
        let footer = boxChars["normal"].bottomLeft
        for (let i = 0; i < windowWidth; i++) {
            footer += boxChars["normal"].horizontal
        }
        footer += `${boxChars["normal"].bottomRight}${EOL}`

        let content = ""
        if (mstLines.length > 0 && mstLines[0].length > 0) {
            mstLines.forEach((line, index) => {
                content += `${boxChars["normal"].vertical}${" ".repeat(halfWidthMessage[index])}${line}${" ".repeat(windowWidth - halfWidthMessage[index] - line.length)}${boxChars["normal"].vertical}${EOL}`
            })
        }
        const buttonsYOffset = mstLines.length + 3 // 3 = header height
        this.buttonsAbsoluteValues = []
        const centerScreen = Math.round((this.CM.Screen.width / 2) - (windowWidth / 2))
        buttonGrid.forEach((row) => {
            for (let k = 0; k < 3; k++) {
                const buttonLength = row.map(button => button.length + (2 * borderSize) + spaceBetweenButtons)
                const sumRowLength = buttonLength.reduce((a, b) => a + b, 0) - spaceBetweenButtons
                const emptySpace = windowWidth - sumRowLength >= 0 ? windowWidth - sumRowLength : 0
                row.forEach((button, colIndex) => {
                    let btnBoxType: keyof typeof boxChars
                    btnBoxType = this.selected === this.buttons.indexOf(button) ? "selected" : "normal"
                    if (this.hovered === this.buttons.indexOf(button) && this.selected !== this.buttons.indexOf(button)) {
                        btnBoxType = "hovered"
                    }
                    if (colIndex < row.length) {
                        if (colIndex === 0) {
                            content += `${boxChars["normal"].vertical}${" ".repeat(emptySpace / 2)}`
                        }
                        if (k === 0) {
                            content += `${boxChars[btnBoxType].topLeft}${boxChars[btnBoxType].horizontal.repeat(borderSize > 1 ? 2 * (borderSize - 1) + button.length : button.length)}${boxChars[btnBoxType].topRight}`
                        } else if (k === 1) {
                            content += `${boxChars[btnBoxType].vertical}${borderSize > 1 ? " ".repeat(borderSize-1):""}${button}${borderSize > 1 ? " ".repeat(borderSize-1):""}${boxChars[btnBoxType].vertical}`
                        } else if (k === 2) {
                            content += `${boxChars[btnBoxType].bottomLeft}${boxChars[btnBoxType].horizontal.repeat(borderSize > 1 ? 2 * (borderSize - 1) + button.length : button.length)}${boxChars[btnBoxType].bottomRight}`
                        } else {
                            this.CM.error("Error in ButtonPopup draw function")
                        }
                        if (colIndex === row.length - 1) {
                            content += " ".repeat(!(emptySpace % 2) ? emptySpace / 2 : Math.round(emptySpace / 2)) + `${boxChars["normal"].vertical}${EOL}`
                        } else {
                            content += " ".repeat(spaceBetweenButtons)
                        }
                    } else if (colIndex === row.length) {
                        content += " ".repeat(!(emptySpace % 2) ? emptySpace / 2 : Math.round(emptySpace / 2)) + `${boxChars["normal"].vertical}${EOL}`
                    }
                    const buttonPh: PhisicalValues = {
                        id: this.buttons.indexOf(button),
                        x: centerScreen + this.offsetX + emptySpace / 2 + buttonLength.slice(0, colIndex).reduce((a, b) => a + b, 0) + 1,
                        y: this.marginTop + this.offsetY - (rows + 1) / 2 + this.buttons.indexOf(button) + buttonsYOffset,
                        width: buttonLength[colIndex] - spaceBetweenButtons + 1,
                        height: 3
                    }
                    // We have to add the real button size and place to the buttonSizes array
                    this.buttonsAbsoluteValues.push(buttonPh)
                })
            }
        })

        const windowDesign = `${header}${content}${footer}`
        const windowDesignLines = windowDesign.split(EOL)
        windowDesignLines.forEach((line, index) => {
            this.CM.Screen.cursorTo(centerScreen + this.offsetX, this.marginTop + index + this.offsetY)
            this.CM.Screen.write({ text: line, style: { color: "white" } })
        })
        this.absoluteValues = {
            x: centerScreen + this.offsetX,
            y: this.marginTop + this.offsetY,
            width: windowWidth,
            height: windowDesignLines.length,
        }
        return this
    }
}

export default ButtonPopup