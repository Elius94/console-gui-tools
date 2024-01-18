import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs, EOL } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"
import { boxChars, PhisicalValues, visibleLength } from "../Utils.js"

/**
 * @description The configuration for the InputPopup class.
 * @typedef {Object} InputPopupConfig
 *
 * @prop {string} id - The id of the popup.
 * @prop {string} title - The title of the popup.
 * @prop {string | number} value - The value of the popup.
 * @prop {boolean} numeric - If the input is numeric.
 * @prop {boolean} [visible] - If the popup is visible.
 * @prop {string} [placeholder] - Optional placeholder to show if empty
 * @prop {number} [maxLen] - Optional max length of the input (default 20). Set to 0 for no limit (not recommended). Since v3.4.0
 *
 * @export
 * @interface InputPopupConfig
 */
// @type definition
export interface InputPopupConfig {
    id: string;
    title: string;
    value: string | number;
    numeric?: boolean;
    visible?: boolean;
    placeholder?: string;
    maxLen?: number;
}

/**
 * @class InputPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a text or numeric input.
 *
 * ![InputPopup](https://github.com/Elius94/console-gui-tools/assets/14907987/eecac72f-9ccc-444b-a0e3-2b7e277fdeea)
 *
 * Emits the following events:
 * - "confirm" when the user confirm the input
 * - "cancel" when the user cancel the input
 * - "exit" when the user exit the input
 * @param {InputPopupConfig} config - The config of the popup.
 *
 * @example ```ts
 * const popup = new InputPopup({
 *  id: "popup1",
 *  title: "Choose the number",
 *  value: selectedNumber,
 *  numeric: true
 * }).show().on("confirm", (value) => { console.log(value) }) // show the popup and wait for the user to confirm
 * ```
 */
export class InputPopup extends EventEmitter {
    readonly CM: ConsoleManager
    readonly id: string
    title: string
    value: string | number
    // Position of the cursor. 0-indexed (0 = before all the text)
    /** @var {number} cursorPos - Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr) */
    cursorPos: number
    /** @var {setInterval} flashLoop - Since v3.1.0 a blinking cursor has been added to InputPopup (thanks @Compositr) */
    flashLoop = setInterval(() => {
        this.draw(); this.CM.refresh()
    }, 500)
    private numeric: boolean
    private visible: boolean
    private marginTop: number
    private parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetY: number
    private absoluteValues: PhisicalValues
    private dragging = false
    private dragStart: { x: number; y: number } = { x: 0, y: 0 }
    private focused = false
    private placeholder?: string
    private maxLen: number

    public constructor(config: InputPopupConfig) {
        if (!config) throw new Error("InputPopup config is required")
        const { id, title, value, numeric, visible = false } = config
        if (!id) throw new Error("InputPopup id is required")
        if (!title) throw new Error("InputPopup title is required")
        if (value === undefined) throw new Error("InputPopup value is required")
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.value = value
        this.cursorPos = 0
        this.numeric = numeric || false
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
        this.placeholder = config.placeholder
        this.maxLen = config.maxLen || 20
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
    public keyListenerNumeric(_str: string, key: KeyListenerArgs): void {
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
            if (v.toString().length < this.maxLen || this.maxLen === 0) { // if maxLen is 0 there is no limit
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
                        if (
                            this.value.toString().indexOf(".") ===
                            this.value.toString().length - 1
                        ) {
                            this.value = v.toString()
                        } else if (
                            this.value.toString().indexOf(".") ===
                            this.value.toString().length - 2
                        ) {
                            this.value = this.value
                                .toString()
                                .slice(0, this.value.toString().length - 1)
                        } else if (
                            this.value.toString().indexOf("-") === 0 &&
                            this.value.toString().length === 2
                        ) {
                            this.value = 0
                        } else {
                            this.value = Number(
                                v.toString().slice(0, v.toString().length - 1)
                            )
                        }
                    }
                    break
                case "return":
                    {
                        this.confirmDel()
                    }
                    break
                case "escape":
                    {
                        this.delete()
                    }
                    break
                case "q":
                    {
                        this.delete()
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
    public keyListenerText(_str: string, key: KeyListenerArgs): void {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        const v = this.value
        switch (key.name) {
            case "backspace":
                // If backspace is pressed I remove the last character from the typed value
                if (v.toString().length > 0) {
                    this.value = v.toString().slice(0, v.toString().length - 1)
                }
                break
            case "return":
                {
                    this.confirmDel()
                }
                break
            case "escape":
                {
                    this.delete()
                }
                break
            case "q":
                {
                    this.delete()
                }
                break
            case "delete":
                {
                    // no-op for now
                }
                break
            case "tab":
                {
                    // Add two spaces
                    this.value = v.toString() + "  "
                }
                break

            default:
                if ((visibleLength(v.toString()) < this.maxLen || this.maxLen === 0) && key.sequence.length === 1) {
                    let tmp = v.toString()
                    tmp += key.sequence
                    this.value = tmp
                }
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
            this.CM.unfocusOtherWidgets(this.id)
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
            this.CM.restoreFocusInWidgets()
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
            this.CM.setKeyListener(this.id, this.keyListenerNumeric.bind(this))
        } else {
            this.CM.setKeyListener(this.id, this.keyListenerText.bind(this))
        }
        if (this.CM.mouse)
            this.CM.setMouseListener(
                `${this.id}_mouse`,
                this.mouseListener.bind(this)
            )
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
            this.CM.removeKeyListener(
                this.id /*, this.keyListenerNumeric.bind(this)*/
            )
        } else {
            this.CM.removeKeyListener(this.id /*, this.keyListenerText.bind(this)*/)
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
        if (x > this.absoluteValues.x &&
            x < this.absoluteValues.x + this.absoluteValues.width &&
            y > this.absoluteValues.y &&
            y < this.absoluteValues.y + this.absoluteValues.height) {
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
        if (
            event.name === "MOUSE_DRAG" &&
            event.data.left === true &&
            this.dragging === false &&
            this.focused
        ) {
            // check if the mouse is on the header of the popup (first three lines)
            if (x > this.absoluteValues.x &&
                x < this.absoluteValues.x + this.absoluteValues.width &&
                y > this.absoluteValues.y &&
                y < this.absoluteValues.y + 3 /* 3 = header height */) {
                this.dragging = true
                this.dragStart = { x: x, y: y }
            }
        } else if (event.name === "MOUSE_DRAG" &&
            event.data.left === true &&
            this.dragging === true) {
            if (y - this.dragStart.y + this.absoluteValues.y < 0) {
                return // prevent the popup to go out of the top of the screen
            }
            if (x - this.dragStart.x + this.absoluteValues.x < 0) {
                return // prevent the popup to go out of the left of the screen
            }
            this.offsetX += x - this.dragStart.x
            this.offsetY += y - this.dragStart.y
            this.dragStart = { x: x, y: y }
            this.CM.refresh()
        } else if (
            event.name === "MOUSE_LEFT_BUTTON_RELEASED" &&
            this.dragging === true
        ) {
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
        const windowWidth =
            this.title.length > this.value.toString().length
                ? this.title.length + 2 * offset
                : this.value.toString().length + 2 * offset + 1
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)
        let header = boxChars["normal"].topLeft
        for (let i = 0; i < windowWidth; i++) {
            header += boxChars["normal"].horizontal
        }
        header += `${boxChars["normal"].topRight}${EOL}`
        header += `${boxChars["normal"].vertical}${" ".repeat(halfWidth)}${this.title
            }${" ".repeat(windowWidth - halfWidth - this.title.length)}${boxChars["normal"].vertical
            }${EOL}`
        header += `${boxChars["normal"].left}${boxChars["normal"].horizontal.repeat(
            windowWidth
        )}${boxChars["normal"].right}${EOL}`

        let footer = boxChars["normal"].bottomLeft
        for (let i = 0; i < windowWidth; i++) {
            footer += boxChars["normal"].horizontal
        }
        footer += `${boxChars["normal"].bottomRight}${EOL}`

        const windowDesign = `${header}${footer}`
        const windowDesignLines = windowDesign.split(EOL)
        const centerScreen = Math.round(this.CM.Screen.width / 2 - windowWidth / 2)
        windowDesign.split(EOL).forEach((line, index) => {
            this.CM.Screen.cursorTo(
                centerScreen + this.offsetX,
                this.marginTop + index + this.offsetY
            )
            
            if (index === 3) {
                const isOddSecond = Math.round(Date.now() / 100) % 2
                if (this.placeholder && this.placeholder.length && this.value.toString().length === 0) {
                    const totalLength = 2 + this.placeholder.length + 1; // 2 for "> ", 1 for cursor
                    this.CM.Screen.write(
                        { text: boxChars["normal"].vertical, style: { color: "white" } },
                        { text: "> ", style: { color: "cyan" } },
                        { text: isOddSecond ? "█" : " ", style: { color: "white" } },
                        { text: this.placeholder, style: { color: "gray" } },
                        { text: `${" ".repeat(windowWidth - totalLength)}${boxChars["normal"].vertical}`, style: { color: "white" } })
                } else {
                    const totalLength = 2 + this.value.toString().length + 1; // 2 for "> ", 1 for cursor
                    this.CM.Screen.write(
                        { text: boxChars["normal"].vertical, style: { color: "white" } },
                        { text: "> ", style: { color: "cyan" } },
                        { text: this.value.toString(), style: { color: "white" } },
                        { text: isOddSecond ? "█" : " ", style: { color: "white" } },
                        { text: `${" ".repeat(windowWidth - totalLength)}${boxChars["normal"].vertical}`, style: { color: "white" } })
                }
                this.CM.Screen.cursorTo(
                    centerScreen + this.offsetX,
                    this.marginTop + index + 1 + this.offsetY
                )
            }
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

    confirmDel() {
        this.emit("confirm", this.numeric ? Number(this.value) : this.value)
        this.delete()
    }

    delete() {
        this.CM.unregisterPopup(this)
        this.hide()
        clearInterval(this.flashLoop)
    }
}

export default InputPopup
