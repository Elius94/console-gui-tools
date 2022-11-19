import { BackgroundColorName, ForegroundColorName } from "chalk"

/**
 * @description The type containing all the possible styles for the text.
 * 
 * @typedef {Object} StyleObject
 * @prop {chalk.ForegroundColorName | ""} [color] - The color of the text taken from the chalk library.
 * @prop {chalk.BackgroundColorName | ""} [backgroundColor] - The background color of the text taken from the chalk library.
 * @prop {boolean} [italic] - If the text is italic.
 * @prop {boolean} [bold] - If the text is bold.
 * @prop {boolean} [dim] - If the text is dim.
 * @prop {boolean} [underline] - If the text is underlined.
 * @prop {boolean} [inverse] - If the text is inverse.
 * @prop {boolean} [hidden] - If the text is hidden.
 * @prop {boolean} [strikethrough] - If the text is strikethrough.
 * @prop {boolean} [overline] - If the text is overlined.
 * 
 * @example const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
 *
 * @export
 * @interface StyleObject
 */
export interface StyleObject {
    color?: ForegroundColorName | "";
    bg?: BackgroundColorName | "";
    italic?: boolean;
    bold?: boolean;
    dim?: boolean;
    underline?: boolean;
    inverse?: boolean;
    hidden?: boolean;
    strikethrough?: boolean;
    overline?: boolean;
}

/**
 * @description The type of the single styled text, stored in a line of the PageBuilder.
 * 
 * @typedef {Object} StyledElement
 * @prop {string} text - The text of the styled text.
 * @prop {StyleObject} style - The style of the styled text.
 * 
 * @example const styledText = { text: "Hello", style: { color: "red", backgroundColor: "blue", bold: true, italic: true } }
 *
 * @export
 * @interface StyledElement
 */
export interface StyledElement {
    text: string;
    style: StyleObject;
}

/**
 * @description The type containing all the possible styles for the text and the text on the same level. It's used on the higher level.
 * 
 * @typedef {Object} SimplifiedStyledElement
 * @prop {string} text - The text of the styled text.
 * @prop {chalk.ForegroundColorName | ""} [color] - The color of the text taken from the chalk library.
 * @prop {chalk.BackgroundColorName | ""} [backgroundColor] - The background color of the text taken from the chalk library.
 * @prop {boolean} [italic] - If the text is italic.
 * @prop {boolean} [bold] - If the text is bold.
 * @prop {boolean} [dim] - If the text is dim.
 * @prop {boolean} [underline] - If the text is underlined.
 * @prop {boolean} [inverse] - If the text is inverse.
 * @prop {boolean} [hidden] - If the text is hidden.
 * @prop {boolean} [strikethrough] - If the text is strikethrough.
 * @prop {boolean} [overline] - If the text is overlined.
 * 
 * @example const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
 *
 * @export
 * @interface SimplifiedStyledElement
 */
export interface SimplifiedStyledElement {
    text: string;
    color?: ForegroundColorName | "";
    bg?: BackgroundColorName | "";
    italic?: boolean;
    bold?: boolean;
    dim?: boolean;
    underline?: boolean;
    inverse?: boolean;
    hidden?: boolean;
    strikethrough?: boolean;
    overline?: boolean;
}

export interface PhisicalValues {
    x: number
    y: number
    width: number
    height: number
    id?: number
}

// TODO: if there are more kind of drawing, add them here like theme, adding a sub array for each kind of drawing
export const boxChars = {
    normal: {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "─",
        vertical: "│",
        cross: "┼",
        left: "├",
        right: "┤",
        top: "┬",
        bottom: "┴"
    },
    selected: {
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        horizontal: "═",
        vertical: "║",
        cross: "╬",
        left: "╠",
        right: "╣",
        top: "╦",
        bottom: "╩"
    },
    hovered: {
        topLeft: "╓",
        topRight: "╖",
        bottomLeft: "╙",
        bottomRight: "╜",
        horizontal: "─",
        vertical: "│",
        cross: "╫",
        left: "╟",
        right: "╢",
        top: "╥",
        bottom: "╨"
    }
}

/**
 * @description This function is used to truncate a string adding ... at the end.
 * @param {string} str - The string to truncate.
 * @param {number} n - The number of characters to keep.
 * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
 * @example CM.truncate("Hello world", 5, true) // "Hello..."
 */
export function truncate(str: string, n: number, useWordBoundary: boolean): string {
    if (str.length <= n) { return str }
    const subString = str.substring(0, n - 1) // the original check
    return (useWordBoundary ?
        subString.substring(0, subString.lastIndexOf(" ")) :
        subString) + "…"
}