import { EventEmitter } from "events"
import { ConsoleManager, KeyListenerArgs, InPageWidgetBuilder } from "../../ConsoleGui.js"
import { MouseEvent, RelativeMouseEvent } from "../MouseManager.js"
import { PhisicalValues, StyledElement, truncate, visibleLength } from "../Utils.js"

/**
 * @typedef {Object} ControlConfig
 * @property {string} id - The id of the control.
 * @property {PhisicalValues} attributes - The phisical values of the control.
 * @property {InPageWidgetBuilder} children - The children of the control.
 * @property {boolean} [visible=true] - If the control is visible or not.
 * @property {boolean} [draggable=false] - If the control is draggable or not.
 *
 * @export
 * @interface ControlConfig
 */
// @type definition
export interface ControlConfig {
    id: string
    attributes: PhisicalValues
    children: InPageWidgetBuilder
    visible?: boolean
    draggable?: boolean
}

/**
 * @class Control
 * @extends EventEmitter
 * @description This class is used to create a custom control (widget) with That is showed in a
 * absolute position on the screen. It's a base class for all the controls (widgets).
 * 
 * Emits the following events:
 * - "mouse": It carries the pure mouse event, but it fires only if the mouse is over the control.
 * - "relativeMouse": It's like the "mouse" event, but it carries the relative mouse X and Y (relative to the control).
 *  
 * ![InPageWidget](https://user-images.githubusercontent.com/14907987/202856804-afe605d2-46b2-4da7-ad4e-9fba5826c787.gif)
 *
 * Emits the following events: 
 * 
 * @param {ControlConfig} config The configuration object for the control.
 * 
 * @example ```ts
 * const widget1 = new InPageWidgetBuilder()
 * widget1.addRow({ text: "┌────────┐", color: "yellow", style: "bold" })
 * widget1.addRow({ text: "│ START! │", color: "yellow", style: "bold" })
 * widget1.addRow({ text: "└────────┘", color: "yellow", style: "bold" })
 * 
 * const button1 = new Control({
 *    id: "btn1",
 *    visible: false,
 *    attributes: { x: 30, y: 18, width: 10, height: 3 },
 *    children: widget1
 * })
 * button1.on("relativeMouse", (event) => {
 *     // The relative mouse event is triggered with the mouse position relative to the widget
 *     //console.log(`Mouse event: x: ${event.data.x}, y: ${event.data.y}`)
 *     if (event.name === "MOUSE_LEFT_BUTTON_RELEASED") {
 *         GUI.log("Button 1 clicked!")
 *         if (valueEmitter) {
 *             clearInterval(valueEmitter)
 *             valueEmitter = null
 *         } else {
 *             valueEmitter = setInterval(frame, period)
 *         }
 *     }
 * })
 * button1.show()
 * ```
 */
export class Control extends EventEmitter {
    CM: ConsoleManager
    id: string
    visible: boolean
    private parsingMouseFrame = false
    absoluteValues: PhisicalValues = { x: 0, y: 0, width: 0, height: 0 }
    children: InPageWidgetBuilder
    draggable = true
    dragging = false
    private dragStart: { x: number, y: number } = { x: 0, y: 0 }
    focused = false
    hovered = false

    public constructor(config: ControlConfig) {
        if (!config) {
            throw new Error("The configuration object is required.")
        } 
        if (!config.id) {
            throw new Error("The id is required.")
        } 
        if (!config.attributes) {
            throw new Error("The attributes are required.")
        } 
        if (!config.children) {
            throw new Error("The children are required.")
        }
        super()
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()
        this.id = config.id
        this.visible = config.visible || true
        this.absoluteValues = config.attributes
        this.children = config.children
        if (this.CM.controlsCollection[this.id]) {
            this.CM.unregisterControl(this)
            const message = `Control ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerControl(this)
        if (this.visible) {
            this.manageInput()
            this.CM.refresh()
        }
    }

    /**
     * @description This function is used to delete the Control and remove it from the ConsoleManager.
     *
     * @memberof Control
     */
    public delete() {
        this.unfocus()
        this.hide()
        this.CM.unregisterControl(this)
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {any} key - The key object.
     * @memberof Control
     */
    public keyListener(_str: string, key: KeyListenerArgs): void {
        const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
        if (checkResult === 1) {
            this.parsingMouseFrame = true
            return
        } else if (checkResult === -1) {
            this.parsingMouseFrame = false
            return
        } // Continue only if the result is 0
        switch (key.name) {
        case "return":
            // TODO
            break
        case "escape":
            this.unfocus()
            break
        default:
            break
        }
        this.emit("keypress", key)
        this.CM.refresh()
    }

    /**
     * getContent()
     * @description This function is used to get the content of the Control.
     * @returns {InPageWidgetBuilder} The content of the Control.
     * @memberof Control
     * @example ```ts
     * const content = control.getContent()
     * ```
     */
    public getContent(): InPageWidgetBuilder {
        return this.children
    }

    /**
     * @description This function is used to focus the Control. It also register the key events.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    public focus(): Control {
        if (this.visible && !this.focused) {
            this.focused = true
            this.manageInput()
            //this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to unfocus the Control. It also unregister the key events.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    public unfocus(): Control {
        if (this.visible && this.focused) {
            this.unManageInput()
            this.focused = false
            //this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to show the Control. It also register the mouse events and refresh the ConsoleManager.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    public show(): Control {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to hide the Control. It also unregister the mouse events and refresh the ConsoleManager.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    public hide(): Control {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.refresh()
        }
        return this
    }

    /**
     * @description This function is used to get the visibility of the Control.
     * @returns {boolean} The visibility of the Control.
     * @memberof Control
     */
    public isVisible(): boolean {
        return this.visible
    }

    /**
     * @description This function is used to get the focus status of the Control.
     * @returns {boolean} The focused status of the Control.
     * @memberof Control
     */
    public isFocused(): boolean {
        return this.focused
    }

    /**
     * @description This function is used to add the Control key listener callback to te ConsoleManager.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    private manageInput(): Control {
        this.CM.setKeyListener(this.id, this.keyListener.bind(this))
        if (this.CM.mouse) this.CM.setMouseListener(`${this.id}_mouse`, this.mouseListener.bind(this))
        return this
    }

    /**
     * @description This function is used to remove the Control key listener callback to te ConsoleManager.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    private unManageInput(): Control {
        this.CM.removeKeyListener(this.id)
        if (this.CM.mouse) this.CM.removeMouseListener(`${this.id}_mouse`)
        return this
    }

    /**
     * @description This function is used to manage the mouse events on the Control.
     * @param {MouseEvent} event - The string of the input.
     * @memberof Control
     */
    private mouseListener = (event: MouseEvent) => {
        const x = event.data.x
        const y = event.data.y

        //this.CM.log(event.name)
        if (x > this.absoluteValues.x && x < this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y <= this.absoluteValues.y + this.absoluteValues.height) {
            // The mouse is inside the popup
            //this.CM.log("Mouse inside popup")
            // Check if there is no popup over this control
            const popups = Object.keys(this.CM.popupCollection)
            for (let i = popups.length - 1; i >= 0; i--) {
                const popup = this.CM.popupCollection[popups[i]]
                if (popup.isVisible() && popup.getPosition) {
                    const popupPosition = popup.getPosition()
                    if (x > popupPosition.x && x < popupPosition.x + popupPosition.width 
                        && y > popupPosition.y && y < popupPosition.y + popupPosition.height) {
                        // There is a popup under this control
                        //this.CM.log("Popup under this control")
                        return
                    }
                }
            }
            this.emit("mouse", event)
            const relativeMouseEvent = {
                name: event.name,
                data: {
                    x: x - this.absoluteValues.x,
                    y: y - this.absoluteValues.y
                }
            } as RelativeMouseEvent
            this.emit("relativeMouse", relativeMouseEvent)
            // class can handle the mouse event without overriding this function
            if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                if (!this.focused) {
                    this.focused = true
                }
                return
            }
            if (event.name === "MOUSE_MOTION") {
                this.focused = true
                if (!this.hovered) this.hovered = true
            }
        } else {
            if (event.name !== "MOUSE_MOTION") this.focused = false // only if you click outside the widget
            if (this.hovered) {
                this.hovered = false
                this.emit("hoverOut", event)
            }
        }
        if (!this.draggable) return
        if (event.name === "MOUSE_DRAG" && event.data.left === true && this.dragging === false && this.focused) {
            // check if the mouse is on the header of the popup (first three lines)
            if (x > this.absoluteValues.x && x <= this.absoluteValues.x + this.absoluteValues.width && y > this.absoluteValues.y && y <= this.absoluteValues.y + this.absoluteValues.height) {
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
            this.absoluteValues.x += x - this.dragStart.x
            this.absoluteValues.y += y - this.dragStart.y
            this.dragStart = { x: x, y: y }
            this.CM.refresh()
        } else if (event.name === "MOUSE_LEFT_BUTTON_RELEASED" && this.dragging === true) {
            this.dragging = false
            this.CM.refresh()
        }
    }

    /**
     * @description This function is used to draw a single line of the widget to the screen. It also trim the line if it is too long.
     * @param {Array<StyledElement>} line the line to be drawn
     * @memberof Control
     * @returns {void}
     */
    private drawLine(line: Array<StyledElement>): void {
        let unformattedLine = ""
        let newLine = [...line]

        line.forEach((element: { text: string; }) => {
            unformattedLine += element.text
        })

        if (visibleLength(unformattedLine) > this.absoluteValues.width) {
            const offset = 2
            newLine = [...JSON.parse(JSON.stringify(line))] // Shallow copy because I just want to modify the values but not the original

            let diff = visibleLength(unformattedLine) - this.CM.Screen.width + 1

            // remove truncated text
            for (let j = newLine.length - 1; j >= 0; j--) {
                if (visibleLength(newLine[j].text) > diff + offset) {
                    newLine[j].text = truncate(newLine[j].text, (visibleLength(newLine[j].text) - diff) - offset, true)
                    break
                } else {
                    diff -= visibleLength(newLine[j].text)
                    newLine.splice(j, 1)
                }
            }
            // Update unformatted line
            unformattedLine = newLine.map((element: { text: string; }) => element.text).join("")
        }
        if (visibleLength(unformattedLine) <= this.absoluteValues.width) {
            newLine.push({ text: `${" ".repeat(this.absoluteValues.width - visibleLength(unformattedLine))}`, style: { color: "" } })
        }
        this.CM.Screen.write(...newLine)
    }

    /**
     * @description This function is used to draw the Control to the screen in the middle.
     * @returns {Control} The instance of the Control.
     * @memberof Control
     */
    public draw(): Control {
        this.children.getContent().forEach((line: StyledElement[], index: number) => {
            this.CM.Screen.cursorTo(this.absoluteValues.x, index + this.absoluteValues.y)
            this.drawLine(line)
        })
        return this
    }
}

export default Control