import { BackgroundColorName, ForegroundColorName } from "chalk/source/vendor/ansi-styles/index.js"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, HEX, RGB, truncate } from "../Utils.js"
import Control from "./Control.js"

export interface ButtonStyle {
    background: BackgroundColorName | HEX | RGB | "";
    borderColor: ForegroundColorName | HEX | RGB | "";
    color: ForegroundColorName | HEX | RGB | "";
    bold?: boolean;
    italic?: boolean;
    dim?: boolean;
    underline?: boolean;
    inverse?: boolean;
    hidden?: boolean;
    strikethrough?: boolean;
    overline?: boolean;
}

/**
 * @class Button
 * @extends Control
 * @description This class is an overload of Control that is used to create a button. 
 * 
 * ![Button](https://user-images.githubusercontent.com/14907987/202866824-047503fc-9af6-4990-aa9a-57a3d691f6b0.gif)
 * 
 * Emits the following events: 
 * - "click" when the user confirm
 * - "relese" when the user cancel
 * @param {string} id - The id of the button.
 * @param {string} text - The text of the button.
 * @param {number} width - The width of the button.
 * @param {number} height - The height of the button.
 * @param {number} x - The x position of the button.
 * @param {number} y - The y position of the button.
 * @param {ButtonStyle} style - To set the style of the button.
 * @param {boolean} visible - If the button is visible. Default is true (make it hide using hide()).
 * @param {boolean} enabled - If the button is enabled. Default is true (make it disabled using disable()).
 * @param {function} onClick - The function to call when the button is clicked.
 * @param {function} onRelease - The function to call when the button is released. 
 * 
 * @example ```js
 * new Button("btnRun", "Run me!", 10, 3, 21, 18, 
 *      { 
 *          color: "magentaBright", 
 *          bold: true, 
 *          italic: true,
 *          borderColor: "green"
 *      },
 *      () => {
 *          GUI.log("Button clicked!")
 *      })
 * ```
 */
export class Button extends Control {
    private text = "TEXT"
    private enabled = true
    private style: ButtonStyle = {
        background: "bgBlack",
        borderColor: "white",
        color: "white",
        bold: true
    }
    public onClick: () => void
    public onRelease: () => void
    private status: "normal" | "hovered" | "selected" = "normal" 
    public constructor(
        id: string, 
        text: string, 
        width: number,
        height: number,
        x: number,
        y: number,
        style: ButtonStyle,
        onClick: () => void,
        onRelease: () => void,
        visible = true,
        enabled = true,
        draggable = false) 
    {
        super(id, visible, { x, y, width, height }, new InPageWidgetBuilder())
        this.text = text
        this.enabled = enabled
        this.onClick = onClick
        this.onRelease = onRelease
        this.style = style
        this.draggable = draggable

        this.on("relativeMouse", (event) => {
            if (!this.enabled) {
                return
            }
            if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                this.status = "selected"
                this.update()
                if (this.onClick) this.onClick.call(this)
                this.emit("click")
            }
            if (event.name === "MOUSE_LEFT_BUTTON_RELEASED") {
                this.status = "hovered"
                this.update()
                if (this.onRelease) this.onRelease.call(this)
                this.emit("release")
            }
            if (event.name === "MOUSE_RIGHT_BUTTON_PRESSED") {
                this.emit("rightClick")
            }
            if (event.name === "MOUSE_RIGHT_BUTTON_RELEASED") {
                this.emit("rightRelease")
            }
            if (event.name === "MOUSE_MOTION") {
                if (this.status === "normal") {
                    this.status = "hovered"
                    this.update()
                }
            }
        })
        this.on("hoverOut", () => {
            this.status = "normal"
            this.update()
        })
        this.update()
    }

    public update = () => {
        const absVal = this.absoluteValues
        let truncatedText = truncate(this.text, absVal.width - 2, false)
        
        // add a white space to the end of the truncated text if the sum of the length of the text and the width of the button is odd
        if ((truncatedText.length + (absVal.width - 2)) % 2 === 1) {
            truncatedText += " "
        }

        this.getContent().clear()
        this.getContent().addRow({ text: `${boxChars[this.status].topLeft}${boxChars[this.status].horizontal.repeat(absVal.width - 2)}${boxChars[this.status].topRight}`, bg: this.style.background, color: this.style.borderColor, bold: this.style.bold })
        this.getContent().addRow(
            { 
                text: `${boxChars[this.status].vertical}`, 
                bg: this.style.background, 
                color: this.style.borderColor, 
                bold: this.style.bold 
            }, 
            { 
                text: `${" ".repeat(((absVal.width - 2) - truncatedText.length) / 2)}${truncatedText}${" ".repeat(((absVal.width - 2) - truncatedText.length) / 2)}`,
                bg: this.style.background, 
                color: this.style.color, 
                bold: this.style.bold,
                italic: this.style.italic,
                dim: this.style.dim,
                underline: this.style.underline,
                inverse: this.style.inverse,
                hidden: this.style.hidden,
                strikethrough: this.style.strikethrough,
                overline: this.style.overline
            },
            { 
                text: `${boxChars[this.status].vertical}`, 
                bg: this.style.background, 
                color: this.style.borderColor, 
                bold: this.style.bold 
            }
        )
        this.getContent().addRow({ text: `${boxChars[this.status].bottomLeft}${boxChars[this.status].horizontal.repeat(absVal.width - 2)}${boxChars[this.status].bottomRight}`, bg: this.style.background, color: this.style.borderColor, bold: this.style.bold })
        this.CM.refresh()
    }

    public setText = (text: string) => {
        this.text = text
        this.update()
    }

    public setStyle = (style: ButtonStyle) => {
        this.style = style
        this.update()
    }

    public setEnabled = (enabled: boolean) => {
        this.enabled = enabled
        this.update()
    }
}

export default Button