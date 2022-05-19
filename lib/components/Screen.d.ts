/**
 * @class Screen
 * @description This class is used to manage the screen buffer.
 * @param {object} Terminal - The terminal object (process.stdout).
 * @extends EventEmitter
 * @example const screen = new Screen(process.stdout)
 */
export class Screen extends EventEmitter {
    constructor(_Terminal: any);
    Terminal: any;
    /** @const {number} width - The width of the screen. */
    width: any;
    /** @const {number} height - The height of the screen. */
    height: any;
    /** @const {Array} buffer - The screen buffer object. */
    buffer: any[];
    /** @const {object} cursor - The cursor object. */
    cursor: {
        x: number;
        y: number;
    };
    /**
     * @description This method is used to write or overwrite a row in the screen buffer at a specific position.
     * @param {arguments<object>} row - The row to write.
     * @returns {void}
     * @memberOf Screen
     * @example screen.write({ text: 'Hello World', color: 'white' })
     * screen.write({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    write(...args: any[]): void;
    /**
     * @description This method is used to change the cursor position.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @returns {void}
     * @memberOf Screen
     * @example screen.cursorTo(0, 0)
     */
    cursorTo(x: number, y: number): void;
    /**
     * @description This method is used to change the Terminal cursor position.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @returns {void}
     * @memberOf Screen
     * @example screen.moveCursor(0, 0)
     */
    moveCursor(x: number, y: number): void;
    /**
     * @description This method is used to clear the screen. It fills the screen buffer with empty rows with the size of the screen.
     * @returns {void}
     * @memberOf Screen
     * @example screen.clear()
     */
    update(): void;
    /**
     * @description This method is used to print the screen buffer to the terminal. It also converts the styles to the terminal format using Chalk.
     * @returns {void}
     * @memberOf Screen
     * @example screen.print()
     */
    print(): void;
    /**
     * @description This method is used to insert a substring into a string at a specific position.
     * @param {string} str - The string to insert into.
     * @param {number} index - The position to insert the substring.
     * @param {string} replacement - The substring to insert.
     * @returns {string}
     * @memberOf Screen
     * @example screen.replaceAt('Hello Luca', 6, 'Elia') // returns 'Hello Elia'
     */
    replaceAt(str: string, index: number, replacement: string): string;
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
    mergeStyles(_new: any, _current: any, _offset: any, _newSize: any): Array<object>;
    /**
     * @description This method is used to sort an array of styleIndex objects by child index[0].
     * @param {object} a - The first object to compare.
     * @param {object} b - The second object to compare.
     * @returns {number}
     * @memberOf Screen
     * @example merged.sort(this.sortByIndex)
     */
    sortByIndex(a: object, b: object): number;
}
export default Screen;
import { EventEmitter } from "events";
