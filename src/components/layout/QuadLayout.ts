import { ForegroundColorName } from "chalk"
import { ConsoleManager, PageBuilder } from "../../ConsoleGui.js"
import { StyledElement } from "../PageBuilder.js"

/**
 * @description The type containing all the possible options for the QuadLayout.
 * @typedef {Object} QuadLayoutOptions
 * @prop {boolean} [showTitle] - If the title should be shown.
 * @prop {boolean} [boxed] - If the layout should be boxed.
 * @prop {ForegroundColor | ""} [boxColor] - The color of the box taken from the chalk library.
 * @prop {"bold"} [boxStyle] - If the border of the box should be bold.
 * @prop {string} [changeFocusKey] - The key that should be pressed to change the focus.
 * @prop {string} [page1Title] - The title of the first page.
 * @prop {string} [page2Title] - The title of the second page.
 * @prop {string} [page3Title] - The title of the third page.
 * @prop {string} [page4Title] - The title of the fourth page.
 * @prop {[number, number] | [[number, number]]} [pageRatio] - The ratio of the pages.
 *
 * @export
 * @interface DoubleLayoutOptions
 */
export interface QuadLayoutOptions {
    showTitle?: boolean;
    boxed?: boolean;
    boxColor?: ForegroundColorName | ""; // add color list from chalk
    boxStyle?: "bold";
    changeFocusKey: string;
    page1Title?: string;
    page2Title?: string;
    page3Title?: string;
    page4Title?: string;
    pageRatio?: [[number, number], [number, number]];
}

/**
 * @class QuadLayout
 * @description This class is a layout that has two pages.
 * 
 * ![quad layout](https://user-images.githubusercontent.com/14907987/170998201-59880c90-7b1a-491a-8a45-6610e5c33de9.png)
 * 
 * @param {PageBuilder} page1 The first page.
 * @param {PageBuilder} page2 The second page.
 * @param {PageBuilder} page3 The third page.
 * @param {PageBuilder} page4 The fourth page.
 * @param {boolean} options Layout options.
 * @param {number} selected The selected page.
 * @example const layout = new QuadLayout(page1, page2, true, 0)
 */
export class QuadLayout {
    CM: ConsoleManager
    options: QuadLayoutOptions
    selected: 0 | 1 | 2 | 3
    page1: PageBuilder
    page2: PageBuilder
    page3: PageBuilder
    page4: PageBuilder
    boxBold: boolean
    proportions: [[number, number], [number, number]]
    page1Title: string
    page2Title: string
    page3Title: string
    page4Title: string
    realWidth: [[number, number], [number, number]] = [[0, 0], [0, 0]]
    isOdd: boolean | undefined

    public constructor(page1: PageBuilder, page2: PageBuilder, page3: PageBuilder, page4: PageBuilder, options: QuadLayoutOptions, selected: 0 | 1 | 2 | 3 = 0) {
        /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
        this.CM = new ConsoleManager()

        this.options = options
        this.selected = selected
        this.page1 = page1
        this.page2 = page2
        this.page3 = page3
        this.page4 = page4

        this.boxBold = this.options.boxStyle === "bold" ? true : false
        this.proportions = this.options.pageRatio || [[0.4, 0.6], [0.5, 0.5]]

        /** @const {string} page1Title The application title. */
        this.page1Title = this.options.page1Title || ""

        /** @const {string} page2Title The title of page2. */
        this.page2Title = this.options.page2Title || ""

        /** @const {string} page3Title The title of page3. */
        this.page3Title = this.options.page3Title || ""

        /** @const {string} page4Title The title of page4. */
        this.page4Title = this.options.page4Title || ""
    }

    /**
     * @description This function is used to overwrite the page content.
     * @param {PageBuilder} page the page to be added
     * @memberof QuadLayout 
     */
    public setPage(page: PageBuilder, index: number): void {
        switch (index) {
        case 0:
            this.page1 = page
            break
        case 1:
            this.page2 = page
            break
        case 2:
            this.page3 = page
            break
        case 3:
            this.page4 = page
            break
        default:
            break
        }
    }

    /**
     * @description This function is used to overwrite the first page content.
     * @param {PageBuilder} page the page to be added
     * @memberof QuadLayout
     */
    public setPage1(page: PageBuilder): void { this.page1 = page }

    /**
     * @description This function is used to overwrite the second page content.
     * @param {PageBuilder} page the page to be added
     * @memberof QuadLayout
     */
    public setPage2(page: PageBuilder): void { this.page2 = page }

    /**
     * @description This function is used to overwrite the third page content.
     * @param {PageBuilder} page the page to be added
     * @memberof QuadLayout
     */
    public setPage3(page: PageBuilder): void { this.page3 = page }

    /**
     * @description This function is used to overwrite the forth page content.
     * @param {PageBuilder} page the page to be added
     * @memberof QuadLayout
     */
    public setPage4(page: PageBuilder): void { this.page4 = page }

    /**
     * @description This function is used to set the page titles.
     * @param {string[]} titles the titles of the pages
     * @memberof QuadLayout
     * @example layout.setTitles(["Page 1", "Page 2", "Page 3", "Page 4"])
     */
    public setTitles(titles: string[]) {
        this.page1Title = titles[0]
        this.page2Title = titles[1]
        this.page3Title = titles[2]
        this.page4Title = titles[3]
    }

    /**
     * @description This function is used to set the page title at the given index.
     * @param {string} title the title of the page
     * @param {number} index the index of the page
     * @memberof QuadLayout
     * @example layout.setTitle("Page 1", 0)
     */
    public setTitle(title: string, index: number): void {
        switch (index) {
        case 0:
            this.page1Title = title
            break
        case 1:
            this.page2Title = title
            break
        case 2:
            this.page3Title = title
            break
        case 3:
            this.page4Title = title
            break
        default:
            break
        }
    }

    /**
     * @description This function is used to enable or disable the layout border.
     * @param {boolean} border enable or disable the border
     * @memberof QuadLayout
     */
    public setBorder(border: boolean): void { this.options.boxed = border }

    /**
     * @description This function is used to choose the page to be highlighted.
     * @param {number} selected 0 for page1, 1 for page2
     * @memberof QuadLayout
     */
    public setSelected(selected: 0 | 1 | 2 | 3): void { this.selected = selected }

    /**
     * @description This function is used to get the selected page.
     * @returns {number} 0 for page1, 1 for page2
     * @memberof QuadLayout
     */
    public getSelected(): number {
        return this.selected
    }

    /**
     * @description This function is used to get switch the selected page.
     * @returns {void}
     * @memberof QuadLayout
     */
    public changeLayout(): void {
        if (this.selected >= 0 && this.selected < 3) {
            this.selected++
        } else {
            this.selected = 0
        }
    }

    /**
     * @description This function is used to change the page ratio.
     * @param {Array<Array<number>>} ratio the ratio of pages
     * @memberof QuadLayout
     * @example layout.setRatio([[0.4, 0.6], [0.5, 0.5]])
     */
    public setRatio(ratio: [[number, number], [number, number]]): void {
        this.proportions = ratio
    }

    /**
     * @description This function is used to increase the page ratio of the selected row by the given ratio to add.
     * @param {number} quantity the ratio to add
     * @memberof QuadLayout
     * @example layout.increaseRatio(0.01)
     */
    public increaseRatio(quantity: number): void {
        if (this.selected < 2) {
            if (this.proportions[0][0] < 0.9) {
                this.proportions[0][0] = Number((this.proportions[0][0] + quantity).toFixed(2))
                this.proportions[0][1] = Number((this.proportions[0][1] - quantity).toFixed(2))
            }
        } else {
            if (this.proportions[1][0] < 0.9) {
                this.proportions[1][0] = Number((this.proportions[1][0] + quantity).toFixed(2))
                this.proportions[1][1] = Number((this.proportions[1][1] - quantity).toFixed(2))
            }
        }
    }

    /**
     * @description This function is used to decrease the page ratio of the selected row by the given ratio to add.
     * @param {number} quantity the ratio to subtract
     * @memberof QuadLayout
     * @example layout.decreaseRatio(0.01)
     */
    public decreaseRatio(quantity: number): void {
        if (this.selected < 2) {
            if (this.proportions[0][0] > 0.1) {
                this.proportions[0][0] = Number((this.proportions[0][0] - quantity).toFixed(2))
                this.proportions[0][1] = Number((this.proportions[0][1] + quantity).toFixed(2))
            }
        } else {
            if (this.proportions[1][0] > 0.1) {
                this.proportions[1][0] = Number((this.proportions[1][0] - quantity).toFixed(2))
                this.proportions[1][1] = Number((this.proportions[1][1] + quantity).toFixed(2))
            }
        }
    }

    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<StyledElement>} line the line to be drawn
     * @param {Array<StyledElement>} secondLine the line to be drawn
     * @param {number} row the row of the quad grid to be drawn
     * @memberof QuadLayout
     * @returns {void}
     */
    private drawLine(line: Array<StyledElement>, secondLine: Array<StyledElement>, row = 0): void {
        const bsize = this.options.boxed ? 3 : 0
        let unformattedLine = [""]
        let newLine = [
            [...line]
        ]
        newLine = [
            [...line],
            [...secondLine ? secondLine : line]
        ]
        unformattedLine.push("")
        line.forEach((element: StyledElement) => {
            unformattedLine[0] += element.text
        })
        secondLine?.forEach((element: StyledElement) => {
            unformattedLine[1] += element.text
        })
        if (unformattedLine.filter((e, i) => e.length > this.realWidth[row][i] - bsize).length > 0) {
            unformattedLine = unformattedLine.map((e, i) => {
                if (e.length > this.realWidth[row][i] - bsize) { // Need to truncate
                    const offset = 2
                    newLine[i] = i === 0 ? JSON.parse(JSON.stringify(line)) : JSON.parse(JSON.stringify(secondLine))
                    let diff = e.length - this.realWidth[row][i] + 1
                    // remove truncated text
                    for (let j = newLine[i].length - 1; j >= 0; j--) {
                        if (newLine[i][j].text.length > diff + offset) {
                            newLine[i][j].text = this.CM.truncate(newLine[i][j].text, (newLine[i][j].text.length - diff) - offset, false)
                            break
                        } else {
                            diff -= newLine[i][j].text.length
                            newLine[i].splice(j, 1)
                        }
                    }
                    // Update unformatted line
                    return newLine[i].map(element => element.text).join("")
                }
                return e
            })
        }
        const ret: StyledElement[] = []
        if (this.options.boxed) ret.push({ text: "│", style: { color: this.selected === 0 && row === 0 || this.selected === 2 && row === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
        ret.push(...newLine[0])
        if (unformattedLine[0].length <= this.realWidth[row][0] - bsize) {
            ret.push({ text: `${" ".repeat((this.realWidth[row][0] - unformattedLine[0].length) - (bsize > 0 ? 2 : 0))}`, style: { color: "" } })
        }
        if (this.options.boxed) ret.push({ text: "│", style: { color: ((this.selected < 2 && row === 0) || (this.selected > 1 && row === 1)) ? this.options.boxColor : "white", bold: this.boxBold } })
        ret.push(...newLine[1])
        if (unformattedLine[1].length <= this.realWidth[row][1] - bsize) {
            ret.push({ text: `${" ".repeat((this.realWidth[row][1] - unformattedLine[1].length) - (bsize > 0 ? 1 : 0))}`, style: { color: "" } })
        }
        if (this.options.boxed) ret.push({ text: "│", style: { color: this.selected === 1 && row === 0 || this.selected === 3 && row === 1 ? this.options.boxColor : "white", bold: this.boxBold } })
        this.CM.Screen.write(...ret)
    }

    /**
     * @description This function is used to draw the layout to the screen.
     * @memberof QuadLayout
     * @returns {void}
     * @example layout.draw()
     */
    public draw(): void {
        this.isOdd = this.CM.Screen.width % 2 === 1
        this.realWidth = [
            [
                Math.round(this.CM.Screen.width * this.proportions[0][0]),
                Math.round(this.CM.Screen.width * this.proportions[0][1])
            ],
            [
                Math.round(this.CM.Screen.width * this.proportions[1][0]),
                Math.round(this.CM.Screen.width * this.proportions[1][1])
            ]
        ]
        const trimmedTitle = [
            [
                this.CM.truncate(this.page1Title, this.realWidth[0][0] - 4, false),
                this.CM.truncate(this.page2Title, this.realWidth[0][1] - 3, false)
            ],
            [
                this.CM.truncate(this.page3Title, this.realWidth[1][0] - 4, false),
                this.CM.truncate(this.page4Title, this.realWidth[1][1] - 3, false)
            ]
        ]
        const maxPageHeight = Math.max(
            this.page1.getViewedPageHeight(),
            this.page2.getViewedPageHeight(),
            this.page3.getViewedPageHeight(),
            this.page4.getViewedPageHeight()
        )

        const p = [
            this.page1.getContent(),
            this.page2.getContent(),
            this.page3.getContent(),
            this.page4.getContent()
        ]

        for (let j = 0; j < 2; j++) {
            if (this.options.boxed) { // Draw pages with borders
                if (j === 0) {
                    if (this.options.showTitle) {
                        this.CM.Screen.write(
                            { text: `┌─${trimmedTitle[j][0]}${"─".repeat(this.realWidth[j][0] - trimmedTitle[j][0].length - 3)}┬`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `─${trimmedTitle[j][1]}${"─".repeat(this.realWidth[j][1] - trimmedTitle[j][1].length - 2)}┐`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    } else {
                        this.CM.Screen.write(
                            { text: `┌─${"─".repeat(this.realWidth[j][0] - 3)}┬`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `─${"─".repeat(this.realWidth[j][1] - 2)}┐`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    }
                }
                for (let i = 0; i < maxPageHeight; i++) {
                    this.drawLine(p[j + (j * 1)][i] || [{ text: "", style: { color: "" } }], p[j + (j * 1) + 1][i] || [{ text: "", style: { color: "" } }], j)
                }
                // Draw the bottom border
                if (j === 0) {
                    const first = this.realWidth[j][0]
                    const second = this.realWidth[j + 1][0]
                    if (this.options.showTitle) {
                        let str
                        if (first === second)
                            str = `${"─".repeat(first - trimmedTitle[j + 1][0].length - 3)}┼`
                        if (first > second)
                            str = `${"─".repeat(second - trimmedTitle[j + 1][0].length - 3)}┬`
                        if (first < second && trimmedTitle[j + 1][0].length < first - 2)
                            str = `${"─".repeat(first - trimmedTitle[j + 1][0].length - 3)}┴${"─".repeat(second - first - 1)}┬`
                        if (first < second && trimmedTitle[j + 1][0].length >= first - 2)
                            str = `${"─".repeat(second - trimmedTitle[j + 1][0].length - 3)}┬`
                        let str2
                        if (first === second || first < second)
                            str2 = `${"─".repeat(this.realWidth[j + 1][1] - trimmedTitle[j + 1][1].length - 2)}`
                        if (first > second) {
                            if (first - second >= trimmedTitle[j + 1][1].length + 2) {
                                str2 = `${"─".repeat(first - second - (trimmedTitle[j + 1][1].length + 2))}┴${"─".repeat(this.realWidth[j][1] - 1)}`
                            } else {
                                str2 = `${"─".repeat(this.realWidth[j + 1][1] - (trimmedTitle[j + 1][1].length + 2))}`
                            }
                        }

                        this.CM.Screen.write(
                            { text: `├─${trimmedTitle[j + 1][0]}${str}`, style: { color: this.selected === 2 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `─${trimmedTitle[j + 1][1]}${str2}┤`, style: { color: this.selected === 3 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    } else {
                        let str
                        if (first === second)
                            str = `${"─".repeat(first - 2)}┼`
                        if (first > second)
                            str = `${"─".repeat(second - 2)}┬`
                        if (first < second)
                            str = `${"─".repeat(first - 2)}┴${"─".repeat(second - first - 1)}┬`
                        let str2
                        if (first <= second)
                            str2 = `${"─".repeat(this.realWidth[j + 1][1] - 1)}`
                        if (first > second) {
                            str2 = `${"─".repeat(first - second - 1)}┴${"─".repeat(this.realWidth[j][1] - 1)}`
                        }
                        this.CM.Screen.write(
                            { text: `├${str}`, style: { color: this.selected === 0 || this.selected === 2 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `${str2}┤`, style: { color: this.selected === 1 || this.selected === 3 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    }
                } else {
                    this.CM.Screen.write(
                        { text: `└${"─".repeat(this.realWidth[j][0] - 2)}┴`, style: { color: this.selected === 2 ? this.options.boxColor : "white", bold: this.boxBold } },
                        { text: `${"─".repeat(this.realWidth[j][1] - 1)}┘`, style: { color: this.selected === 3 ? this.options.boxColor : "white", bold: this.boxBold } }
                    )
                }
            } else { // Draw pages without borders
                if (this.options.showTitle) {
                    if (j === 0) {
                        this.CM.Screen.write(
                            { text: `${trimmedTitle[j][0]}${" ".repeat(this.realWidth[j][0] - trimmedTitle[j][0].length)}`, style: { color: this.selected === 0 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `${trimmedTitle[j][1]}`, style: { color: this.selected === 1 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    } else {
                        this.CM.Screen.write(
                            { text: `${trimmedTitle[j][0]}${" ".repeat(this.realWidth[j][0] - trimmedTitle[j][0].length)}`, style: { color: this.selected === 2 ? this.options.boxColor : "white", bold: this.boxBold } },
                            { text: `${trimmedTitle[j][1]}`, style: { color: this.selected === 3 ? this.options.boxColor : "white", bold: this.boxBold } }
                        )
                    }
                }
                for (let i = 0; i < maxPageHeight; i++) {
                    this.drawLine(p[j + (j * 1)][i] || [{ text: "", style: { color: "" } }], p[j + (j * 1) + 1][i] || [{ text: "", style: { color: "" } }], j)
                }
            }
        }
    }
}

export default QuadLayout