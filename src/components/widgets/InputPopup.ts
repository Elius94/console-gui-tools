import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"
import { boxChars, PhisicalValues } from "../Utils.js"

/**
 * @class InputPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a text or numeric input. 
 * 
 * ![InputPopup](https://user-images.githubusercontent.com/14907987/165752281-e836b862-a54a-48d5-b4e7-954374d6509f.gif)
 * 
 * Emits the following events: 
 * - "confirm" when the user confirm the input
 * - "cancel" when the user cancel the input
 * - "exit" when the user exit the input
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {string | number} value - The value of the input.
 * @param {boolean} numeric - If the input is numeric.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 * 
 * @example const popup = new InputPopup("popup1", "Choose the number", selectedNumber, true).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm
 */
export class InputPopup extends EventEmitter {
    CM: ConsoleManager
    id: string
    title: string
    value: string | number
    numeric: boolean
    visible: boolean
    marginTop: number
    parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    offsetY: number
    private absoluteValues: PhisicalValues
    dragging = false
    dragStart: { x: number, y: number } = { x: 0, y: 0 }
    focused = false

    public constructor(id: string, title: string, value: string | number, numeric: boolean, visible = false) {
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.value = value
        this.numeric = numeric
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
            const message = `InputPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerPopup(this)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is numeric and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof InputPopup
     */
    public keyListnerNumeric(_str: string, key: KeyListenerArgs): void {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        let v = Number(this.value)
        if (Number.isNaN(v)) {
            v = 0
        }
        if (!Number.isNaN(Number(key.name))) {
            if (v.toString().length < 20) {
                let tmp = this.value.toString()
                tmp += key.name
                this.value = Number(tmp)
            }
            // To change the sign I check for the keys "+" and "-"
        } else if (key.sequence === "-") {
            this.value = v * -1
        } else if (key.sequence === "+") {
            this.value = Math.abs(v)
        } else if (key.sequence === "." || key.sequence === ",") {
            if (this.value.toString().indexOf(".") === -1) {
                this.value = v + "."
            }
        } else {
            switch (key.name) {
            case "backspace":
                // If backspace is pressed I remove the last character from the typed value
                if (this.value.toString().length > 0) {
                    if (this.value.toString().indexOf(".") === this.value.toString().length - 1) {
                        this.value = v.toString()
                    } else if (this.value.toString().indexOf(".") === this.value.toString().length - 2) {
                        this.value = this.value.toString().slice(0, this.value.toString().length - 1)
                    } else {
                        this.value = Number(v.toString().slice(0, v.toString().length - 1))
                    }
                }
                break
            case "return":
                {
                    this.emit("confirm", Number(this.value))
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
        }
        this.CM.refresh()
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof InputPopup
     */
    public keyListnerText(_str: string, key: KeyListenerArgs): void {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        const v = this.value
        if (v.toString().length < 20) {
            let tmp = v.toString()
            tmp += key.name
            this.value = tmp
        }
        switch (key.name) {
        case "backspace":
            // If backspace is pressed I remove the last character from the typed value
            if (v.toString().length > 0) {
                this.value = v.toString().slice(0, v.toString().length - 1)
            }
            break
        case "return":
            {
                this.emit("confirm", this.value)
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
     * @description This function is used to get the value of the input.
     * @returns {string | number} The value of the input.
     * @memberof InputPopup
     */
    public getValue(): string | number {
        return this.value
    }

    /**
     * @description This function is used to change the value of the input. It also refresh the ConsoleManager.
     * @param {string | number} newValue - The new value of the input.
     * @memberof InputPopup
     * @returns {InputPopup} The instance of the InputPopup.
     */
    public setValue(newValue: string | number): this {
        this.value = newValue
        this.CM.refresh()
        return this
    }

    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    public show(): InputPopup {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    public hide(): InputPopup {
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
     * @memberof InputPopup
     */
    public isVisible(): boolean {
        return this.visible
    }

    
    /**
     * @description This function is used to return the PhisicalValues of the popup (x, y, width, height).
     * @memberof InputPopup
     * @private
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    public getPosition(): PhisicalValues {
        return this.absoluteValues
    }

    /**
     * @description This function is used to add the InputPopup key listener callback to te ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    private manageInput(): InputPopup {
        // Add a command input listener to change mode
        if (this.numeric) {
            this.CM.setKeyListener(this.id, this.keyListnerNumeric.bind(this))
        } else {
            this.CM.setKeyListener(this.id, this.keyListnerText.bind(this))
        }
        if (this.CM.mouse) this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the InputPopup key listener callback to te ConsoleManager.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    private unManageInput(): InputPopup {
        // Add a command input listener to change mode
        if (this.numeric) {
            this.CM.removeKeyListener(this.id/*, this.keyListnerNumeric.bind(this)*/)
        } else {
            this.CM.removeKeyListener(this.id/*, this.keyListnerText.bind(this)*/)
        }
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
            if (event.name === "MOUSE_WHEEL_DOWN") {
                if (this.numeric) {
                    this.value = Number(this.value) - 1
                    this.CM.refresh()
                }
                this.focused = true
            } else if (event.name === "MOUSE_WHEEL_UP") {
                if (this.numeric) {
                    this.value = Number(this.value) + 1
                    this.CM.refresh()
                }
                this.focused = true
            } else if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                // find the selected index of the click and set it as selected
                this.focused = true
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
     * @description This function is used to draw the InputPopup to the screen in the middle.
     * @returns {InputPopup} The instance of the InputPopup.
     * @memberof InputPopup
     */
    public draw(): InputPopup {
        const offset = 2
        const windowWidth = this.title.length > this.value.toString().length ? this.title.length + (2 * offset) : this.value.toString().length + (2 * offset) + 1
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)
        let header = boxChars["normal"].topLeft
        for (let i = 0; i < windowWidth; i++) {
            header += boxChars["normal"].horizontal
        }
        header += `${boxChars["normal"].topRight}\n`
        header += `${boxChars["normal"].vertical}${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}${boxChars["normal"].vertical}\n`
        header += `${boxChars["normal"].left}${boxChars["normal"].horizontal.repeat(windowWidth)}${boxChars["normal"].right}\n`

        let footer = boxChars["normal"].bottomLeft
        for (let i = 0; i < windowWidth; i++) {
            footer += boxChars["normal"].horizontal
        }
        footer += `${boxChars["normal"].bottomRight}\n`

        let content = ""
        // Draw an input field
        content += `${boxChars["normal"].vertical}${"> "}${this.value}█${" ".repeat(windowWidth - this.value.toString().length - 3)}${boxChars["normal"].vertical}\n`

        const windowDesign = `${header}${content}${footer}`
        const windowDesignLines = windowDesign.split("\n")
        const centerScreen = Math.round((this.CM.Screen.width / 2) - (windowWidth / 2))
        windowDesign.split("\n").forEach((line, index) => {
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

export default InputPopup