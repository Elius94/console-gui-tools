import { BackgroundColor, ForegroundColor } from "chalk"


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
export class PageBuilder {
    rowsPerPage: number
    scrollIndex: number
    content: StyledElement[][]

    public constructor(rowsPerPage = 100) {
        this.rowsPerPage = rowsPerPage

        /**
         * @const {number} scrollIndex - The index of the scroll bar.
         * @memberOf PageBuilder 
         */
        this.scrollIndex = 0

        /**
         * @const {Array<Array<object>>} content The content of the page.
         * @memberOf PageBuilder
         */
        this.content = []
    }

    /**
     * @description Add a new styled row to the page.
     * @param {parameters<object>} row - The styled row to add.
     * @returns {void}
     * @memberOf PageBuilder
     * @example
     * page.addRow({ text: 'Hello World', color: 'white' })
     * page.addRow({ text: 'Hello World', color: 'white' }, { text: 'Hello World', color: 'white' })
     */
    public addRow(...args: SimplifiedStyledElement[]): void {
        // each argument is an object like {text: string, color: string}
        const _row: StyledElement[] = []
        for (let i = 0; i < args.length; i++) {
            const arg: SimplifiedStyledElement = args[i]
            _row.push({
                text: arg.text,
                style: {
                    color: arg.color ? arg.color : undefined,
                    bg: arg.bg ? arg.bg : undefined,
                    italic: arg.italic ? arg.italic : undefined,
                    bold: arg.bold ? arg.bold : undefined,
                    dim: arg.dim ? arg.dim : undefined,
                    underline: arg.underline ? arg.underline : undefined,
                    inverse: arg.inverse ? arg.inverse : undefined,
                    hidden: arg.hidden ? arg.hidden : undefined,
                    strikethrough: arg.strikethrough ? arg.strikethrough : undefined,
                    overline: arg.overline ? arg.overline : undefined,
                }
            })
        }
        this.content.push(_row)
    }

    /**
     * @description Add an empty row to the page. (like <br /> in HTML)
     * @param {number} [count=1] - The number of empty rows to add.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.addEmptyRow()
     * page.addEmptyRow(2)
     */
    public addSpacer(height = 1): void {
        if (height > 0) {
            for (let i = 0; i < height; i++) {
                this.addRow({ text: "", color: "" })
            }
        }
    }

    /**
     * @description Returns the content of the page.
     * @returns {Array<Array<object>>}
     * @memberOf PageBuilder
     * @example page.getContent()
     */
    public getContent(): StyledElement[][] {
        if (this.getPageHeight() > this.rowsPerPage) {
            return this.content.slice(this.getPageHeight() - this.scrollIndex - this.rowsPerPage, this.getPageHeight() - this.scrollIndex)
        } else {
            return this.content
        }
    }

    /**
     * @description Returns the height of the page.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getPageHeight()
     */
    public getPageHeight(): number {
        return this.content.length
    }

    /**
     * @description Returns the height of the viewed page. It excludes the rows that are not visible.
     * @returns {number}
     * @memberOf PageBuilder
     * @example page.getViewedPageHeight() // returns the height of the page that is visible
     */
    public getViewedPageHeight(): number {
        return this.getContent().length
    }

    /**
     * @description Changes the index of the scroll bar.
     * @param {number} index - The index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.setScrollIndex(10)
     */
    public setScrollIndex(index: number): void {
        this.scrollIndex = index
    }

    /**
     * @description Changes the number of rows per page.
     * @param {number} rowsPerPage - The number of rows per page.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.setRowsPerPage(10)
     */
    public setRowsPerPage(rpp: number): void {
        this.rowsPerPage = rpp
    }

    /**
     * @description Increases the index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    public increaseScrollIndex(): void {
        if (this.scrollIndex < this.getPageHeight() - this.rowsPerPage) {
            this.scrollIndex++
        }
    }

    /**
     * @description Decreases the index of the scroll bar.
     * @returns {void}
     * @memberOf PageBuilder
     * @example page.increaseScrollIndex()
     */
    public decreaseScrollIndex(): void {
        if (this.scrollIndex > 0) {
            this.scrollIndex--
        }
    }
}

export default PageBuilder