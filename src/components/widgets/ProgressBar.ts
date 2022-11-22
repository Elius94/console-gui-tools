import { BackgroundColorName, ForegroundColorName } from "chalk"
import InPageWidgetBuilder from "../InPageWidgetBuilder.js"
import { boxChars, SimplifiedStyledElement/*, truncate*/ } from "../Utils.js"
import Control from "./Control.js"

export type TextPosition = "before" | "after" | "right" | "left"
export type TextLine = "top" | "bottom" | "inline"


export const drawingChars = {
    "precision": {
        horizontal: {
            100: { char: "█", color: undefined },
            90: { char: "▉", color: undefined },
            75: { char: "▊", color: undefined },
            60: { char: "▋", color: undefined },
            50: { char: "▌", color: undefined },
            40: { char: "▍", color: undefined },
            25: { char: "▎", color: undefined },
            10: { char: "▏", color: undefined },
            0: { char: " ", color: undefined }
        },
        vertical: {
            100: { char: "█", color: undefined },
            90: { char: "▇", color: undefined },
            75: { char: "▆", color: undefined },
            60: { char: "▅", color: undefined },
            50: { char: "▄", color: undefined },
            40: { char: "▃", color: undefined },
            25: { char: "▂", color: undefined },
            10: { char: "▁", color: undefined },
            0: { char: " ", color: undefined }
        },
        block: {
            full: { char: "▓", color: undefined },
            half: { char: "▒", color: undefined },
            empty: { char: "░", color: undefined },
            boxDrawing: boxChars.normal
        },
        text: {
            label: { line: "bottom", position: "left"},
            value: { line: "bottom", position: "right"},
            percentage: { line: "bottom", position: "center"}
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
            }
        },
        text: {
            label: { line: "inline", position: "before"},
            value: { line: "inline", position: "right"},
            percentage: { line: "inline", position: "right"}
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
            }
        },
        text: {
            label: { line: "inline", position: "before"},
            value: { line: "inline", position: "right"},
            percentage: { line: "inline", position: "right"}
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
            }
        },
        text: {
            label: { line: "inline", position: "before"},
            value: { line: "inline", position: "right"},
            percentage: { line: "inline", position: "right"}
        }
    }
}

export type Orientation = "horizontal" | "vertical";

export interface ProgressStyle {
    background: BackgroundColorName;
    borderColor: ForegroundColorName;
    color: ForegroundColorName;
    theme?: keyof typeof drawingChars;
    boxed?: boolean;
    showPercentage?: boolean;
    showValue?: boolean;
    showMax?: boolean;
    showMin?: boolean;
    shotTitle?: boolean;
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
 * @description This class is an overload of Control that is used to create a Progress. 
 * 
 * ![Progress](https://user-images.githubusercontent.com/14907987/202866824-047503fc-9af6-4990-aa9a-57a3d691f6b0.gif)
 * 
 * Emits the following events: 
 * - "click" when the user confirm
 * - "relese" when the user cancel
 * @param {string} id - The id of the Progress.
 * @param {number} width - The width of the Progress.
 * @param {number} height - The height of the Progress.
 * @param {number} x - The x position of the Progress.
 * @param {number} y - The y position of the Progress.
 * @param {ProgressStyle} style - To set the style of the Progress.
 * @param {boolean} visible - If the Progress is visible. Default is true (make it hide using hide()).
 * @param {boolean} enabled - If the Progress is enabled. Default is true (make it disabled using disable()).
 * 
 * @example ```js
 * new Progress("progress1", "Run me!", 10, 3, 21, 18)
 * ```
 */
export class Progress extends Control {
    value = 0
    max = 100
    min = 0
    length: number
    thickness = 1
    private orientation: Orientation = "horizontal"
    interactive = false
    text = ""
    enabled = true
    theme = "precision"
    private style: ProgressStyle = {
        background: "bgBlack",
        borderColor: "white",
        color: "white",
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
        text = "",
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
        this.text = text
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
    private getProgress: () => SimplifiedStyledElement[][] = () => {
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

    public update = () => {
        //const absVal = this.absoluteValues
        /*let truncatedText = truncate(this.text, absVal.width - 2, false)
        
        // add a white space to the end of the truncated text if the sum of the length of the text and the width of the button is odd
        if ((truncatedText.length + (absVal.width - 2)) % 2 === 1) {
            truncatedText += " "
        }*/

        const progress = this.getProgress()

        if (this.style.boxed) {
            if (Object.keys(drawingChars[this.theme].block.boxDrawing).includes("start")) {
                progress[0].unshift({ text: drawingChars[this.theme].block.boxDrawing.start, color: drawingChars[this.theme].block.boxDrawing.color })
                progress[0].push({ text: drawingChars[this.theme].block.boxDrawing.end, color: drawingChars[this.theme].block.boxDrawing.color })
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

        this.getContent().clear()

        if (this.orientation === "horizontal") {
            progress.forEach((row: SimplifiedStyledElement[]) => {
                this.getContent().addRow(... row)
            })
        } else {
            // reverse the progress bar
            for (let i = progress[0].length - 1; i >= 0; i--) {
                const row: SimplifiedStyledElement[] = []
                const newthickness = progress.length
                for (let j = 0; j < newthickness; j++) {
                    row.push(progress[j][i])
                }
                this.getContent().addRow(... row)
            }
        }
        this.CM.refresh()
    }

    public setValue = (value: number) => {
        this.value = value
        this.update()
    }

    public setMax = (max: number) => {
        this.max = max
        this.update()
    }

    public setMin = (min: number) => {
        this.min = min
        this.update()
    }

    public setText = (text: string) => {
        this.text = text
        this.update()
    }

    public setStyle = (style: ProgressStyle) => {
        this.style = style
        this.update()
    }

    public setEnabled = (enabled: boolean) => {
        this.enabled = enabled
        this.update()
    }
}

export default Progress