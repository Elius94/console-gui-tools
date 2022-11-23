import { BackgroundColorName, ForegroundColorName } from "chalk"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, SimplifiedStyledElement/*, truncate*/ } from "../Utils.js"
import Control from "./Control.js"


export const drawingChars = {
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
        },
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
        },
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
            100: { char: "│", color: "green" },
            75: { char: "│", color: "yellow" },
            50: { char: "│", color: "blue" },
            25: { char: "│", color: "red" },
            0: { char: " ", color: undefined }
        },
        vertical: {
            100: { char: "─", color: "green" },
            75: { char: "─", color: "yellow" },
            50: { char: "─", color: "blue" },
            25: { char: "─", color: "red" },
            0: { char: " ", color: undefined }
        },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                left: "[",
                right: "]"
            },
            labelStyle: { color: "cyan", bold: false },
            valueStyle: { color: "gray", dim: true },
        }
    },
    "htop-heavy": {
        horizontal: {
            100: { char: "┃", color: "green" },
            75: { char: "┃", color: "yellow" },
            50: { char: "┃", color: "blue" },
            25: { char: "┃", color: "red" },
            0: { char: " ", color: undefined }
        },
        vertical: {
            100: { char: "━", color: "green" },
            75: { char: "━", color: "yellow" },
            50: { char: "━", color: "blue" },
            25: { char: "━", color: "red" },
            0: { char: " ", color: undefined }
        },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                color: "white",
                left: "[",
                right: "]"
            },
            labelStyle: { color: "cyan", bold: true },
            valueStyle: { color: "gray", dim: true }
        }
    },
    "htop": {
        horizontal: {
            100: { char: "|", color: "green" },
            75: { char: "|", color: "yellow" },
            50: { char: "|", color: "blue" },
            25: { char: "|", color: "red" },
            0: { char: " ", color: undefined }
        },
        vertical: {//―⎯
            100: { char: "―", color: "green" },
            75: { char: "―", color: "yellow" },
            50: { char: "―", color: "blue" },
            25: { char: "―", color: "red" },
            0: { char: " ", color: undefined }
        },
        block: {
            full: { char: "█", color: undefined },
            half: { char: "▓", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: {
                start: "[",
                end: "]"
            },
            labelStyle: { color: "cyan", bold: true },
            valueStyle: { color: "gray", dim: true }
        }
    }
}

export type Orientation = "horizontal" | "vertical";

export interface ProgressStyle {
    background: BackgroundColorName;
    borderColor: ForegroundColorName;
    textColor?: ForegroundColorName;
    color: ForegroundColorName;
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
 * - "click" when the user confirm
 * - "relese" when the user cancel
 * @param {string} id - The id of the Progress.
 * @param {number} length - The length of the Progress.
 * @param {number} thickness - The thickness of the Progress.
 * @param {number} x - The x position of the Progress.
 * @param {number} y - The y position of the Progress.
 * @param {ProgressStyle} style - The style of the Progress.
 * @param {keyof typeof drawingChars} theme - The theme of the Progress.
 * @param {string} orientation - The orientation of the Progress.
 * @param {boolean} interactive - If the Progress is interactive.
 * @param {boolean} visible - If the Progress is visible.
 * @param {boolean} enabled - If the Progress is enabled.
 * 
 * @example ```js
 * const pStyle = {
 *      boxed: true,
 *      showTitle: true,
 *      showValue: true,
 *      showPercentage: true,
 *      showMinMax: false,
 *  }
 *  const p = new Progress("prog1", 20, 1, 3, 23, pStyle, "htop", "horizontal")
 *  p.setText("Mem")
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
 *
 *  }
 *  const p1 = new Progress("prog2", 25, 2, 3, 25, p1Style, "precision", "horizontal")
 *  p1.setText("Precision")
 *  const incr1 = setInterval(() => {
 *      const value = p1.getValue() + 0.25
 *      p1.setValue(value)
 *      if (value >= p1.getMax()) {
 *          clearInterval(incr1)
 *      }
 *  }, 100)
 * ```
 */
export class Progress extends Control {
    private value = 0
    private max = 100
    private min = 0
    private length: number
    private thickness = 1
    private orientation: Orientation = "horizontal"
    interactive = false
    text = ""
    enabled = true
    theme = "precision"
    private style: ProgressStyle = {
        background: "bgBlack",
        borderColor: "white",
        color: "white",
        textColor: "white",
        bold: true,
        boxed: false,
    }
    status: "normal" | "hovered" | "selected" = "normal"

    public constructor(
        id: string,
        length: number,
        thickness: number,
        x: number,
        y: number,
        style: ProgressStyle,
        theme?: keyof typeof drawingChars,
        orientation: Orientation = "horizontal",
        interactive = false,
        visible = true,
        enabled = true) 
    {
        let width = orientation === "horizontal" ? length : thickness
        let height = orientation === "horizontal" ? thickness : length
        if (style.boxed) {
            width += 2
            height += 2
        }
        super(id, visible, { x, y, width, height }, new InPageWidgetBuilder())
        this.id = id
        this.theme = theme || this.theme
        this.style = style
        this.interactive = interactive
        this.enabled = enabled
        this.length = length
        this.thickness = thickness
        this.orientation = orientation

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
                })
            }
        } else {
            const lastBlockPercentageKey = Number(Object.keys(drawingChars[this.theme][this.orientation]).find(key => Number(key) >= lastBlockPercentage))
            const lastBlockPercentageValue = drawingChars[this.theme][this.orientation][lastBlockPercentageKey].char
            for (let i = 0; i < fullBlocks; i++) {
                styledProgress[0].push({
                    text: drawingChars[this.theme][this.orientation][100].char,
                    color: drawingChars[this.theme][this.orientation][100].color || this.style.color,
                })
            }
            styledProgress[0].push({
                text: lastBlockPercentageValue,
                color: drawingChars[this.theme][this.orientation][lastBlockPercentageKey].color || this.style.color
            })
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
     * @returns {SimplifiedStyledElement[][]} The styled element array of the Progress Bar.
     * @memberof Progress
     */
    public update = () => {
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
                    }
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
                if (this.style.showTitle) progress[0].unshift({ text: this.text, ...drawingChars[this.theme].block.labelStyle })
                if (this.style.showValue) progress[0].push({ text: this.value.toFixed(2), ...drawingChars[this.theme].block.valueStyle })
                if (this.style.showPercentage) progress[0].push({ text: `/${perc}%`, ...drawingChars[this.theme].block.valueStyle })
                if (this.style.showMinMax) progress.push([{ text: `(${this.min}/${this.max})`, ...drawingChars[this.theme].block.valueStyle }])
            } else {
                // all texts are added to a new line on the bottom of the progress bar
                const textLine = [] as SimplifiedStyledElement[]
                if (this.style.showTitle) textLine.push({ text: this.text, ...drawingChars[this.theme].block.labelStyle })
                let valuesString = " "
                if (this.style.showValue) valuesString += this.value.toFixed(2)
                if (this.style.showPercentage) valuesString += ` ${perc}%`
                if (this.style.showMinMax) valuesString += ` (${this.min}/${this.max})`
                if (valuesString.length > 0) textLine.push({ text: valuesString, ...drawingChars[this.theme].block.valueStyle })
                
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
            if (this.style.showTitle) textLine.push({ text: this.text, ...drawingChars[this.theme].block.labelStyle })
            let valuesString = " "
            if (this.style.showValue) valuesString += this.value.toFixed(2)
            if (this.style.showPercentage) valuesString += ` ${perc}%`
            if (this.style.showMinMax) valuesString += ` (${this.min}/${this.max})`
            if (valuesString.length > 0) textLine.push({ text: valuesString, ...drawingChars[this.theme].block.valueStyle })
            this.getContent().addRow(... textLine)
        }
        this.CM.refresh()
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
     * @description Sets the value of the progress bar
     *
     * @param {number} length The length of the progress bar
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
    }

    /**
     * @description Sets the thickness of the progress bar
     *
     * @param {number} thickness The thickness of the progress bar
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
    }

    /**
     * @description Sets the value of the progress bar
     *
     * @param {number} value The value of the progress bar
     * @memberof Progress
     */
    public setValue = (value: number) => {
        if (value !== this.value) {
            this.value = value
            this.update()
        }
    }

    /**
     * @description Sets the maximum value of the progress bar
     *
     * @param {number} max The maximum value of the progress bar
     * @memberof Progress
     */
    public setMax = (max: number) => {
        if (max !== this.max) {
            this.max = max
            this.update()
        }
    }

    /**
     * @description Set the minimum value of the progress bar
     *
     * @param {number} min The minimum value of the progress bar
     * @memberof Progress
     */
    public setMin = (min: number) => {
        if (min !== this.min) {
            this.min = min
            this.update()
        }
    }

    /**
     * @description Sets the progress bar text label and updates the progress bar
     *
     * @param {string} text The text label of the progress bar
     * @memberof Progress
     */
    public setText = (text: string) => {
        this.text = text
        this.update()
    }

    /**
     * @description Sets the style of the progress bar and updates it
     *
     * @param {ProgressStyle} style The style of the progress bar
     * @memberof Progress
     */
    public setStyle = (style: ProgressStyle) => {
        this.style = style
        this.update()
    }

    /**
     * @description Sets the enabled state of the progress bar (if interactive)
     *
     * @param {boolean} enabled The enabled state of the progress bar
     * @memberof Progress
     */
    public setEnabled = (enabled: boolean) => {
        this.enabled = enabled
        this.update()
    }
}

export default Progress