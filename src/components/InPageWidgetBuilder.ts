import PageBuilder from "./PageBuilder.js"

/**
 * @class InPageWidgetBuilder
 * @extends PageBuilder
 * @description Defines a new widget content:
 * It's a sort of collection of styled rows.
 * @param {number} rowsPerPage - The number of rows per page. Default is 100. Useful for scrolling.
 *
 * @export
 * @class InPageWidgetBuilder
 */
export class InPageWidgetBuilder extends PageBuilder {
    public constructor(rowsPerPage = 100) {
        super(rowsPerPage)
    }
}

export default InPageWidgetBuilder
export * from "./PageBuilder.js"