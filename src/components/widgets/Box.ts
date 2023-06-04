/* eslint-disable @typescript-eslint/no-empty-function */
import { ForegroundColorName } from "chalk/source/vendor/ansi-styles/index.js"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, HEX, PhisicalValues, RGB, StyledElement, styledToSimplifiedStyled, truncate, visibleLength } from "../Utils.js"
import Control from "./Control.js"
import { KeyListenerArgs } from "../../ConsoleGui.js"
import { RelativeMouseEvent } from "../MouseManager.js"

/**
 * @description The configuration for the Box class.
 * @typedef {Object} BoxConfig
 * 
 * @prop {string} id - The id of the box.
 * @prop {number} x - The x position of the box.
 * @prop {number} y - The y position of the box.
 * @prop {number} [width] - The width of the box.
 * @prop {number} [height] - The height of the box.
 * @prop {BoxStyle} [style] - The style of the box.
 * @prop {boolean} [visible] - If the box is visible.
 * @prop {boolean} [draggable] - If the box is draggable.
 *
 * @export
 * @interface BoxConfig
 */
// @type definition
export interface BoxConfig {
    id: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    style?: BoxStyle,
    visible?: boolean,
    draggable?: boolean,
}

/**
 * @description The style of the box.
 * @typedef {Object} BoxStyle
 * 
 * @prop {boolean} [boxed] - If the box is boxed.
 * @prop {chalk.ForegroundColorName | HEX | RGB | ""} [color] - The color of the box.
 * @prop {string} [label] - The label of the box.
 *
 * @export
 * @interface BoxStyle
 */
// @type definition
export interface BoxStyle {
    boxed?: boolean,
    color?: ForegroundColorName | HEX | RGB | "",
    label?: string,
}

/**
 * @description The class that represents a box.
 * 
 * ![image](https://user-images.githubusercontent.com/14907987/215069151-037e28d6-011f-428a-baac-3fe42ac0d540.png)
 * 
 * Example of a box containing a list of process running on the computer.
 * 
 * @param {BoxConfig} config - The configuration of the box.
 * 
 * @example ```ts
 * const box = new Box({ 
 *   id: "box", 
 *   x: 0, 
 *   y: 0, 
 *   width: 10, 
 *   height: 5, 
 *   style: { boxed: true, color: "red", label: "Box" } 
 * })
 * box.setContent(new InPageWidgetBuilder(5).addText("Hello World!"))
 * ```
 *
 * @export
 * @class Box
 * @extends {Control}
 */
export class Box extends Control {
    public content: InPageWidgetBuilder
    private style: BoxStyle = {
        boxed: false,
        label: "",
        color: "white",
    }

    public constructor(config: BoxConfig) {
        if (!config.id) throw new Error("The id is required")
        if (config.x === undefined || config.y === undefined) throw new Error("The x and y values are required")
        const tmpSizes = { width: config.width || 10, height: config.height || 5 }
        const pv = { x: config.x, y: config.y, width: tmpSizes.width, height: tmpSizes.height } as PhisicalValues
        super({
            id: config.id, visible: config.visible || true, attributes: pv, children: new InPageWidgetBuilder(pv.height)
        })
        this.style.label = config.style?.label || ""
        this.style = config.style ? { ...this.style, ...config.style } : this.style
        this.content = new InPageWidgetBuilder(this.style.boxed ? this.absoluteValues.height - 2 : this.absoluteValues.height)
        this.draggable = config.draggable || false

        // Manage input events
        this.on("keypress", (key: KeyListenerArgs) => {
            if (!this.focused) return
            if (key.name === "up") {
                this.content.increaseScrollIndex()
                this.update()
            } else if (key.name === "down") {
                this.content.decreaseScrollIndex()
                this.update()
            }
        })
        this.on("relativeMouse", (e: RelativeMouseEvent) => {
            if (!this.focused) return
            if (e.name === "MOUSE_WHEEL_UP") {
                this.content.increaseScrollIndex()
                this.update()
            } else if (e.name === "MOUSE_WHEEL_DOWN") {
                this.content.decreaseScrollIndex()
                this.update()
            }
        })
        this.update()
    }

    /**
     * @description Draws a line inside the box. It keeps the style of the text.
     *
     * @private
     * @param {Array<StyledElement>} line
     * @memberof Box
     */
    private drawInnerLine(line: Array<StyledElement>): void {
        let unformattedLine = ""
        let newLine = [...line]

        line.forEach((element: { text: string; }) => {
            unformattedLine += element.text
        })

        if (visibleLength(unformattedLine) > this.absoluteValues.width) {
            const offset = 2
            newLine = [...JSON.parse(JSON.stringify(line))] // Shallow copy because I just want to modify the values but not the original

            let diff = visibleLength(unformattedLine) - this.absoluteValues.width + 1

            // remove truncated text
            for (let j = newLine.length - 1; j >= 0; j--) {
                if (visibleLength(newLine[j].text) > diff + offset) {
                    newLine[j].text = truncate(newLine[j].text, (visibleLength(newLine[j].text) - diff) - offset, false)
                    break
                } else {
                    diff -= visibleLength(newLine[j].text)
                    newLine.splice(j, 1)
                }
            }
            // Update unformatted line
            unformattedLine = newLine.map((element: { text: string; }) => element.text).join("")

            if (this.style.boxed) {
                newLine.push({ text: `${" ".repeat(this.absoluteValues.width - visibleLength(unformattedLine) - 1)}${boxChars["normal"].vertical}`, style: { color: this.style.color } })
            }
        }
        if (visibleLength(unformattedLine) <= this.absoluteValues.width) {
            newLine.push({ text: `${" ".repeat(this.absoluteValues.width - visibleLength(unformattedLine))}`, style: { color: "" } })
        }
        this.getContent().addRow(...newLine.map((element: StyledElement) => styledToSimplifiedStyled(element)))
    }

    /**
     * @description Sets the content of the box.
     *
     * @returns {Box}
     * @memberof Box
     */
    public update = () => {
        if (this.style.boxed) {
            const absVal = this.absoluteValues
            const truncatedText = this.style.label ? truncate(this.style.label, absVal.width - 2, false) : ""

            this.getContent().clear()
            this.getContent().addRow({ text: `${boxChars["normal"].topLeft}${truncatedText}${boxChars["normal"].horizontal.repeat(absVal.width - (2 + visibleLength(truncatedText)))}${boxChars["normal"].topRight}`, color: this.style.color })
            for (let i = 0; i < absVal.height - 2; i++) {
                if (this.content.getViewedPageHeight() > i) {
                    const rowlength = this.content.getContent()[i].reduce((acc, curr) => acc + visibleLength(curr.text), 0)
                    const spaces = absVal.width - (rowlength + 2)
                    const styledArr = [{ text: `${boxChars["normal"].vertical}`, style: { color: this.style.color }}, ...this.content.getContent()[i], { text: `${" ".repeat(spaces > 0 ? spaces : 0)}${boxChars["normal"].vertical}`, style: { color: this.style.color } }] as StyledElement[]
                    
                    this.drawInnerLine(styledArr)
                }
            }
            this.getContent().addRow({ text: `${boxChars["normal"].bottomLeft}${boxChars["normal"].horizontal.repeat(absVal.width - 2)}${boxChars["normal"].bottomRight}`, color: this.style.color })
        } else {
            this.getContent().clear()
            for (let i = 0; i < this.absoluteValues.height; i++) {
                if (this.content.getViewedPageHeight() > i) {
                    this.drawInnerLine(this.content.getContent()[i])
                }
            }
        }
        this.CM.refresh()
        return this
    }

    /**
     * @description Sets the label of the box.
     *
     * @param {string} text
     * @returns {Box}
     * @memberof Box
     */
    public setLabel = (text: string): Box => {
        this.style.label = text
        this.update()
        return this
    }

    /**
     * @description Sets the style of the box.
     *
     * @param {BoxStyle} style
     * @returns {Box}
     * @memberof Box
     */
    public setStyle = (style: BoxStyle): Box => {
        this.style = style
        this.update()
        return this
    }

    /**
     * @description Sets the content of the box.
     *
     * @param {InPageWidgetBuilder} content
     * @returns {Box}
     * @memberof Box
     */
    public setContent = (content: InPageWidgetBuilder): Box => {
        this.content = content
        this.content.setRowsPerPage(this.style.boxed ? this.absoluteValues.height - 2 : this.absoluteValues.height)
        this.update()
        return this
    }
}

export default Box