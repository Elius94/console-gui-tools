import { EventEmitter } from "events"
import chalk from 'chalk';
import readline from 'readline';
chalk.level = 1

class ConsoleManager extends EventEmitter {
    constructor(options) {
        super()
        this.Terminal = process.stdout;
        this.Input = process.stdin;
        if (!ConsoleManager.instance) {
            ConsoleManager.instance = this
            this.Screen = { // TODO: farlo diventare una classe
                width: this.Terminal.columns,
                height: this.Terminal.rows,
                legacy: false,
                buffer: [],
                cursor: {
                    x: 0,
                    y: 0
                },
                maxY: 0,
                currentY: 0,
                startWrite: () => {
                    this.Screen.currentY = 0
                },
                endWrite: () => {
                    if (this.Screen.currentY > this.Screen.maxY) {
                        this.Screen.maxY = this.Screen.currentY
                    }
                },
                write: (str) => {
                    if (this.Screen.legacy) {
                        this.Terminal.write(str)
                    } else {
                        this.Screen.currentY++
                            // Write the string to the buffer at Y, X position,
                            // if X is > 0, and at that Y there's no string, we need to add an empty string to the buffer
                            this.Terminal.write(str) //TODO: REMOVE THIS
                    }
                },
                cursorTo: (x, y) => {
                    if (this.Screen.legacy) {
                        this.Terminal.cursorTo(x, y)
                    } else {
                        this.Screen.cursor.x = x
                        this.Screen.cursor.y = y
                        if (this.Screen.currentY < y) {
                            this.Screen.currentY = y
                        } else if (this.Screen.currentY > y) {
                            this.Screen.currentY = y
                        }
                        this.Terminal.cursorTo(x, y) // TODO: add setCursorPosition
                    }
                },
                update: () => {
                    if (this.Screen.legacy) {
                        console.clear()
                    } else {
                        this.Screen.cursorTo(0, 0)
                    }
                    this.Screen.width = this.Terminal.columns
                    this.Screen.height = this.Terminal.rows
                    this.Screen.buffer = []
                },
                clear: () => {
                    if (!this.Screen.legacy) {
                        this.Screen.cursorTo(0, this.Screen.maxY)
                        this.Terminal.clearScreenDown()
                        this.Screen.maxY = 0
                    }
                }
            }
            this.widgetsCollection = []
            this.stdOut = []
            this.eventListenersContainer = {}
            this.guiLogsPage = 0 // 0 = last
            this.guiLogsRowsPerPage = 10
            this.homePage = ""
            this.layoutBorder = true
            this.changeLayoutKey = "ctrl+l"
            this.logScrollIndex = 0
            this.applicationTitle = ""
            if (options) {
                if (options.logsPageSize) {
                    this.guiLogsRowsPerPage = options.logsPageSize
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
            this.changeLayoutkeys = this.changeLayoutKey.split('+')
            this.addGenericListeners()
            this.layout = new DoubleLayout(this.layoutBorder, 0)

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
                            this.logScrollIndex--
                                if (this.logScrollIndex < 0)
                                    this.logScrollIndex = 0
                            this.updateLogsConsole()
                            return
                        } else if (key.name === 'up') {
                            this.logScrollIndex++
                                if (this.logScrollIndex > this.stdOut.length - this.guiLogsRowsPerPage)
                                    this.logScrollIndex = this.stdOut.length - this.guiLogsRowsPerPage
                            this.updateLogsConsole()
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
        this.Screen.clear()
    }

    // Add Log Functions to the console
    log(message) {
        this.stdOut.push(chalk.white(message))
        this.updateLogsConsole(true)
    }

    error(message) {
        this.stdOut.push(chalk.red(message))
        this.updateLogsConsole(true)
    }

    warn(message) {
        this.stdOut.push(chalk.yellow(message))
        this.updateLogsConsole(true)
    }

    info(message) {
        this.stdOut.push(chalk.blue(message))
        this.updateLogsConsole(true)
    }

    updateLogsConsole(resetCursor) {
        if (resetCursor) {
            this.logScrollIndex = 0
        }
        if (this.stdOut.length > this.guiLogsRowsPerPage) {
            this.layout.setPage2(this.stdOut.slice(this.stdOut.length - this.logScrollIndex - this.guiLogsRowsPerPage, this.stdOut.length - this.logScrollIndex).join('\n'))
            this.refresh()
        } else {
            this.layout.setPage2(this.stdOut.join('\n'))
            this.refresh()
        }
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
    constructor(border = true, selected = 0) {
        this.CM = new ConsoleManager()
        this.border = border
        this.selected = selected
        this.page1 = ""
        this.page2 = ""
        this.logPageTitle = "─LOGS"
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
        const unformattedLine = this.CM.removeColors(line)
        const _line = unformattedLine.length > this.CM.Screen.width - 2 ? this.CM.truncate(unformattedLine, this.CM.Screen.width - 10, false) : line
        const renderedLine = `${this.selected === index ? chalk.cyan("│") : chalk.white("│")}${_line}${" ".repeat(this.CM.Screen.width - this.CM.removeColors(_line).length - 2)}${this.selected === index ? chalk.cyan("│") : chalk.white("│")}`
        this.CM.Screen.write(`${renderedLine}\n`)
    }

    draw() {
        this.CM.Screen.startWrite()
        if (this.border) { // Draw pages with borders 
            this.CM.Screen.write(this.selected === 0 ? chalk.cyan(`┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐\n`) : chalk.white(`┌─${this.applicationTitle}${"─".repeat(this.CM.Screen.width - this.applicationTitle.length - 3)}┐\n`))
            this.page1.split("\n").forEach(line => {
                this.drawLine(line, 0)
            })
            this.CM.Screen.write(chalk.cyan(`├${this.logPageTitle}${"─".repeat(this.CM.Screen.width - this.logPageTitle.length - 2)}┤\n`))
            this.page2.split("\n").forEach(line => {
                this.drawLine(line, 1)
            })
            this.CM.Screen.write(this.selected === 1 ? chalk.cyan(`└${"─".repeat(this.CM.Screen.width - 2)}┘\n`) : chalk.white(`└${"─".repeat(this.CM.Screen.width - 2)}┘\n`))
        } else { // Draw pages without borders
            this.page1.split("\n").forEach(line => {
                this.CM.Screen.write(`${line}\n`)
            })
            this.page2.split("\n").forEach(line => {
                this.CM.Screen.write(`${line}\n`)
            })
        }
        this.CM.Screen.endWrite()
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
        this.CM.Screen.startWrite()
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
            this.CM.Screen.write(line)
        })
        this.CM.Screen.endWrite()
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
        this.CM.Screen.startWrite()
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
            this.CM.Screen.write(line)
        })
        this.CM.Screen.endWrite()
        return this
    }
}

export {
    ConsoleManager,
    OptionPopup,
    InputPopup
}