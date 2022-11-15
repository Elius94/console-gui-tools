import { EventEmitter } from "events"
import chalk from "chalk"
import { StyledElement, StyleObject } from "./PageBuilder.js"
chalk.level = 1

/**
 * @description The type containing all the possible styles for the text and the index array.
 * @typedef {Object} StyleIndexObject
 * @prop {Array<number>} index - The index of the style in the style array.
 * 
 * @interface StyleIndexObject
 * @extends {StyleObject}
 */
interface StyleIndexObject extends StyleObject {
    index: [number, number];
}

/**
 * @description The type containing all the possible styles for the text and the index array and the text.
 * @typedef {Object} StyledElementWithIndex
 * @prop {string} text - The text of the styled element.
 * @prop {StyleIndexObject[]} styleIndex - The styles array with index.
 * 
 * @interface StyledElementWithIndex
 */
interface StyledElementWithIndex {
    text: string;
    styleIndex: StyleIndexObject[];
}

/**
 * @class Screen
 * @description This class is used to manage the screen buffer.
 * @param {object} Terminal - The terminal object (process.stdout).
 * @extends EventEmitter
 * @example const screen = new Screen(process.stdout)
 */
export class Screen extends EventEmitter {
    Terminal: NodeJS.WriteStream
    width: number
    height: number
    buffer: StyledElementWithIndex[]
    cursor: { x: number; y: number }
    currentY = 0

    constructor(_Terminal: NodeJS.WriteStream) {
        super()
        this.Terminal = _Terminal

        /** @const {number} width - The width of the screen. */
        this.width = this.Terminal.columns

        /** @const {number} height - The height of the screen. */
        this.height = this.Terminal.rows

        /** @const {Array} buffer - The screen buffer object. */
        this.buffer = []

        /** @const {object} cursor - The cursor object. */
        this.cursor = { x: 0, y: 0 }
    }

    /**
     * @description This method is used to write or overwrite a row in the screen buffer at a specific position.
     * @param {arguments<object>} args - The row to write.
     * @returns {void}
     * @memberOf Screen
     * @example screen.write({ text: 'Hello World', color: 'white' })
    screen.write({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    write(...args: StyledElement[]): void {
        this.currentY++
        if (this.cursor.y < this.buffer.length) {
            let row = ""
            const newStyleIndex = []
            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                if (arg.text !== undefined) {
                    const txt = arg.text.toString()
                    const style: StyleIndexObject = { ...arg.style, index: [row.length, row.length + txt.length] }
                    newStyleIndex.push(style)
                    row += txt
                }
            }
            const currentStyleIndex = this.buffer[this.cursor.y].styleIndex

            // Now recalculate the styleIndex for the current row mixing the old one with the new one
            // Create a new styleIndex merging the old one with the new one
            const mergedStyleIndex = this.mergeStyles(newStyleIndex, currentStyleIndex, this.cursor.x, row.length)

            this.buffer[this.cursor.y].styleIndex = mergedStyleIndex
            this.buffer[this.cursor.y].text = this.replaceAt(this.buffer[this.cursor.y].text, this.cursor.x, row)
            this.cursorTo(0, this.cursor.y + 1)
        }
    }

    /**
     * @description This method is used to change the cursor position.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @returns {void}
     * @memberOf Screen
     * @example screen.cursorTo(0, 0)
     */
    cursorTo(x: number, y: number): void {
        this.cursor.x = x
        this.cursor.y = y
    }

    /**
     * @description This method is used to change the Terminal cursor position.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @returns {void}
     * @memberOf Screen
     * @example screen.moveCursor(0, 0)
     */
    moveCursor(x: number, y: number): void {
        this.Terminal.cursorTo(x, y)
    }

    /**
     * @description This method is used to clear the screen. It fills the screen buffer with empty rows with the size of the screen.
     * @returns {void}
     * @memberOf Screen
     * @example screen.clear()
     */
    update(): void {
        this.cursorTo(0, 0)
        this.width = this.Terminal.columns
        this.height = this.Terminal.rows
        this.buffer = []
        for (let i = 0; i < this.Terminal.rows; i++) {
            this.buffer[i] = { text: " ".repeat(this.Terminal.columns), styleIndex: [{ color: "gray", bg: "", italic: false, bold: false, index: [0, this.Terminal.columns] }] }
        }
    }

    /**
     * @description This method is used to print the screen buffer to the terminal. It also converts the styles to the terminal format using Chalk.
     * @returns {void}
     * @memberOf Screen
     * @example screen.print()
     */
    print(): void {
        this.buffer.forEach((row, i) => {
            this.Terminal.cursorTo(0, i)
            let outString = ""

            // convert styleIndex to chalk functions and apply them to the row text
            row.styleIndex.forEach(style => {
                const color = style.color ? chalk[style.color] : (_in: string): string => _in
                const bg = style.bg ? chalk[style.bg] : (_in: string): string => _in
                const italic = style.italic ? chalk.italic : (_in: string): string => _in
                const bold = style.bold ? chalk.bold : (_in: string): string => _in
                const dim = style.dim ? chalk.dim : (_in: string): string => _in
                const underline = style.underline ? chalk.underline : (_in: string): string => _in
                const overline = style.overline ? chalk.overline : (_in: string): string => _in
                const inverse = style.inverse ? chalk.inverse : (_in: string): string => _in
                const hidden = style.hidden ? chalk.hidden : (_in: string): string => _in
                const strikethrough = style.strikethrough ? chalk.strikethrough : (_in: string): string => _in
                outString += color(bg(italic(bold(dim(underline(overline(inverse(hidden(strikethrough(row.text.substring(style.index[0], style.index[1])))))))))))
            })
            this.Terminal.write(outString)
        })
        this.Terminal.clearScreenDown()
    }

    /**
     * @description This method is used to insert a substring into a string at a specific position.
     * @param {string} str - The string to insert into.
     * @param {number} index - The position to insert the substring.
     * @param {string} replacement - The substring to insert.
     * @returns {string}
     * @memberOf Screen
     * @example screen.replaceAt('Hello Luca', 6, 'Elia') // returns 'Hello Elia'
     */
    replaceAt(str: string, index: number, replacement: string): string {
        return str.substring(0, index) + replacement + str.substring(index + replacement.length)
    }

    /**
     * @description This method is used to merge two styleIndex arrays into one. It also recalculates the indexes for the new row.
     * @param {Array<StyleIndexObject>} newStyleIndex - The new styleIndex array.
     * @param {Array<StyleIndexObject>} currentStyleIndex - The current styleIndex array.
     * @param {number} startIndex - The start index of the new styleIndex array (Usually the cursor.x).
     * @param {number} newSize - The new size of the string.
     * @returns {Array<StyleIndexObject>}
     * @memberOf Screen
     * @example screen.mergeStyles([{ color: 'red', bg: 'black', italic: false, bold: false, index: [0, 5] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [6, 10] }], [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 30] }], 5, 15)
     * returns [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 4] }, { color: 'red', bg: 'black', italic: false, bold: false, index: [5, 10] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [11, 15] }, { color: 'magenta', bg: 'black', italic: false, bold: false, index: [16, 30] }]
     */
    mergeStyles(newStyleIndex: Array<StyleIndexObject>, currentStyleIndex: Array<StyleIndexObject>, startIndex: number, newSize: number): Array<StyleIndexObject> {
        const new_ = [...newStyleIndex]
        const current = [...currentStyleIndex]
        const offset = startIndex
        const _newSize = newSize
        const merged: StyleIndexObject[] = []
        current.forEach(style => {
            if (style.index[0] < offset && style.index[1] < offset) {
                merged.push(style)
                return
            } else if (style.index[0] < offset && style.index[1] >= offset && style.index[1] <= offset + _newSize) {
                merged.push({ ...style, index: [style.index[0], offset] })
                return
            } else if (style.index[0] < offset && style.index[1] > offset + _newSize) {
                merged.push({ ...style, index: [style.index[0], offset] })
                merged.push({ ...style, index: [offset + _newSize, style.index[1]] })
                return
            } else if (style.index[0] >= offset && style.index[1] <= offset + _newSize) {
                // Do nothing
                return
            } else if (style.index[0] >= offset && style.index[0] <= offset + _newSize && style.index[1] > offset + _newSize) {
                merged.push({ ...style, index: [offset + _newSize, style.index[1]] })
                return
            } else if (style.index[0] > offset + _newSize && style.index[1] > offset + _newSize) {
                merged.push(style)
                return
            }
            this.emit("error", new Error("mergeStyles: This should never happen"))
        })

        // Then add the new style to the merged array
        new_.forEach(newStyle => {
            merged.push({ ...newStyle, index: [newStyle.index[0] + offset, newStyle.index[1] + offset] })
        })

        // Sort the merged array by index[0]
        merged.sort(this.sortByIndex)
        return merged
    }

    /**
     * @description This method is used to sort an array of styleIndex objects by child index[0].
     * @param {StyleIndexObject} a - The first object to compare.
     * @param {StyleIndexObject} b - The second object to compare.
     * @returns {number}
     * @memberOf Screen
     * @example merged.sort(this.sortByIndex)
     */
    sortByIndex(a: StyleIndexObject, b: StyleIndexObject): number {
        if (a.index[0] < b.index[0]) {
            return -1
        } else if (a.index[0] > b.index[0]) {
            return 1
        } else {
            return 0
        }
    }
}

export default Screen