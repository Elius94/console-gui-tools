import { EventEmitter } from "events"
import chalk from "chalk"
chalk.level = 1

/**
 * @class Screen
 * @description This class is used to manage the screen buffer.
 * @param {object} Terminal - The terminal object (process.stdout).
 * @extends EventEmitter
 * @example const screen = new Screen(process.stdout)
 */
export class Screen extends EventEmitter {
    constructor(_Terminal) {
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
     * @param {arguments<object>} row - The row to write.
     * @returns {void}
     * @memberOf Screen
     * @example screen.write({ text: 'Hello World', color: 'white' })
     * screen.write({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    write() {
        this.currentY++

        let row = ""
        let newStyleIndex = []
        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i]
            if (arg.text !== undefined) {
                const txt = arg.text.toString()
                let style = arg.style
                style.index = [row.length, row.length + txt.length]
                newStyleIndex.push(style)
                row += txt
            }
        }
        const currentStyleIndex = this.buffer[this.cursor.y].styleIndex

        // Now recalculate the styleIndex for the current row mixing the old one with the new one
        // Create a new styleIndex merging the old one with the new one
        let mergedStyleIndex = this.mergeStyles(newStyleIndex, currentStyleIndex, this.cursor.x, row.length)

        if (this.cursor.y < this.buffer.length - 1) {
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
    cursorTo(x, y) {
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
    moveCursor(x, y) {
        this.Terminal.cursorTo(x, y)
    }

    /**
     * @description This method is used to clear the screen. It fills the screen buffer with empty rows with the size of the screen.
     * @returns {void}
     * @memberOf Screen
     * @example screen.clear()
     */
    update() {
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
    print() {
        this.buffer.forEach((row, i) => {
            this.Terminal.cursorTo(0, i)
            let outString = ""

            // convert styleIndex to chalk functions and apply them to the row text
            row.styleIndex.forEach(style => {
                let color = style.color ? chalk[style.color] : (_in) => _in
                let bg = style.bg ? chalk[style.bg] : (_in) => _in
                let italic = style.italic ? chalk.italic : (_in) => _in
                let bold = style.bold ? chalk.bold : (_in) => _in
                let dim = style.dim ? chalk.dim : (_in) => _in
                let underline = style.underline ? chalk.underline : (_in) => _in
                let overline = style.overline ? chalk.overline : (_in) => _in
                let inverse = style.inverse ? chalk.inverse : (_in) => _in
                let hidden = style.hidden ? chalk.hidden : (_in) => _in
                let strikethrough = style.strikethrough ? chalk.strikethrough : (_in) => _in
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
    replaceAt(str, index, replacement) {
        return str.substring(0, index) + replacement + str.substring(index + replacement.length)
    }

    /**
     * @description This method is used to merge two styleIndex arrays into one. It also recalculates the indexes for the new row.
     * @param {Array<object>} newStyleIndex - The new styleIndex array.
     * @param {Array<object>} currentStyleIndex - The current styleIndex array.
     * @param {number} startIndex - The start index of the new styleIndex array (Usually the cursor.x).
     * @param {number} newSize - The new size of the string.
     * @returns {Array<object>}
     * @memberOf Screen
     * @example screen.mergeStyles([{ color: 'red', bg: 'black', italic: false, bold: false, index: [0, 5] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [6, 10] }], [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 30] }], 5, 15)
     * returns [{ color: 'magenta', bg: 'black', italic: false, bold: false, index: [0, 4] }, { color: 'red', bg: 'black', italic: false, bold: false, index: [5, 10] }, { color: 'white', bg: 'black', italic: false, bold: false, index: [11, 15] }, { color: 'magenta', bg: 'black', italic: false, bold: false, index: [16, 30] }]
     */
    mergeStyles(_new, _current, _offset, _newSize) {
        let new_ = [..._new]
        let current = [..._current]
        let offset = _offset
        let newSize = _newSize
        let merged = []
        current.forEach(style => {
            if (style.index[0] < offset && style.index[1] < offset) {
                merged.push(style)
                return
            } else if (style.index[0] < offset && style.index[1] >= offset && style.index[1] <= offset + newSize) {
                merged.push({ ...style, index: [style.index[0], offset] })
                return
            } else if (style.index[0] < offset && style.index[1] > offset + newSize) {
                merged.push({ ...style, index: [style.index[0], offset] })
                merged.push({ ...style, index: [offset + newSize, style.index[1]] })
                return
            } else if (style.index[0] >= offset && style.index[1] <= offset + newSize) {
                // Do nothing
                return
            } else if (style.index[0] >= offset && style.index[0] <= offset + newSize && style.index[1] > offset + newSize) {
                merged.push({ ...style, index: [offset + newSize, style.index[1]] })
                return
            } else if (style.index[0] > offset + newSize && style.index[1] > offset + newSize) {
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
     * @param {object} a - The first object to compare.
     * @param {object} b - The second object to compare.
     * @returns {number}
     * @memberOf Screen
     * @example merged.sort(this.sortByIndex)
     */
    sortByIndex(a, b) {
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