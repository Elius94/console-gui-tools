import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs, EOL } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"
import { boxChars, PhisicalValues } from "../Utils.js"

/**
 * @description The configuration for the OptionPopup class.
 * @typedef {Object} OptionPopupConfig
 * 
 * @prop {string} id - The id of the popup.
 * @prop {string} title - The title of the popup.
 * @prop {Array<string | number>} options - The options of the popup.
 * @prop {string | number} selected - The selected option of the popup.
 * @prop {boolean} [visible] - If the popup is visible.
 *
 * @export
 * @interface OptionPopupConfig
 */
// @type definition
export interface OptionPopupConfig {
    id: string
    title: string
    options: Array<string | number>
    selected: string | number
    visible?: boolean
}

/**
 * @class OptionPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a list of selectable options. 
 * 
 * ![OptionPopup](https://user-images.githubusercontent.com/14907987/165752387-2eac4936-1b5d-462e-9353-562d04f1b4fe.gif)
 * 
 * Emits the following events: 
 * - "confirm" when the user confirm the option
 * - "cancel" when the user cancel the option
 * - "exit" when the user exit the option
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {Array<string | number>} options - The options of the popup.
 * @param {string | number} selected - The selected option.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 * 
 * @example ```ts
 * const popup = new OptionPopup({
 *  id:"popup1", 
 *  title: "Choose the option", 
 *  options, 
 *  selected
 * }).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
 * ```
 */
export class OptionPopup extends EventEmitter {
    readonly CM: ConsoleManager
    readonly id: string
    title: string
    private options: Array<string | number>
    private selected: string | number
    private visible: boolean
    private marginTop: number
    private startIndex: number
    private parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetY: number
    private absoluteValues: PhisicalValues
    private dragging = false
    private dragStart: { x: number, y: number } = { x: 0, y: 0 }
    private focused = false
    
    public constructor(config: OptionPopupConfig) {
        if (!config) throw new Error("OptionPopup config is required")
        const { id, title, options, selected, visible = false } = config
        if (!id) throw new Error("OptionPopup id is required")
        if (!title) throw new Error("OptionPopup title is required")
        if (!options) throw new Error("OptionPopup options is required")
        if (selected === undefined || selected === null) throw new Error("OptionPopup selected is required")
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.options = options
        this.selected = selected
        this.visible = visible
        this.marginTop = 4
        this.startIndex = 0
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
            const message = `OptionPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerPopup(this)
    }

    private adaptOptions(): Array<string | number> {
        return this.options.slice(this.startIndex, this.startIndex + this.CM.Screen.height - this.marginTop - 6)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof OptionPopup
     */
    keyListener(_str: string, key: KeyListenerArgs) {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        switch (key.name) {
        case "down":
            this.setSelected(this.options[(this.options.indexOf(this.selected) + 1) % this.options.length])
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                if (this.selected === this.options[this.adaptOptions().length + this.startIndex]) {
                    this.startIndex++
                }
            } else {
                this.startIndex = 0
            }
            break
        case "up":
            this.setSelected(this.options[(this.options.indexOf(this.selected) - 1 + this.options.length) % this.options.length])
            if (this.startIndex > 0 && this.selected === this.adaptOptions()[0]) {
                this.startIndex--
            }
            break
        case "pagedown":
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                this.setSelected(this.options[(this.options.indexOf(this.selected) + this.adaptOptions().length) % this.options.length])
                if (this.startIndex + this.adaptOptions().length < this.options.length) {
                    this.startIndex += this.adaptOptions().length
                } else {
                    this.startIndex = 0
                }
            } else {
                return
            }
            break
        case "pageup":
            if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                this.setSelected(this.options[(this.options.indexOf(this.selected) - this.adaptOptions().length + this.options.length) % this.options.length])
                if (this.startIndex > this.adaptOptions().length) {
                    this.startIndex -= this.adaptOptions().length
                } else {
                    this.startIndex = 0
                }
            } else {
                return
            }
            break
        case "return":
            {
                this.emit("confirm", this.selected)
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
     * @description This function is used to get the selected option.
     * @returns {string | number} The selected value of the popup.
     * @memberof OptionPopup
     */
    public getSelected(): string | number {
        return this.selected
    }

    /**
     * @description This function is used to change the selection of the popup. It also refresh the ConsoleManager.
     * @param {string | number} selected - The new value of the selection.
     * @memberof OptionPopup
     * @returns {OptionPopup} The instance of the OptionPopup.
     */
    public setSelected(selected: string | number): OptionPopup {
        this.selected = selected
        this.CM.refresh()
        return this
    }

    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    public show(): OptionPopup {
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
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    public hide(): OptionPopup {
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
     * @memberof OptionPopup
     */
    public isVisible(): boolean {
        return this.visible
    }
    
    /**
     * @description This function is used to return the PhisicalValues of the popup (x, y, width, height).
     * @memberof OptionPopup
     * @private
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    public getPosition(): PhisicalValues {
        return this.absoluteValues
    }

    /**
     * @description This function is used to add the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    private manageInput(): OptionPopup {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListener.bind(this))
        if (this.CM.mouse) this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    private unManageInput(): OptionPopup {
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
            if (event.name === "MOUSE_WHEEL_DOWN") {
                this.setSelected(this.options[(this.options.indexOf(this.selected) + 1) % this.options.length])
                if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                    if (this.selected === this.options[this.adaptOptions().length + this.startIndex]) {
                        this.startIndex++
                    }
                } else {
                    this.startIndex = 0
                }
                this.focused = true
            } else if (event.name === "MOUSE_WHEEL_UP") {
                this.setSelected(this.options[(this.options.indexOf(this.selected) - 1 + this.options.length) % this.options.length])
                if (this.startIndex > 0 && this.selected === this.adaptOptions()[0]) {
                    this.startIndex--
                }
                this.focused = true
            } else if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                // find the selected index of the click and set it as selected
                const index = y - this.absoluteValues.y - 4
                if (index >= 0 && index < this.adaptOptions().length) {
                    this.setSelected(this.options[this.startIndex + index])
                }
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
     * @description This function is used to draw the OptionPopup to the screen in the middle.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    public draw(): OptionPopup {
        // Change start index if selected is not in the adaptOptions return array
        if (this.adaptOptions().indexOf(this.selected) === -1) {
            this.startIndex = this.options.indexOf(this.selected) - this.adaptOptions().length + 1 > 0 ? this.options.indexOf(this.selected) - this.adaptOptions().length + 1 : 0
        }
        const offset = 2
        const maxOptionsLength = this.options.map((o) => o.toString()).reduce((max, option) => Math.max(max, option.length), 0)
        const windowWidth = maxOptionsLength > this.title.length ? maxOptionsLength + (2 * offset) : this.title.length + (2 * offset)
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)

        let header = boxChars["normal"].topLeft
        for (let i = 0; i < windowWidth; i++) {
            header += boxChars["normal"].horizontal
        }
        header += `${boxChars["normal"].topRight}${EOL}`
        header += `${boxChars["normal"].vertical}${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}${boxChars["normal"].vertical}${EOL}`
        header += `${boxChars["normal"].left}${boxChars["normal"].horizontal.repeat(windowWidth)}${boxChars["normal"].right}${EOL}`

        let footer = boxChars["normal"].bottomLeft
        for (let i = 0; i < windowWidth; i++) {
            footer += boxChars["normal"].horizontal
            
        }
        footer += `${boxChars["normal"].bottomRight}${EOL}`

        let content = ""
        this.adaptOptions().forEach((option) => {
            content += `${boxChars["normal"].vertical}${option === this.selected ? "<" : " "} ${option}${option === this.selected ? " >" : "  "}${" ".repeat(windowWidth - option.toString().length - 4)}${boxChars["normal"].vertical}${EOL}`
        })

        const windowDesign = `${header}${content}${footer}`
        const windowDesignLines = windowDesign.split(EOL)
        const centerScreen = Math.round((this.CM.Screen.width / 2) - (windowWidth / 2))
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

export default OptionPopup