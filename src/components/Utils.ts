import { BackgroundColorName, ForegroundColorName } from "chalk"

/**
 * @typedef {string} HEX - The type of the HEX color.
 * @example const hexColor = "#FF0000"
 *
 * @typedef {string} RGB - The type of the RGB color.
 * @example const rgbColor = "rgb(255, 0, 0)"
 */
export type HEX = `#${string}`;
export type RGB =
  | `rgb(${number}, ${number}, ${number})`
  | `rgb(${number},${number},${number})`;

/**
 * @description The type containing all the possible styles for the text.
 *
 * @typedef {Object} StyleObject
 * @prop {chalk.ForegroundColorName | HEX | RGB | ""} [color] - The color of the text taken from the chalk library.
 * @prop {chalk.BackgroundColorName | HEX | RGB | ""} [backgroundColor] - The background color of the text taken from the chalk library.
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
// @type definition
export interface StyleObject {
  color?: ForegroundColorName | HEX | RGB | "";
  bg?: BackgroundColorName | HEX | RGB | "";
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
// @type definition
export interface StyledElement {
  text: string;
  style: StyleObject;
}

/**
 * @description The type containing all the possible styles for the text and the text on the same level. It's used on the higher level.
 *
 * @typedef {Object} SimplifiedStyledElement
 * @prop {string} text - The text of the styled text.
 * @prop {chalk.ForegroundColorName | HEX | RGB | ""} [color] - The color of the text taken from the chalk library.
 * @prop {chalk.BackgroundColorName | HEX | RGB | "" | ""} [backgroundColor] - The background color of the text taken from the chalk library.
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
// @type definition
export interface SimplifiedStyledElement {
  text: string;
  color?: ForegroundColorName | HEX | RGB | "";
  bg?: BackgroundColorName | HEX | RGB | "" | "";
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
 * @description The type that contains the phisical values of an element (x, y, width, height)
 *
 * @export
 * @interface PhisicalValues
 */
// @type definition
export interface PhisicalValues {
  x: number;
  y: number;
  width: number;
  height: number;
  id?: number;
}

/** @const {Object} boxChars - The characters used to draw the box. */
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
        bottom: "┴",
        start: "",
        end: "",
        color: "" as ForegroundColorName | HEX | RGB | "",
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
        bottom: "╩",
        start: "",
        end: "",
        color: "" as ForegroundColorName | HEX | RGB | "",
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
        bottom: "╨",
        start: "",
        end: "",
        color: "" as ForegroundColorName | HEX | RGB | "",
    },
}

/**
 * @description This function is used to truncate a string adding ... at the end.
 * @param {string} str - The string to truncate.
 * @param {number} n - The number of characters to keep.
 * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
 * @example CM.truncate("Hello world", 5, true) // "Hello..."
 */
export function truncate(
    str: string,
    n: number,
    useWordBoundary: boolean
): string {
    if (str.length <= n) {
        return str
    }
    const subString = str.substring(0, n - 1) // the original check
    return (
        (useWordBoundary
            ? subString.substring(0, subString.lastIndexOf(" "))
            : subString) + "…"
    )
}

/**
 * @description This function is used to convert a styled element to a simplified styled element.
 *
 * @export
 * @param {StyledElement} styled
 * @return {*}  {SimplifiedStyledElement}
 *
 * @example const simplifiedStyledElement = styledToSimplifiedStyled({ text: "Hello world", style: { color: "red", backgroundColor: "blue", bold: true, italic: true } })
 * // returns { text: "Hello world", color: "red", backgroundColor: "blue", bold: true, italic: true }
 */
export function styledToSimplifiedStyled(
    styled: StyledElement
): SimplifiedStyledElement {
    return {
        text: styled.text,
        color: styled.style?.color,
        bg: styled.style?.bg,
        italic: styled.style?.italic,
        bold: styled.style?.bold,
        dim: styled.style?.dim,
        underline: styled.style?.underline,
        inverse: styled.style?.inverse,
        hidden: styled.style?.hidden,
        strikethrough: styled.style?.strikethrough,
        overline: styled.style?.overline,
    }
}

/**
 * @description This function is used to convert a simplified styled element to a styled element.
 *
 * @export
 * @param {SimplifiedStyledElement} simplifiedStyled
 * @return {*}  {StyledElement}
 *
 * @example const styledElement = simplifiedStyledToStyled({ text: "Hello world", color: "red", bold: true })
 * // returns { text: "Hello world", style: { color: "red", bold: true } }
 */
export function simplifiedStyledToStyled(
    simplifiedStyled: SimplifiedStyledElement
): StyledElement {
    return {
        text: simplifiedStyled.text,
        style: {
            color: simplifiedStyled?.color,
            bg: simplifiedStyled?.bg,
            italic: simplifiedStyled?.italic,
            bold: simplifiedStyled?.bold,
            dim: simplifiedStyled?.dim,
            underline: simplifiedStyled?.underline,
            inverse: simplifiedStyled?.inverse,
            hidden: simplifiedStyled?.hidden,
            strikethrough: simplifiedStyled?.strikethrough,
            overline: simplifiedStyled?.overline,
        },
    }
}

/**
 * @description Count true visible length of a string
 *
 * @export
 * @param {string} input
 * @return {number}
 * 
 * @author Vitalik Gordon (xpl)
 */
export function visibleLength(input: string): number {
    // eslint-disable-next-line no-control-regex
    const regex = new RegExp(
        /* eslint-disable-next-line no-control-regex */
        "\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f",
        "g"
    )
    // Array.from is used to correctly count emojis
    return Array.from(input.replace(regex, "")).length
}
