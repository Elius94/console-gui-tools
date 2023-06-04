import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs, EOL } from "../../ConsoleGui.js"
import { MouseEvent } from "../MouseManager.js"
import PageBuilder from "../PageBuilder.js"
import { boxChars, PhisicalValues, StyledElement, truncate, visibleLength } from "../Utils.js"

/**
 * @description The configuration for the CustomPopup class.
 * @typedef {Object} PopupConfig
 * 
 * @prop {string} id - The id of the popup.
 * @prop {string} title - The title of the popup.
 * @prop {PageBuilder} content - The content of the popup.
 * @prop {number} width - The width of the popup.
 * @prop {boolean} [visible] - If the popup is visible.
 *
 * @export
 * @interface PopupConfig
 */
// @type definition
export interface PopupConfig {
    id: string,
    title: string,
    content: PageBuilder,
    width: number,
    visible?: boolean,
}

/**
 * @class CustomPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a free content built with PageBuilder class. 
 * 
 * ![Animation](https://user-images.githubusercontent.com/14907987/165736767-d60f857f-3945-4b95-aa4f-292b6a41f789.gif)
 * 
 * Emits the following events: 
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * - "data" when the user send custom event - the data is an object with the data and the event name
 * @param {PopupConfig} config - The configuration of the popup.
 * 
 * @example ```ts
 * const popup = new CustomPopup({
 *  id: "popup1",
 *  title: "See that values",
 *  content: new PageBuilder().addText("Hello world!"),
 * }).show()
 */
export class CustomPopup extends EventEmitter {
    readonly CM: ConsoleManager
    readonly id: string
    title: string
    content: PageBuilder
    width: number
    private visible: boolean
    private marginTop: number
    parsingMouseFrame = false
    /** @var {number} x - The x offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetX: number
    /** @var {number} y - The y offset of the popup to be drown. If 0 it will be placed on the center */
    private offsetY: number
    private absoluteValues: PhisicalValues
    private dragging = false
    private dragStart: { x: number, y: number } = { x: 0, y: 0 }
    focused = false

    public constructor(config: PopupConfig) {
        if (!config) throw new Error("PopupConfig is required")
        const { id, title, content, width, visible = false } = config
        if (!id) throw new Error("id is required")
        if (!title) throw new Error("title is required")
        if (!content) throw new Error("content is required")
        if (!width) throw new Error("width is required")
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.content = content
        this.width = width
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
            const message = `CustomPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerPopup(this)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof CustomPopup
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
        case "up":
            this.content.increaseScrollIndex()
            break
        case "down":
            this.content.decreaseScrollIndex()
            break
        case "return":
            {
                this.emit("confirm")
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
     * @description This function is used to get the content of the popup.
     * @returns {PageBuilder} The content of the popup.
     * @memberof CustomPopup
     */
    public getContent(): PageBuilder {
        return this.content
    }

    /**
     * @description This function is used to change the content of the popup. It also refresh the ConsoleManager.
     * @param {PageBuilder} newContent - The new content of the popup.
     * @memberof CustomPopup
     * @returns {CustomPopup} The instance of the CustomPopup.
     */
    public setContent(newContent: PageBuilder): CustomPopup {
        this.content = newContent
        this.CM.refresh()
        return this
    }

    /**
     * @description This function is used to change the popup width. It also refresh the ConsoleManager.
     * @param {number} newWidth - The new width of the popup.
     * @memberof CustomPopup
     * @returns {CustomPopup} The instance of the CustomPopup.
     */
    public setWidth(newWidth: number): this {
        this.width = newWidth
        this.CM.refresh()
        return this
    }

    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    public show(): this {
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
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    public hide(): this {
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
     * @memberof CustomPopup
     */
    public isVisible(): boolean {
        return this.visible
    }
    
    /**
     * @description This function is used to return the PhisicalValues of the popup (x, y, width, height).
     * @memberof CustomPopup
     * @private
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    public getPosition(): PhisicalValues {
        return this.absoluteValues
    }

    /**
     * @description This function is used to add the CustomPopup key listener callback to te ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    private manageInput(): CustomPopup {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListener.bind(this))
        if (this.CM.mouse) this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the CustomPopup key listener callback to te ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    private unManageInput(): CustomPopup {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id/*, this.keyListener.bind(this)*/)
        if (this.CM.mouse) this.CM.removeMouseListener(`${this.id}_mouse`)
        return this
    }

    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<object>} line the line to be drawn
     * @memberof CustomPopup
     * @returns {void}
     */
    private drawLine(line: StyledElement[], width: number): void {
        let unformattedLine = ""
        let newLine = [...line]
        line.forEach((element: { text: string }) => {
            unformattedLine += element.text
        })
        if (visibleLength(unformattedLine) > width - 2) { // Need to truncate
            const offset = 2
            newLine = JSON.parse(JSON.stringify(line)) // Shallow copy because I don't want to modify the values but not the original
            let diff = visibleLength(unformattedLine) - width
            // remove truncated text
            for (let i = newLine.length - 1; i >= 0; i--) {
                if (visibleLength(newLine[i].text) > diff + offset) {
                    newLine[i].text = truncate(newLine[i].text, (visibleLength(newLine[i].text) - diff) - offset, true)
                    break
                } else {
                    diff -= visibleLength(newLine[i].text)
                    newLine.splice(i, 1)
                }
            }
            // Update unformatted line
            unformattedLine = ""
            newLine.forEach(element => {
                unformattedLine += element.text
            })
        }
        newLine.unshift({ text: boxChars["normal"].vertical, style: { color: "white" } })
        if (visibleLength(unformattedLine) <= width) {
            newLine.push({ text: `${" ".repeat((width - visibleLength(unformattedLine)))}`, style: { color: "" } })
        }
        newLine.push({ text: boxChars["normal"].vertical, style: { color: "white" } })
        this.CM.Screen.write(...newLine)
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
                this.content.increaseScrollIndex()
                this.focused = true
            } else if (event.name === "MOUSE_WHEEL_UP") {
                this.content.decreaseScrollIndex()
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
     * @description This function is used to draw the CustomPopup to the screen in the middle.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    public draw(): CustomPopup {
        const offset = 2
        const windowWidth = this.title.length > this.width ? this.title.length + (2 * offset) : this.width + (2 * offset) + 1
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)
        const x = Math.round((this.CM.Screen.width / 2) - (windowWidth / 2))
        let header = boxChars["normal"].topLeft
        for (let i = 0; i < windowWidth; i++) {
            header += boxChars["normal"].horizontal
        }
        header += `${boxChars["normal"].topRight}${EOL}`
        header += `${boxChars["normal"].vertical}${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}${boxChars["normal"].vertical}${EOL}`
        header += `${boxChars["normal"].left}${boxChars["normal"].horizontal.repeat(windowWidth)}${boxChars["normal"].right}${EOL}`

        const windowDesign = `${header}`
        const windowDesignLines = windowDesign.split(EOL)
        const centerScreen = Math.round((this.CM.Screen.width / 2) - (windowWidth / 2))
        windowDesignLines.forEach((line, index) => {
            this.CM.Screen.cursorTo(x + this.offsetX, this.marginTop + index + this.offsetY)
            this.CM.Screen.write({ text: line, style: { color: "white" } })
        })
        const _content = this.content.getContent()
        _content.forEach((line: StyledElement[], index: number) => {
            this.CM.Screen.cursorTo(x + this.offsetX, this.marginTop + index + windowDesignLines.length - 1 + this.offsetY)
            this.drawLine(line, windowWidth)
        })
        this.CM.Screen.cursorTo(x + this.offsetX, this.marginTop + _content.length + windowDesignLines.length - 1 + this.offsetY)
        this.CM.Screen.write({ text: `${boxChars["normal"].bottomLeft}${boxChars["normal"].horizontal.repeat(windowWidth)}${boxChars["normal"].bottomRight}`, style: { color: "white" } })
        
        this.absoluteValues = {
            x: centerScreen + this.offsetX,
            y: this.marginTop + this.offsetY,
            width: windowWidth,
            height: windowDesignLines.length,
        }
        return this
    }
}

export default CustomPopup