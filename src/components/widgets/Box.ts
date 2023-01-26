/* eslint-disable @typescript-eslint/no-empty-function */
import { ForegroundColorName } from "chalk/source/vendor/ansi-styles/index.js"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, HEX, PhisicalValues, RGB, StyledElement, styledToSimplifiedStyled, truncate } from "../Utils.js"
import Control from "./Control.js"
import { KeyListenerArgs } from "../../ConsoleGui.js"
import { RelativeMouseEvent } from "../MouseManager.js"

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

export interface BoxStyle {
    boxed?: boolean,
    color?: ForegroundColorName | HEX | RGB | "",
    label?: string,
}

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

    private drawInnerLine(line: Array<StyledElement>): void {
        let unformattedLine = ""
        let newLine = [...line]

        line.forEach((element: { text: string; }) => {
            unformattedLine += element.text
        })

        if (unformattedLine.length > this.absoluteValues.width) {
            const offset = 2
            newLine = [...JSON.parse(JSON.stringify(line))] // Shallow copy because I just want to modify the values but not the original

            let diff = unformattedLine.length - this.absoluteValues.width + 1

            // remove truncated text
            for (let j = newLine.length - 1; j >= 0; j--) {
                if (newLine[j].text.length > diff + offset) {
                    newLine[j].text = truncate(newLine[j].text, (newLine[j].text.length - diff) - offset, false)
                    break
                } else {
                    diff -= newLine[j].text.length
                    newLine.splice(j, 1)
                }
            }
            // Update unformatted line
            unformattedLine = newLine.map((element: { text: string; }) => element.text).join("")

            if (this.style.boxed) {
                newLine.push({ text: `${" ".repeat(this.absoluteValues.width - unformattedLine.length - 1)}${boxChars["normal"].vertical}`, style: { color: this.style.color } })
            }
        }
        if (unformattedLine.length <= this.absoluteValues.width) {
            newLine.push({ text: `${" ".repeat(this.absoluteValues.width - unformattedLine.length)}`, style: { color: "" } })
        }
        this.getContent().addRow(...newLine.map((element: StyledElement) => styledToSimplifiedStyled(element)))
    }

    public update = () => {
        if (this.style.boxed) {
            const absVal = this.absoluteValues
            const truncatedText = this.style.label ? truncate(this.style.label, absVal.width - 2, false) : ""

            this.getContent().clear()
            this.getContent().addRow({ text: `${boxChars["normal"].topLeft}${truncatedText}${boxChars["normal"].horizontal.repeat(absVal.width - (2 + truncatedText.length))}${boxChars["normal"].topRight}`, color: this.style.color })
            for (let i = 0; i < absVal.height - 2; i++) {
                if (this.content.getViewedPageHeight() > i) {
                    const rowlength = this.content.getContent()[i].reduce((acc, curr) => acc + curr.text.length, 0)
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
    }

    public setLabel = (text: string) => {
        this.style.label = text
        this.update()
    }

    public setStyle = (style: BoxStyle) => {
        this.style = style
        this.update()
    }

    public setContent = (content: InPageWidgetBuilder) => {
        this.content = content
        this.content.setRowsPerPage(this.style.boxed ? this.absoluteValues.height - 2 : this.absoluteValues.height)
        this.update()
    }
}

export default Box