import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"

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
 * @example const popup = new OptionPopup("popup1", "Choose the option", options, selectedOption).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
 */
export class OptionPopup extends EventEmitter {
    CM: ConsoleManager
    id: string
    title: string
    options: Array<string | number>
    selected: string | number
    visible: boolean
    marginTop: number
    startIndex: number
    parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    offsetY: number
    private absoluteValues: {
        x: number
        y: number
        width: number
        height: number
    }
    dragging: boolean = false
    dragStart: {
        x: number
        y: number
    } = {
        x: 0,
        y: 0
    }

    public constructor(id: string, title: string, options: Array<string | number>, selected: string | number, visible = false) {
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
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this)
            const message = `OptionPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerWiget(this)
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
    keyListner(_str: string, key: KeyListenerArgs) {
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
                this.CM.unRegisterWidget(this)
                this.hide()
                //delete this
            }
            break
        case "escape":
            {
                this.emit("cancel")
                this.CM.unRegisterWidget(this)
                this.hide()
                //delete this
            }
            break
        case "q":
            {
                this.CM.emit("exit")
                this.CM.unRegisterWidget(this)
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
     * @description This function is used to add the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    private manageInput(): OptionPopup {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListner.bind(this))
        this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
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
        this.CM.removeMouseListener(`${this.id}_mouse`)
        return this
    }

    private mouseListener = (event: MouseEvent) => {
        const x = event.data.x
        const y = event.data.y

        //this.CM.log(event.name)
        if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
            if (x > this.absoluteValues.x && x < this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y < this.absoluteValues.y + this.absoluteValues.height) {
                // The mouse is inside the popup
                //this.CM.log("Mouse inside popup")
                // find the selected index of the click and set it as selected
                const index = y - this.absoluteValues.y - 4
                if (index >= 0 && index < this.adaptOptions().length) {
                    this.setSelected(this.options[this.startIndex + index])
                }
            }
        }
        if (event.name === "MOUSE_DRAG" && event.data.left === true && this.dragging === false) {
            // check if the mouse is on the header of the popup (first three lines)
            if (x > this.absoluteValues.x && x < this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y < this.absoluteValues.y + 3) {
                this.dragging = true
                this.dragStart = { x: x, y: y }
            }
        } else if (event.name === "MOUSE_DRAG" && event.data.left === true && this.dragging === true) {
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

        let header = "┌"
        for (let i = 0; i < windowWidth; i++) {
            header += "─"
        }
        header += "┐\n"
        header += `│${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}│\n`
        header += "├" + "─".repeat(windowWidth) + "┤\n"

        let footer = "└"
        for (let i = 0; i < windowWidth; i++) {
            footer += "─"
        }
        footer += "┘\n"

        let content = ""
        this.adaptOptions().forEach((option) => {
            content += `│${option === this.selected ? "<" : " "} ${option}${option === this.selected ? " >" : "  "}${" ".repeat(windowWidth - option.toString().length - 4)}│\n`
        })

        const windowDesign = `${header}${content}${footer}`
        const windowDesignLines = windowDesign.split("\n")
        windowDesignLines.forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)) + this.offsetX, this.marginTop + index + this.offsetY)
            this.CM.Screen.write({ text: line, style: { color: "white" } })
        })
        this.absoluteValues = {
            x: Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)) + this.offsetX,
            y: this.marginTop + this.offsetY,
            width: windowWidth,
            height: windowDesignLines.length,
        }
        return this
    }
}

export default OptionPopup