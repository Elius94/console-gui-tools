/* eslint-disable @typescript-eslint/no-empty-function */
import { BackgroundColorName, ForegroundColorName } from "chalk"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, HEX, PhisicalValues, RGB, SimplifiedStyledElement/*, truncate*/ } from "../Utils.js"
import Control from "./Control.js"

/** @const {Object} drawingChars - The characters used to draw the progress bar. */
const drawingChars = {
    "precision": {
        horizontal: {
            100: { char: "█", color: undefined },
            88: { char: "▉", color: undefined },
            75: { char: "▊", color: undefined },
            63: { char: "▋", color: undefined },
            50: { char: "▌", color: undefined },
            38: { char: "▍", color: undefined },
            25: { char: "▎", color: undefined },
            13: { char: "▏", color: undefined },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        vertical: {
            100: { char: "█", color: undefined },
            88: { char: "▇", color: undefined },
            75: { char: "▆", color: undefined },
            63: { char: "▅", color: undefined },
            50: { char: "▄", color: undefined },
            38: { char: "▃", color: undefined },
            25: { char: "▂", color: undefined },
            13: { char: "▁", color: undefined },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        block: {
            full: { char: "▓", color: undefined },
            half: { char: "▒", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: boxChars.normal,
            labelStyle: undefined,
            valueStyle: undefined
        }
    },
    "htop-light": {
        horizontal: {
            100: { char: "│", color: "#15a121" },
            75: { char: "│", color: "#c09c22" },
            50: { char: "│", color: "#0c37d6" },
            25: { char: "│", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        vertical: {
            100: { char: "─", color: "#15a121" },
            75: { char: "─", color: "#c09c22" },
            50: { char: "─", color: "#0c37d6" },
            25: { char: "─", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                left: "[",
                right: "]"
            } as typeof boxChars.normal,
            labelStyle: { color: "#3d96da", bold: false },
            valueStyle: { color: "gray", dim: true },
        }
    },
    "htop-heavy": {
        horizontal: {
            100: { char: "┃", color: "#15a121" },
            75: { char: "┃", color: "#c09c22" },
            50: { char: "┃", color: "#0c37d6" },
            25: { char: "┃", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        vertical: {
            100: { char: "━", color: "#15a121" },
            75: { char: "━", color: "#c09c22" },
            50: { char: "━", color: "#0c37d6" },
            25: { char: "━", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                color: "white",
                left: "[",
                right: "]"
            } as typeof boxChars.normal,
            labelStyle: { color: "#3d96da", bold: true },
            valueStyle: { color: "gray", dim: true }
        }
    },
    "htop": {
        horizontal: {
            100: { char: "|", color: "#15a121" },
            75: { char: "|", color: "#c09c22" },
            50: { char: "|", color: "#0c37d6" },
            25: { char: "|", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        vertical: {//―⎯
            100: { char: "―", color: "#15a121" },
            75: { char: "―", color: "#c09c22" },
            50: { char: "―", color: "#0c37d6" },
            25: { char: "―", color: "#c40c26" },
            0: { char: " ", color: undefined }
        } as { [key: number]: { char: string, color: ForegroundColorName | HEX | RGB | undefined } },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                start: "[",
                end: "]"
            } as typeof boxChars.normal,
            labelStyle: { color: "#3d96da", bold: true },
            valueStyle: { color: "gray", dim: true }
        }
    }
}

/**
 * @description The configuration object for the progress class
 * 
 * @property {string} id The id of the progress (required)
 * @property {number} length The length of the progress bar (required)
 * @property {number} thickness The thickness of the progress bar (required)
 * @property {number} x The x position of the progress bar (required)
 * @property {number} y The y position of the progress bar (required)
 * @property {number} [value] The value of the progress bar (optional)
 * @property {number} [min] The minimum value of the progress bar (optional)
 * @property {number} [max] The maximum value of the progress bar (optional)
 * @property {string} [unit] The unit of the progress bar (optional)
 * @property {number} [increment] The increment of the progress bar (optional)
 * @property {string} [label] The label of the progress bar (optional)
 * @property {ProgressStyle} [style] The style of the progress bar (optional)
 * @property {Orientation} orientation The orientation of the progress bar (required)
 * @property {boolean} [interactive] Whether the progress bar is interactive (optional)
 * @property {boolean} [visible] Whether the progress bar is visible (optional)
 * @property {boolean} [enabled] Whether the progress bar is enabled (optional)
 * @property {boolean} [draggable] Whether the progress bar is draggable (optional)
 *
 * @export
 * @interface ProgressConfig
 */
// @type definition
export interface ProgressConfig {
    id: string;
    length: number;
    thickness: number;
    x: number;
    y: number;
    increment?: number;
    value?: number;
    min?: number;
    max?: number;
    unit?: string;
    label?: string;
    style?: ProgressStyle;
    orientation?: Orientation;
    interactive?: boolean;
    visible?: boolean;
    enabled?: boolean;
    draggable?: boolean;
    onValueChanged?: (value: number) => void;
}

export type Orientation = "horizontal" | "vertical";

/**
 * @description Defines the styles and settings for the progress bar
 * 
 * @param {BackgroundColorName | HEX | RGB} background The background color of the progress bar
 * @param {ForegroundColorName | HEX | RGB} borderColor The color of the border
 * @param {ForegroundColorName | HEX | RGB} [textColor] The color of the text
 * @param {ForegroundColorName | HEX | RGB} color The color of the progress bar
 * @param {"precision" | "htop" | "htop-light" | "htop-heavy"} [theme] The theme to use for the progress bar ["precision", "htop", "htop-light", "htop-heavy"]
 * @param {boolean} [boxed] Whether or not to draw a box around the progress bar
 * @param {boolean} [showPercentage] Whether or not to show the percentage
 * @param {boolean} [showValue] Whether or not to show the value
 * @param {boolean} [showMinMax] Whether or not to show the min and max values
 * @param {boolean} [showTitle] Whether or not to show the title
 * @param {boolean} [bold] Whether or not to bold the text
 * @param {boolean} [italic] Whether or not to italicize the text
 * @param {boolean} [dim] Whether or not to dim the text
 * @param {boolean} [underline] Whether or not to underline the text
 * @param {boolean} [inverse] Whether or not to inverse the text
 * @param {boolean} [hidden] Whether or not to hide the text
 * @param {boolean} [strikethrough] Whether or not to strikethrough the text
 * @param {boolean} [overline] Whether or not to overline the text
 *
 * @export
 * @interface ProgressStyle
 */
// @type definition
export interface ProgressStyle {
    background: BackgroundColorName | HEX | RGB;
    borderColor: ForegroundColorName | HEX | RGB;
    textColor?: ForegroundColorName | HEX | RGB;
    color: ForegroundColorName | HEX | RGB;
    theme?: keyof typeof drawingChars;
    boxed?: boolean;
    showPercentage?: boolean;
    showValue?: boolean;
    showMinMax?: boolean;
    showTitle?: boolean;
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
 * @class Progress
 * @extends Control
 * @description This class is an overload of Control that is used to create a Progress bar. 
 * 
 * ![Progress](https://user-images.githubusercontent.com/14907987/203602965-b66f9eb0-c7a1-4caa-947a-a140badeddc2.gif)
 * 
 * Emits the following events: 
 * - "valueChanged" when the user changes the value of the progress bar with the scroll wheel (if interactive is true).
 * - "click" when the user clicks on the progress bar (if interactive is true).
 * - "relese" when the user releases the mouse button on the progress bar (if interactive is true).
 * - "rightClick" when the user clicks on the progress bar with right button (if interactive is true).
 * - "rightRelese" when the user releases the right mouse button on the progress bar (if interactive is true).
 * 
 * ### Example of interactive progress bar
 * ![Progress_Interactive](https://user-images.githubusercontent.com/14907987/203607512-6ce3656c-7ffb-4185-b36e-6c10619b2b6e.gif)
 * 
 * @param {ProgressConfig} config The configuration object for the progress bar
 * 
 * @example ```js
 *  const pStyle = {
 *      boxed: true,
 *      showTitle: true,
 *      showValue: true,
 *      showPercentage: true,
 *      showMinMax: false,
 *  }
 *  const p = new Progress({
 *      id: "prog1", 
 *      x: 10, y: 2,
 *      style: pStyle, 
 *      theme: "htop",
 *      length: 25,
 *      label: "Mem"
 *  })
 *  const incr = setInterval(() => {
 *      const value = p.getValue() + 0.25
 *      p.setValue(value)
 *      if (value >= p.getMax()) {
 *          clearInterval(incr)
 *      }
 *  }, 100)
 *
 *  const p1Style = {
 *      background: "bgBlack",
 *      borderColor: "yellow",
 *      color: "green",
 *      boxed: true,
 *      showTitle: true,
 *      showValue: true,
 *      showPercentage: true,
 *      showMinMax: true,
 *  }
 *  const p1 = new Progress({
 *      id: "prog1", 
 *      x: 10, y: 4,
 *      style: pStyle, 
 *      theme: "precision",
 *      length: 25,
 *      label: "Precision"
 *  })
 *  const incr1 = setInterval(() => {
 *      const value = p1.getValue() + 0.25
 *      p1.setValue(value)
 *      if (value >= p1.getMax()) {
 *          clearInterval(incr1)
 *      }
 *  }, 100)
 *  const p2Style = {
 *      background: "bgBlack",
 *      borderColor: "yellow",
 *      color: "magenta",
 *      boxed: true,
 *      showTitle: true,
 *      showValue: true,
 *      showPercentage: true,
 *      showMinMax: true,
 *  }
 *  const p2 = new Progress({
 *      id: "prog3", 
 *      x: 10, y: 6,
 *      style: pStyle, 
 *      theme: "precision",
 *      length: 25,
 *      label: "Interactive",
 *      direction: "vertical",
 *      interactive: true,
 *  })
 *  p2.on("valueChanged", (value) => {
 *      console.log(`Value changed: ${value}`)
 *  })
 * ```
 */
export class Progress extends Control {
    private value: number
    private max: number
    private min: number
    private unit: string | undefined
    private length: number
    private thickness = 1
    private orientation: Orientation = "horizontal"
    private increment = 1
    private interactive = false
    private label = ""
    private enabled = true
    theme: keyof typeof drawingChars = "precision"
    private style: ProgressStyle = {
        background: "bgBlack",
        borderColor: "white",
        color: "white",
        textColor: "white",
        bold: true,
        boxed: true,
        showPercentage: true,
        showValue: true,
        showMinMax: true,
        showTitle: true,
    }
    private status: "normal" | "hovered" | "selected" = "normal"
    private onValueChanged: (value: number) => void = () => { }

    public constructor(config: ProgressConfig) {
        if (!config.id) throw new Error("The id is required")
        if (config.x === undefined || config.y === undefined) throw new Error("The x and y values are required")
        const orientation = config.orientation || "horizontal"
        const length = config.length || 20
        const thickness = config.thickness || 1
        let width = orientation === "horizontal" ? length : thickness
        let height = orientation === "horizontal" ? thickness : length
        if (config.style && config.style.boxed) {
            width += 2
            height += 2
        }
        const pv = { x: config.x, y: config.y, width, height } as PhisicalValues
        super({
            id: config.id, visible: config.visible || true, attributes: pv, children: new InPageWidgetBuilder()
        })
        this.id = config.id
        this.theme = config.style?.theme || this.theme
        this.enabled = config.enabled || true
        this.onValueChanged = config.onValueChanged || (() => { })
        this.style = config.style? { ...this.style, ...config.style } : this.style
        this.draggable = config.draggable || false
        this.interactive = config.interactive || false
        this.length = length
        this.thickness = thickness
        this.orientation = orientation
        this.increment = config.increment || 1
        this.value = config.value || 0
        this.max = config.max || 100
        this.min = config.min || 0
        this.label = config.label || ""
        this.unit = config.unit || undefined

        if (this.interactive) {
            this.on("relativeMouse", (event) => {
                if (!this.enabled) {
                    return
                }
                if (event.name === "MOUSE_LEFT_BUTTON_PRESSED") {
                    this.status = "selected"
                    this.update()
                    this.emit("click")
                }
                if (event.name === "MOUSE_LEFT_BUTTON_RELEASED") {
                    this.status = "hovered"
                    this.update()
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
                        //this.update()
                    }
                }
                if (event.name === "MOUSE_WHEEL_DOWN") {
                    if (this.value > this.min + 1) {
                        this.value -= this.increment
                    } else {
                        this.value = this.min
                    }
                    this.emit("valueChanged", this.value)
                    if (this.onValueChanged) this.onValueChanged.call(this, this.value)
                    this.update()
                }
                if (event.name === "MOUSE_WHEEL_UP") {
                    if (this.value < this.max - 1) {
                        this.value += this.increment
                    } else {
                        this.value = this.max
                    }
                    this.emit("valueChanged", this.value)
                    if (this.onValueChanged) this.onValueChanged.call(this, this.value)
                    this.update()
                }
            })
            this.on("hoverOut", () => {
                this.status = "normal"
                //this.update()
            })
        }

        this.update()
    }

    /**
     * @description This method is used to render the Progress. It only returns the styled element of the Progress Bar and not the container.
     * The progress bar is calculated based on the value, min and max.
     * It's drawn using the drawingChars property. It uses the full block character and in the last block it uses one of the fractions of the block.
     * for example: ████████▌ (the last block is half full).
     * Every block can have 8 different states: 100%, 90%, 75%, 60%, 50%, 40%, 25% and 10%.
     * So the whole bar should be divided by the the number of blocks multiplied by 8.
     * @returns {SimplifiedStyledElement[][]} The styled element array of the Progress Bar.
     * 
     * @example ```js
     * const p = this.getProgress() // returns the styled element array of the Progress Bar.
     * // p = [ {text: "▓▓▓▓▓▓▓▓▓▓", style: {background: "bgBlack", color: "white", bold: true}} ]
     * ```
     * @memberof Progress
     */
    private getProgress: () => SimplifiedStyledElement[][] = (): SimplifiedStyledElement[][] => {
        const styledProgress = [[]] as SimplifiedStyledElement[][]
        let percentage = (this.value / this.max) * 100
        if (percentage > 100) percentage = 100
        if (percentage < 0) percentage = 0

        const length = this.length
        const blocks = length * 8
        const blocksToFill = Math.round((percentage / 100) * blocks)
        // Now we need to calculate the percentage of the last block and it should be casted to one of the keys of the drawingChars.horizontal object.
        const lastBlockPercentage = Math.round((blocksToFill % 8) * 10)
        const fullBlocks = Math.floor(blocksToFill / 8)
        let emptyBlocks = length - fullBlocks - 1
        if (lastBlockPercentage === 0) {
            emptyBlocks = length - fullBlocks
            for (let i = 0; i < fullBlocks; i++) {
                styledProgress[0].push({
                    text: drawingChars[this.theme][this.orientation][100].char,
                    color: drawingChars[this.theme][this.orientation][100].color || this.style.color
                } as SimplifiedStyledElement)
            }
        } else {
            const lastBlockPercentageKey = Number(Object.keys(drawingChars[this.theme][this.orientation]).find(key => Number(key) >= lastBlockPercentage))
            const lastBlockPercentageValue = drawingChars[this.theme][this.orientation][Number(lastBlockPercentageKey)].char
            for (let i = 0; i < fullBlocks; i++) {
                styledProgress[0].push({
                    text: drawingChars[this.theme][this.orientation][100].char,
                    color: drawingChars[this.theme][this.orientation][100].color || this.style.color,
                } as SimplifiedStyledElement)
            }
            styledProgress[0].push({
                text: lastBlockPercentageValue,
                color: drawingChars[this.theme][this.orientation][lastBlockPercentageKey].color || this.style.color
            } as SimplifiedStyledElement)
        }
        for (let i = 0; i < emptyBlocks; i++) {
            styledProgress[0].push({
                text: drawingChars[this.theme][this.orientation][0].char,
                color: drawingChars[this.theme][this.orientation][0].color || this.style.color
            })
        }
        // copy each block to the other rows of the progress bar (thickness)
        for (let i = 1; i < this.thickness; i++) {
            styledProgress.push([...styledProgress[0]])
        }
        return styledProgress
    }

    /**
     * @description This method is used to render the Progress. It returns the styled element of the Progress Bar and the container.
     * 
     * @returns {Progress} 
     * @memberof Progress
     */
    public update = (): Progress => {
        const progress = this.getProgress()

        if (this.style.boxed) {
            if (Object.keys(drawingChars[this.theme].block.boxDrawing).includes("start")) {
                progress[0].unshift({ text: drawingChars[this.theme].block.boxDrawing.start, color: drawingChars[this.theme].block.boxDrawing.color, bold: true })
                progress[0].push({ text: drawingChars[this.theme].block.boxDrawing.end, color: drawingChars[this.theme].block.boxDrawing.color, bold: true })
            } else {
                // disable eslint because we need to add the box drawing characters to the progress bar
                let ch = {} as typeof boxChars.normal
                if (this.orientation === "vertical") {
                    const boxC = JSON.parse(JSON.stringify(drawingChars[this.theme].block.boxDrawing))
                    // rotate the box drawing characters 90 degrees counter clockwise
                    ch = {
                        topLeft: boxC.bottomLeft,
                        topRight: boxC.topLeft,
                        bottomLeft: boxC.bottomRight,
                        bottomRight: boxC.topRight,
                        horizontal: boxC.vertical,
                        vertical: boxC.horizontal,
                        cross: boxC.cross,
                        left: boxC.bottom,
                        right: boxC.top,
                        top: boxC.left,
                        bottom: boxC.right
                    } as typeof boxChars.normal
                } else {
                    ch = drawingChars[this.theme].block.boxDrawing
                }

                progress.unshift([{ text: ch.topLeft, color: this.style.borderColor }])
                for (let i = 0; i < this.length; i++) {
                    progress[0].push({ text: ch.horizontal, color: this.style.borderColor })
                }
                progress[0].push({ text: ch.topRight, color: this.style.borderColor })
                // add vertical char before and after the progress bar
                for (let i = 0; i < this.thickness; i++) {
                    progress[i + 1].unshift({ text: ch.vertical, color: this.style.borderColor })
                    progress[i + 1].push({ text: ch.vertical, color: this.style.borderColor })
                }
                // add the last line
                progress.push([{ text: ch.bottomLeft, color: this.style.borderColor }])
                for (let i = 0; i < this.length; i++) {
                    progress[1 + this.thickness].push({ text: ch.horizontal, color: this.style.borderColor })
                }
                progress[1 + this.thickness].push({ text: ch.bottomRight, color: this.style.borderColor })
            }
        }

        // Add the text, value and percentage to the progress bar
        const size = progress.length
        const singleLine = size === 1
        const perc = Math.round((this.value / this.max) * 100)

        this.getContent().clear()
        if (this.orientation === "horizontal") {
            if (singleLine) {
                if (this.style.showTitle) progress[0].unshift({ text: this.label, ...drawingChars[this.theme].block.labelStyle } as SimplifiedStyledElement)
                if (this.style.showValue) {
                    progress[0].push({ text: `${this.value.toFixed(2)}${this.unit ? this.unit : ""}`, ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement)
                    if (this.style.showPercentage) progress[0].push({ text: "/", ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement)
                }
                if (this.style.showPercentage) progress[0].push({ text: `${perc}%`, ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement)
                if (this.style.showMinMax) progress.push([{ text: `(${this.min}/${this.max})`, ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement])
            } else {
                // all texts are added to a new line on the bottom of the progress bar
                const textLine = [] as SimplifiedStyledElement[]
                if (this.style.showTitle) textLine.push({ text: this.label, ...drawingChars[this.theme].block.labelStyle } as SimplifiedStyledElement)
                let valuesString = " "
                if (this.style.showValue) valuesString += `${this.value.toFixed(2)}${this.unit ? this.unit : ""}`
                if (this.style.showPercentage) valuesString += ` ${perc}%`
                if (this.style.showMinMax) valuesString += ` (${this.min}/${this.max})`
                if (valuesString.length > 0) textLine.push({ text: valuesString, ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement)
                
                progress.push(textLine)
            } 
            this.absoluteValues.height = progress.length
            this.absoluteValues.width = progress[0].length
            progress.forEach((row: SimplifiedStyledElement[]) => {
                this.getContent().addRow(... row)
            })
        } else {
            this.absoluteValues.height = progress[0].length
            this.absoluteValues.width = progress.length
            // reverse the progress bar
            for (let i = progress[0].length - 1; i >= 0; i--) {
                const row: SimplifiedStyledElement[] = []
                const newthickness = progress.length
                for (let j = 0; j < newthickness; j++) {
                    row.push(progress[j][i])
                }
                this.getContent().addRow(... row)
            }
            const textLine = [] as SimplifiedStyledElement[]
            if (this.style.showTitle) textLine.push({ text: this.label, ...drawingChars[this.theme].block.labelStyle } as SimplifiedStyledElement)
            let valuesString = " "
            if (this.style.showValue) valuesString += `${this.value.toFixed(2)}${this.unit ? this.unit : ""}`
            if (this.style.showPercentage) valuesString += ` ${perc}%`
            if (this.style.showMinMax) valuesString += ` (${this.min}/${this.max})`
            if (valuesString.length > 0) textLine.push({ text: valuesString, ...drawingChars[this.theme].block.valueStyle } as SimplifiedStyledElement)
            this.getContent().addRow(... textLine)
        }
        this.CM.refresh()
        return this
    }

    /**
     * @description Get the maximum value of the progress bar
     * 
     * @returns {number} The maximum value of the progress bar
     * @memberof ProgressBar
     */
    public getMax = (): number => this.max

    /**
     * @description Get the minimum value of the progress bar
     *
     * @returns {number} The minimum value of the progress bar
     * @memberof Progress
     */
    public getMin = (): number => this.min

    /**
     * @description Get the value of the progress bar
     *
     * @returns {number} The value of the progress bar
     * @memberof Progress
     */
    public getValue = (): number => this.value

    /**
     * @description Get the length of the progress bar
     *
     * @returns {number} The length of the progress bar
     * @memberof Progress
     */
    public getLength = (): number => this.length

    /**
     * @description Get the progress bar thickness
     *
     * @returns {number} The progress bar thickness
     * @memberof Progress
     */
    public getThickness = (): number => this.thickness
    
    /**
     * @description Get the increment value
     *
     * @returns {number} The increment value
     * @memberof Progress
     */
    public getIncrement = (): number => this.increment    

    /**
     * @description Sets the increment value
     *
     * @param {number} value The increment value
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setIncrement = (value: number) => {
        {
            const notNonNegativeNumber = typeof value !== "number" || Number.isNaN(value) || value <= 0
            if (notNonNegativeNumber) throw new TypeError("The \"increment\" value must a nonnegative number.")
        }

        this.increment = value
        return this
    }

    /**
     * @description Sets the value of the progress bar
     *
     * @param {number} length The length of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setLength = (length: number) => {
        this.length = length
        if (this.orientation === "horizontal") {
            this.absoluteValues.width = length + (this.style.boxed ? 2 : 0)
        } else {
            this.absoluteValues.height = length + (this.style.boxed ? 2 : 0)
        }
        this.update()
        return this
    }

    /**
     * @description Sets the thickness of the progress bar
     *
     * @param {number} thickness The thickness of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setThickness = (thickness: number) => {
        this.thickness = thickness
        if (this.orientation === "horizontal") {
            this.absoluteValues.width = thickness + (this.style.boxed ? 2 : 0)
        } else {
            this.absoluteValues.height = thickness + (this.style.boxed ? 2 : 0)
        }
        this.update()
        return this
    }

    /**
     * @description Sets the value of the progress bar
     *
     * @param {number} value The value of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setValue = (value: number) => {
        if (value !== this.value) {
            this.value = value
            this.update()
        }
        return this
    }

    /**
     * @description Sets the maximum value of the progress bar
     *
     * @param {number} max The maximum value of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setMax = (max: number) => {
        if (max !== this.max) {
            this.max = max
            this.update()
        }
        return this
    }

    /**
     * @description Set the minimum value of the progress bar
     *
     * @param {number} min The minimum value of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setMin = (min: number) => {
        if (min !== this.min) {
            this.min = min
            this.update()
        }
        return this
    }

    /**
     * @description Sets the progress bar label and updates the progress bar
     *
     * @param {string} label The text of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setLabel = (label: string) => {
        this.label = label
        this.update()
        return this
    }

    /**
     * @description Sets the style of the progress bar and updates it
     *
     * @param {ProgressStyle} style The style of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setStyle = (style: ProgressStyle) => {
        this.style = style
        this.update()
        return this
    }

    /**
     * @description Sets the enabled state of the progress bar (if interactive)
     *
     * @param {boolean} enabled The enabled state of the progress bar
     * @returns {Progress} The progress bar instance
     * @memberof Progress
     */
    public setEnabled = (enabled: boolean) => {
        this.enabled = enabled
        this.update()
        return this
    }
}

export default Progress
