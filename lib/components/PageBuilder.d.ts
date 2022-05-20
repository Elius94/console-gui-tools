import { BackgroundColor, ForegroundColor } from "chalk";
/**
 * @description The type containing all the possible styles for the text.
 *
 * @typedef {Object} StyleObject
 * @property {chalk.ForegroundColor | ""} [color] - The color of the text taken from the chalk library.
 * @property {chalk.BackgroundColor | ""} [backgroundColor] - The background color of the text taken from the chalk library.
 * @property {boolean} [italic] - If the text is italic.
 * @property {boolean} [bold] - If the text is bold.
 * @property {boolean} [dim] - If the text is dim.
 * @property {boolean} [underline] - If the text is underlined.
 * @property {boolean} [inverse] - If the text is inverse.
 * @property {boolean} [hidden] - If the text is hidden.
 * @property {boolean} [strikethrough] - If the text is strikethrough.
 * @property {boolean} [overline] - If the text is overlined.
 *
 * @example const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
 *
 * @export
 * @interface StyleObject
 */
export interface StyleObject {
    color?: ForegroundColor | "";
    bg?: BackgroundColor | "";
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
 * @property {string} text - The text of the styled text.
 * @property {StyleObject} style - The style of the styled text.
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
 * @property {string} text - The text of the styled text.
 * @property {chalk.ForegroundColor | ""} [color] - The color of the text taken from the chalk library.
 * @property {chalk.BackgroundColor | ""} [backgroundColor] - The background color of the text taken from the chalk library.
 * @property {boolean} [italic] - If the text is italic.
 * @property {boolean} [bold] - If the text is bold.
 * @property {boolean} [dim] - If the text is dim.
 * @property {boolean} [underline] - If the text is underlined.
 * @property {boolean} [inverse] - If the text is inverse.
 * @property {boolean} [hidden] - If the text is hidden.
 * @property {boolean} [strikethrough] - If the text is strikethrough.
 * @property {boolean} [overline] - If the text is overlined.
 *
 * @example const textStyle = { color: "red", backgroundColor: "blue", bold: true, italic: true }
 *
 * @export
 * @interface SimplifiedStyledElement
 */
export interface SimplifiedStyledElement {
    text: string;
    color?: ForegroundColor | "";
    bg?: BackgroundColor | "";
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
 * @class PageBuilder
 * @description Defines a new page:
 * It's a sort of collection of styled rows.
 * @param {number} rowsPerPage - The number of rows per page. Default is 100. Useful for scrolling.
 *
 * @export
 * @class PageBuilder
 */
export declare class PageBuilder {
    rowsPerPage: number;
    scrollIndex: number;
    content: StyledElement[][];
    constructor(rowsPerPage?: number);
    /**
     * @description Add a new styled row to the page.
     * @param {parameters<object>} row - The styled row to add.
     * @returns {void}
     * @memberOf PageBuilder
     * @example
     * page.addRow({ text: 'Hello World', color: 'white' })
     * page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    addRow(...args: SimplifiedStyledElement[]): void;
    /**
     * @description Add an empty row to the page. (like <br /> in HTML)
     * @param {number} [count=1] - The number of empty rows to add.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.addEmptyRow()
     * page.addEmptyRow(2)
     */
    addSpacer(height?: number): void;
    /**
     * @description Returns the content of the page.
     * @returns {Array<Array<object>>}
     * @memberOf PageBuilder
     * @example page.getContent()
     */
    getContent(): StyledElement[][];
    /**
     * @description Returns the height of the page.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getPageHeight()
     */
    getPageHeight(): number;
    /**
     * @description Returns the height of the viewed page. It excludes the rows that are not visible.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getViewedPageHeight() // returns the height of the page that is visible
     */
    getViewedPageHeight(): number;
    /**
     * @description Changes the index of the scroll bar.
     * @param {number} index - The index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.setScrollIndex(10)
     */
    setScrollIndex(index: number): void;
    /**
     * @description Changes the number of rows per page.
     * @param {number} rowsPerPage - The number of rows per page.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.setRowsPerPage(10)
     */
    setRowsPerPage(rpp: number): void;
    /**
     * @description Increases the index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    increaseScrollIndex(): void;
    /**
     * @description Decreases the index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    decreaseScrollIndex(): void;
}
export default PageBuilder;
