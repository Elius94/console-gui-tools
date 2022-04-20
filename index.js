import { EventEmitter } from "events"
import chalk from 'chalk';
import readline from 'readline';
chalk.level = 1

class PageBuilder {
    constructor() {
        this.visualizedPage = 0 // 0 = last
        this.rowsPerPage = 50
        this.scrollIndex = 0
        this.content = []
    }

    addRow() {
        // each argument is an object like {text: string, color: string}
        let _row = []
        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i]
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

    addSpacer(height = 1) {
        if (height > 0) {
            for (let i = 0; i < height; i++) {
                this.addRow({ text: '', color: '' })
            }
        }
    }

    getContent() {
        return this.content.slice(this.getPageHeight() - this.scrollIndex - this.rowsPerPage, this.getPageHeight() - this.scrollIndex)
    }

    getPageHeight() {
        return this.content.length
    }

    getPageWidth() {
        let max = 0
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].text.length > max) {
                max = this.content[i].text.length
            }
        }
        return max
    }

    setScrollIndex(index) {
        this.scrollIndex = index
    }

    setRowsPerPage(rpp) {
        this.rowsPerPage = rpp
    }

    increaseScrollIndex() {
        if (this.scrollIndex < this.getPageHeight() - this.rowsPerPage) {
            this.scrollIndex++
        }
    }

    decreaseScrollIndex() {
        if (this.scrollIndex > 0) {
            this.scrollIndex--
        }
    }
}

class Screen {
    constructor(_Terminal) {
        this.Terminal = _Terminal
        this.width = this.Terminal.columns
        this.height = this.Terminal.rows
        this.buffer = []
        this.cursor = { x: 0, y: 0 }
    }

    write() {
        this.currentY++
            let row = ""
        let newStyleIndex = []
        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i]
            if (arg.text) {
                let style = arg.style
                style.index = [row.length, row.length + arg.text.length]
                newStyleIndex.push(style)
                row += arg.text
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

    cursorTo(x, y) {
        this.cursor.x = x
        this.cursor.y = y
    }

    moveCursor(x, y) {
        this.Terminal.cursorTo(x, y)
    }

    update() {
        this.cursorTo(0, 0)
        this.width = this.Terminal.columns
        this.height = this.Terminal.rows
        this.buffer = []
        for (let i = 0; i < this.Terminal.rows; i++) {
            this.buffer[i] = { text: " ".repeat(this.Terminal.columns), styleIndex: [{ color: 'gray', bg: '', italic: false, bold: false, index: [0, this.Terminal.columns] }] }
        }
    }

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

    replaceAt(str, index, replacement) {
        return str.substring(0, index) + replacement + str.substring(index + replacement.length);
    }

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
                    merged.push({...style, index: [style.index[0], offset - 1] })
                    return
                } else if (style.index[0] < offset && style.index[1] > offset + newSize) {
                    merged.push({...style, index: [style.index[0], offset - 1] })
                    merged.push({...style, index: [offset + newSize + 1, style.index[1]] })
                    return
                } else if (style.index[0] >= offset && style.index[1] <= offset + newSize) {
                    // Do nothing
                    return
                } else if (style.index[0] >= offset && style.index[0] <= offset + newSize && style.index[1] > offset + newSize) {
                    merged.push({...style, index: [offset + newSize + 1, style.index[1]] })
                    return
                } else if (style.index[0] > offset + newSize && style.index[1] > offset + newSize) {
                    merged.push(style)
                    return
                }
                console.log("I shouldn't be here!")
            })
            // Then add the new style to the merged array
        new_.forEach((newStyle, i) => {
                merged.push({...newStyle, index: [newStyle.index[0] + offset, newStyle.index[1] + offset] })
            })
            // Sort the merged array by index[0]
        merged.sort(this.sortByIndex)
        return merged
    }

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

class ConsoleManager extends EventEmitter {
    constructor(options) {
        super()
        this.Terminal = process.stdout;
        this.Input = process.stdin;
        if (!ConsoleManager.instance) {
            ConsoleManager.instance = this
            this.Screen = new Screen(this.Terminal)
            this.widgetsCollection = []
            this.eventListenersContainer = {}
            this.stdOut = new PageBuilder()
            this.homePage = new PageBuilder()
            this.layoutBorder = true
            this.changeLayoutKey = "ctrl+l"
            this.applicationTitle = ""
            this.changeLayoutkeys = this.changeLayoutKey.split('+')
            this.logsPageSize = 10

            if (options) {
                if (options.logsPageSize) {
                    this.logsPageSize = options.logsPageSize
                }
                if (options.layoutBorder) {
                    this.layoutBorder = options.layoutBorder
                }
                if (options.changeLayoutKey) {
                    this.changeLayoutKey = options.changeLayoutKey
                }
                if (options.title) {
                    this.applicationTitle = options.title
                }
            }

            this.layout = new DoubleLayout(this.homePage, this.stdOut, this.layoutBorder, 0)
            this.layout.page2.setRowsPerPage(this.logsPageSize)
            this.addGenericListeners()

            // I use readline to manage the keypress event
            readline.emitKeypressEvents(this.Input);
            this.Input.setRawMode(true); // With this I only get the key value
        }
        return ConsoleManager.instance
    }

    setGuiLogsPage(page) {
        this.guiLogsPage = page
    }

    getGuiLogsPage() {
        return this.guiLogsPage
    }

    getGuiLogsRowsPerPage() {
        return this.guiLogsRowsPerPage
    }

    setGuiLogsRowsPerPage(rows) {
        this.guiLogsRowsPerPage = rows
    }

    addGenericListeners() {
        this.Input.addListener('keypress', (str, key) => {
            let change = false
            if (this.changeLayoutkeys.length > 1) {
                if (this.changeLayoutkeys[0] == 'ctrl') {
                    if (key.ctrl && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == 'meta') {
                    if (key.alt && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == 'shift') {
                    if (key.shift && key.name === this.changeLayoutkeys[1])
                        change = true
                }
            } else {
                if (key.name === this.changeLayoutkeys[0])
                    change = true
            }

            if (change) {
                this.layout.changeLayout()
                this.refresh()
                return
            }

            if (key.ctrl && key.name === 'c') {
                this.emit('exit')
            } else {
                if (Object.keys(this.widgetsCollection).length === 0) {
                    if (this.layout.getSelected() === 1) {
                        if (key.name === 'down') {
                            this.layout.page2.decreaseScrollIndex()
                            this.refresh()
                            return
                        } else if (key.name === 'up') {
                            this.layout.page2.increaseScrollIndex()
                            this.refresh()
                            return
                        }
                    }
                    this.emit("keypressed", key)
                }
            }
        })
    }

    setKeyListener(id, manageFunction) {
        this.eventListenersContainer[id] = manageFunction
        this.Input.addListener('keypress', this.eventListenersContainer[id])
    }

    removeKeyListener(id) {
        this.Input.removeListener('keypress', this.eventListenersContainer[id])
        delete this.eventListenersContainer[id]
    }

    registerWiget(widget) {
        this.widgetsCollection[widget.id] = widget
    }

    unRegisterWidget(widget) {
        if (this.widgetsCollection[widget.id]) {
            delete this.widgetsCollection[widget.id]
        }
    }

    setHomePage(page) {
        this.homePage = page
        this.layout.setPage1(this.homePage)
        this.refresh()
    }

    // Draw the console on the screen
    refresh() {
        this.Screen.update()
        this.layout.draw()
        for (let widget in this.widgetsCollection) {
            if (this.widgetsCollection[widget].isVisible())
                this.widgetsCollection[widget].draw()
        }
        this.Screen.print()
    }

    // Add Log Functions to the console
    log(message) {
        this.stdOut.addRow({ text: message, color: 'white' })
        this.updateLogsConsole(true)
    }

    error(message) {
        this.stdOut.addRow({ text: message, color: 'red' })
        this.updateLogsConsole(true)
    }

    warn(message) {
        this.stdOut.addRow({ text: message, color: 'yellow' })
        this.updateLogsConsole(true)
    }

    info(message) {
        this.stdOut.addRow({ text: message, color: 'blue' })
        this.updateLogsConsole(true)
    }

    updateLogsConsole(resetCursor) {
        if (resetCursor) {
            this.layout.page2.scrollIndex = 0
        }
        this.refresh()
    }

    truncate(str, n, useWordBoundary) {
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n - 1); // the original check
        return (useWordBoundary ?
            subString.substr(0, subString.lastIndexOf(" ")) :
            subString) + "…";
    }

    removeColors(str) {
        return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
    }
}

class DoubleLayout {
    constructor(page1, page2, border = true, selected = 0) {
        this.CM = new ConsoleManager()
        this.border = border
        this.selected = selected
        this.page1 = page1
        this.page2 = page2
        this.page2Title = "─LOGS"
        this.applicationTitle = this.CM.applicationTitle
    }

    setPage1(page) { this.page1 = page }

    setPage2(page) { this.page2 = page }

    setBorder(border) { this.border = border }

    setSelected(selected) { this.selected = selected }

    getSelected() {
        return this.selected
    }

    changeLayout() {
        if (this.selected == 0) {
            this.selected = 1
        } else {
            this.selected = 0
        }
    }

    drawLine(line, index) {
        let unformattedLine = ""
        line.forEach(element => {
            unformattedLine += element.text
        })
        let newLine = [...line] // Shallow copy
        newLine.unshift({ text: "│", style: { color: this.selected === index ? "cyan" : "white" } })
        newLine.push({ text: `${" ".repeat(this.CM.Screen.width - unformattedLine.length - 2)}`, style: { color: "" } })
        newLine.push({ text: "│", style: { color: this.selected === index ? "cyan" : "white" } })
        this.CM.Screen.write(...newLine)
    }

    draw() {
        if (this.border) { // Draw pages with borders 
            this.CM.Screen.write(this.selected === 0 ? { text: `┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐`, style: { color: 'cyan' } } : { text: `┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐`, style: { color: 'white' } })
            this.page1.getContent().forEach(line => {
                this.drawLine(line, 0)
            })
            this.CM.Screen.write({ text: `├${this.page2Title}${"─".repeat(this.CM.Screen.width - this.page2Title.length - 2)}┤`, style: { color: 'cyan' } })
            this.page2.getContent().forEach(line => {
                this.drawLine(line, 1)
            })
            this.CM.Screen.write(this.selected === 1 ? { text: `└${"─".repeat(this.CM.Screen.width - 2)}┘`, style: { color: 'cyan' } } : { text: `└${"─".repeat(this.CM.Screen.width - 2)}┘`, style: { color: 'white' } })
        } else { // Draw pages without borders
            this.page1.getContent().forEach(line => {
                this.CM.Screen.write({ text: `${line}`, style: { color: 'white' } })
            })
            this.page2.getContent().forEach(line => {
                this.CM.Screen.write({ text: `${line}`, style: { color: 'white' } })
            })
        }
    }
}

class OptionPopup extends EventEmitter {
    constructor(id, title, options, selected, visible = false) {
        super()
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.options = options
        this.selected = selected
        this.visible = visible
        this.marginTop = 4
        this.startIndex = 0
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this)
            const message = `OptionPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerWiget(this)
    }

    adaptOptions() {
        return this.options.slice(this.startIndex, this.startIndex + this.CM.Screen.height - this.marginTop - 6)
    }

    keyListner(str, key) {
        switch (key.name) {
            case 'down':
                this.setSelected(this.options[(this.options.indexOf(this.selected) + 1) % this.options.length], false)
                if (this.CM.Screen.height - this.marginTop - 4 < this.options.length) {
                    if (this.selected === this.options[this.adaptOptions().length + this.startIndex]) {
                        this.startIndex++
                    }
                } else {
                    this.startIndex = 0
                }
                break
            case 'up':
                this.setSelected(this.options[(this.options.indexOf(this.selected) - 1 + this.options.length) % this.options.length], false)
                if (this.startIndex > 0 && this.selected === this.adaptOptions()[0]) {
                    this.startIndex--
                }
                break
            case 'return':
                {
                    this.emit(`confirm`, this.selected)
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            case 'escape':
                {
                    this.emit(`cancel`)
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            case 'q':
                {
                    this.CM.emit('exit')
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            default:
                break
        }
        this.CM.refresh()
    }

    getSelected() {
        return this.selected
    }

    setSelected(selected, refresh = true) {
        this.selected = selected
        this.CM.refresh()
        return this
    }

    show() {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    hide() {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.refresh()
        }
        return this
    }

    isVisible() {
        return this.visible
    }

    manageInput() {
        // Add a command input listener to change mode
        this.CM.setKeyListener(this.id, this.keyListner.bind(this))
        return this
    }

    unManageInput() {
        // Add a command input listener to change mode
        this.CM.removeKeyListener(this.id)
        return this
    }

    draw() {
        // Change start index if selected is not in the adaptOptions return array
        if (this.adaptOptions().indexOf(this.selected) === -1) {
            this.startIndex = this.options.indexOf(this.selected) - this.adaptOptions().length + 1 > 0 ? this.options.indexOf(this.selected) - this.adaptOptions().length + 1 : 0
        }
        const offset = 2
        const maxOptionsLength = this.options.map((o) => o.toString()).reduce((max, option) => Math.max(max, option.length), 0)
        const windowWidth = maxOptionsLength > this.title.length ? maxOptionsLength + (2 * offset) : this.title.length + (2 * offset)
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)

        let header = "┌"
        for (let i = 0; i < windowWidth; i++) {
            header += "─"
        }
        header += "┐\n"
        header += `│${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}│\n`
        header += "├" + "─".repeat(windowWidth) + "┤\n"

        let footer = "└"
        for (let i = 0; i < windowWidth; i++) {
            footer += "─"
        }
        footer += "┘\n"

        let content = ""
        this.adaptOptions().forEach((option, index) => {
            content += `│${option === this.selected ? "<" : " "} ${option}${option === this.selected ? " >" : "  "}${" ".repeat(windowWidth - option.toString().length - 4)}│\n`
        })

        const windowDesign = `${header}${content}${footer}`
        windowDesign.split('\n').forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)), this.marginTop + index)
            this.CM.Screen.write({ text: line, style: { color: 'blue' } })
        })
        return this
    }
}

class InputPopup extends EventEmitter {
    constructor(id, title, value, numeric, visible = false) {
        super()
        this.CM = new ConsoleManager()
        this.id = id
        this.title = title
        this.value = value
        this.numeric = numeric
        this.visible = visible
        this.marginTop = 4
        if (this.CM.widgetsCollection[this.id]) {
            this.CM.unRegisterWidget(this)
            const message = `InputPopup ${this.id} already exists.`
            this.CM.error(message)
            throw new Error(message)
        }
        this.CM.registerWiget(this)
    }

    keyListnerNumeric(str, key) {
        const v = Number(this.value)
        if (Number.isNaN(v)) {
            v = 0
        }
        if (!Number.isNaN(Number(key.name))) {
            if (v.toString().length < 20) {
                let tmp = v.toString()
                tmp += key.name
                this.value = Number(tmp)
            }
            // To change the sign I check for the keys "+" and "-"
        } else if (key.sequence === '-') {
            this.value = v * -1
        } else if (key.sequence === '+') {
            this.value = Math.abs(v)
        } else {
            switch (key.name) {
                case 'backspace':
                    // If backspace is pressed I remove the last character from the typed value
                    if (v.toString().length > 0) {
                        this.value = Number(v.toString().slice(0, v.toString().length - 1))
                    }
                    break
                case 'return':
                    {
                        this.emit(`confirm`, this.value)
                        this.CM.unRegisterWidget(this)
                        this.hide()
                        delete this
                    }
                    break
                case 'escape':
                    {
                        this.emit(`cancel`)
                        this.CM.unRegisterWidget(this)
                        this.hide()
                        delete this
                    }
                    break
                case 'q':
                    {
                        this.CM.emit('exit')
                        this.CM.unRegisterWidget(this)
                        this.hide()
                        delete this
                    }
                    break
                default:
                    break
            }
        }
        this.CM.refresh()
    }

    keyListnerText(str, key) {
        const v = this.value
        if (v.toString().length < 20) {
            let tmp = v.toString()
            tmp += key.name
            this.value = tmp
        }
        switch (key.name) {
            case 'backspace':
                // If backspace is pressed I remove the last character from the typed value
                if (v.toString().length > 0) {
                    this.value = v.toString().slice(0, v.toString().length - 1)
                }
                break
            case 'return':
                {
                    this.emit(`confirm`, this.value)
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            case 'escape':
                {
                    this.emit(`cancel`)
                    this.CM.unRegisterWidget(this)
                    this.hide()
                    delete this
                }
                break
            default:
                break
        }
        this.CM.refresh()
    }

    getValue() {
        return this.value
    }

    setValue(newValue) {
        this.value = newValue
        this.CM.refresh()
        return this
    }

    show() {
        if (!this.visible) {
            this.manageInput()
            this.visible = true
            this.CM.refresh()
        }
        return this
    }

    hide() {
        if (this.visible) {
            this.unManageInput()
            this.visible = false
            this.CM.refresh()
        }
        return this
    }

    isVisible() {
        return this.visible
    }

    manageInput() {
        // Add a command input listener to change mode
        if (this.numeric) {
            this.CM.setKeyListener(this.id, this.keyListnerNumeric.bind(this))
        } else {
            this.CM.setKeyListener(this.id)
        }
        return this
    }

    unManageInput() {
        // Add a command input listener to change mode
        if (this.numeric) {
            this.CM.removeKeyListener(this.id, this.keyListnerNumeric.bind(this))
        } else {
            this.CM.removeKeyListener(this.id)
        }
        return this
    }

    draw() {
        const offset = 2
        const windowWidth = this.title.length > this.value.toString().length ? this.title.length + (2 * offset) : this.value.toString().length + (2 * offset) + 1
        const halfWidth = Math.round((windowWidth - this.title.length) / 2)
        let header = "┌"
        for (let i = 0; i < windowWidth; i++) {
            header += "─"
        }
        header += "┐\n"
        header += `│${" ".repeat(halfWidth)}${this.title}${" ".repeat(windowWidth - halfWidth - this.title.length)}│\n`
        header += "├" + "─".repeat(windowWidth) + "┤\n"

        let footer = "└"
        for (let i = 0; i < windowWidth; i++) {
            footer += "─"
        }
        footer += "┘\n"

        let content = ""
            // Draw an input field
        content += `│${"> "}${this.value}█${" ".repeat(windowWidth - this.value.toString().length - 3)}│\n`

        const windowDesign = `${header}${content}${footer}`
        windowDesign.split('\n').forEach((line, index) => {
            this.CM.Screen.cursorTo(Math.round((this.CM.Screen.width / 2) - (windowWidth / 2)), this.marginTop + index)
            this.CM.Screen.write({ text: line, style: { color: "white" } })
        })
        return this
    }
}

export {
    PageBuilder,
    ConsoleManager,
    OptionPopup,
    InputPopup
}