/* eslint-disable @typescript-eslint/no-empty-function */
import { BackgroundColorName, ForegroundColorName } from "chalk/source/vendor/ansi-styles/index.js"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, HEX, PhisicalValues, RGB, truncate } from "../Utils.js"
import Control from "./Control.js"
import { KeyListenerArgs } from "../../ConsoleGui.js"

/**
 * @description The configuration object for the Button class
 * 
 * @property {string} id The id of the button (required)
 * @property {string} text The text of the button (if not specified, it will be "TEXT")
 * @property {number} width The width of the button (if not specified, it will be the length of the text + 4)
 * @property {number} height The height of the button (if not specified, it will be 3)
 * @property {number} x The x position of the button (required)
 * @property {number} y The y position of the button (required)
 * @property {ButtonStyle} style The style of the button (if not specified, it will be { background: "bgBlack", borderColor: "white", color: "white", bold: true })
 * @property {ButtonKey} key The key to press to trigger the button
 * @property {function} onClick The function to call when the button is clicked
 * @property {function} onRelease The function to call when the button is released
 * @property {boolean} visible If the button is visible or not (default: true)
 * @property {boolean} enabled If the button is enabled or not (default: true)
 * @property {boolean} draggable If the button is draggable or not (default: false)
 *
 * @export
 * @interface ButtonConfig
 */
// @type definition
export interface ButtonConfig {
    id: string,
    text: string,
    width?: number,
    height?: number,
    x: number,
    y: number,
    style?: ButtonStyle,
    key?: ButtonKey,
    onClick?: () => void,
    onRelease?: () => void,
    visible?: boolean,
    enabled?: boolean,
    draggable?: boolean,
}

/**
 * The configuration object for the ButtonKey class
 * @export ButtonKey
 * @interface ButtonKey
 * @property {string} name The name of the key (required)
 * @property {boolean} ctrl If the key is pressed with the ctrl key (default: false)
 * @property {boolean} shift If the key is pressed with the shift key (default: false)
 */
// @type definition
export interface ButtonKey {
    name: string,
    ctrl?: boolean,
    shift?: boolean,
    meta?: boolean
}

/**
 * @description The configuration object for the ButtonStyle class
 * 
 * @property {BackgroundColorName | HEX | RGB | ""} background The background color of the button (if not specified, it will be "bgBlack")
 * @property {ForegroundColorName | HEX | RGB | ""} borderColor The border color of the button (if not specified, it will be "white")
 * @property {ForegroundColorName | HEX | RGB | ""} color The text color of the button (if not specified, it will be "white")
 * @property {boolean} bold If the text is bold or not (default: true)
 * @property {boolean} italic If the text is italic or not (default: false)
 * @property {boolean} dim If the text is dim or not (default: false)
 * @property {boolean} underline If the text is underlined or not (default: false)
 * @property {boolean} inverse If the text is inverted or not (default: false)
 * @property {boolean} hidden If the text is hidden or not (default: false)
 * @property {boolean} strikethrough If the text is strikethrough or not (default: false)
 * @property {boolean} overline If the text is overlined or not (default: false)
 *
 * @export
 * @interface ButtonStyle
 */
// @type definition
export interface ButtonStyle {
    background?: BackgroundColorName | HEX | RGB | "";
    borderColor?: ForegroundColorName | HEX | RGB | "";
    color?: ForegroundColorName | HEX | RGB | "";
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
 * @param {ButtonConfig} config The configuration object
 * 
 * @example ```js
 * new Button({
        id: "btnRun", 
        text: "Run me!", 
        x: 21, 
        y: 18,
        style: {
            color: "magentaBright",
            bold: true,
            italic: true,
            borderColor: "green"
        },
        onRelease: () => {
            GUI.log("Button clicked!")
        },
        draggable: true,
    })
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
    private key: ButtonKey | undefined

    public constructor(config: ButtonConfig) {
        const tmpSizes = { width: 0, height: 0 }
        if (!config.width) {
            tmpSizes.width = config.text.length + 4
        } else {
            tmpSizes.width = config.width
        }
        if (!config.height) {
            tmpSizes.height = 3
        } else {
            tmpSizes.height = config.height
        }            
        if (!config.id) throw new Error("The id is required")
        if (config.x === undefined || config.y === undefined) throw new Error("The x and y values are required")
        const pv = { x: config.x, y: config.y, width: tmpSizes.width, height: tmpSizes.height } as PhisicalValues
        super({
            id: config.id, visible: config.visible || true, attributes: pv, children: new InPageWidgetBuilder()
        })
        this.text = config.text || "TEXT"
        this.enabled = config.enabled || true
        this.onClick = config.onClick || (() => { })
        this.onRelease = config.onRelease || (() => { })
        this.style = config.style? { ...this.style, ...config.style } : this.style
        this.draggable = config.draggable || false
        this.key = config.key ? { name: config.key.name, ctrl: config.key.ctrl || false, shift: config.key.shift || false, meta: config.key.meta || false } : undefined

        this.on("keypress", (event: KeyListenerArgs) => {
            if (this.key) {
                if (event.name === this.key.name && event.ctrl === this.key.ctrl && event.shift === this.key.shift && event.meta === this.key.meta) {
                    this.status = "selected"
                    this.update()
                    if (this.onClick) this.onClick.call(this)
                    this.emit("click")
                    return
                }
                this.status = "normal"
                this.update()
            }
        })

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

    /**
     * @description Used to draw the button to the content of the control.
     *
     * @returns {Button}
     * @memberof Button
     */
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
        return this
    }

    /**
     * @description Used to set the text of the button.
     *
     * @param {string} text
     * @returns {Button}
     * @memberof Button
     */
    public setText = (text: string) => {
        this.text = text
        this.update()
        return this
    }

    /**
     * @description Used to set the style of the button.
     *
     * @param {ButtonStyle} style
     * @returns {Button}
     * @memberof Button
     */
    public setStyle = (style: ButtonStyle) => {
        this.style = style
        this.update()
        return this
    }

    /**
     * @description Used to set the enabled state of the button.
     *
     * @param {boolean} enabled
     * @returns {Button}
     * @memberof Button
     */
    public setEnabled = (enabled: boolean) => {
        this.enabled = enabled
        this.update()
        return this
    }
}

export default Button