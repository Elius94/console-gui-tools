import { SimplifiedStyledElement, StyledElement } from "./Utils.js"

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