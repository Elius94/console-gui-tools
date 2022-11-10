import { EventEmitter } from "events"
import readline from "readline"
import PageBuilder from "./components/PageBuilder.js"
import Screen from "./components/Screen.js"
import CustomPopup from "./components/widgets/CustomPopup.js"
import ButtonPopup from "./components/widgets/ButtonPopup.js"
import ConfirmPopup from "./components/widgets/ConfirmPopup.js"
import FileSelectorPopup from "./components/widgets/FileSelectorPopup.js"
import InputPopup from "./components/widgets/InputPopup.js"
import OptionPopup from "./components/widgets/OptionPopup.js"
import LayoutManager, { LayoutOptions } from "./components/layout/LayoutManager.js"


/**
 * @description This type is used to define the parameters of the KeyListener event (keypress).
 * @typedef {Object} KeyListenerArgs
 * @prop {string} name - The name of the key pressed.
 * @prop {boolean} ctrl - If the ctrl key is pressed.
 * @prop {boolean} shift - If the shift key is pressed.
 * @prop {boolean} alt - If the alt key is pressed.
 * @prop {boolean} meta - If the meta key is pressed.
 * @prop {boolean} sequence - If the sequence of keys is pressed.
 *
 * @export
 * @interface KeyListenerArgs
 */
export interface KeyListenerArgs {
    name: string;
    sequence: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
    code: string;
}

/**
 * @description This type is used to define the parameters of the Mouse Listener event (mousepress).
 * @typedef {Object} MouseListenerArgs
 * @prop {string} name - The name of the key pressed.
 * @prop {boolean} ctrl - If the ctrl key is pressed.
 * @prop {boolean} shift - If the shift key is pressed.
 * @prop {boolean} alt - If the alt key is pressed.
 * @prop {boolean} meta - If the meta key is pressed.
 * @prop {boolean} sequence - If the sequence of keys is pressed.
 * @prop {number} x - The x position of the mouse.
 * @prop {number} y - The y position of the mouse.
 * @prop {number} scroll - The scroll of the mouse.
 * @prop {number | string | null} button - The button of the mouse.
 * @prop {Buffer} buf - The buffer of the mouse.
 *
 * @export
 * @interface MouseListenerArgs
 */
export interface MouseListenerArgs {
    name?: string;
    sequence?: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    code?: string;
    x?: number;
    y?: number;
    scroll?: number;
    button?: number | string | null;
    buf?: Buffer;
}

/**
 * @description This type is used to define the ConsoleGui options.
 * @typedef {Object} ConsoleGuiOptions
 * @prop {string} [title] - The title of the ConsoleGui.
 * @prop {0 | 1 | 2 | 3 | "popup"} [logLocation] - The location of the logs.
 * @prop {string} [showLogKey] - The key to show the log.
 * @prop {number} [logPageSize] - The size of the log page.
 * @prop {LayoutOptions} [layoutOptions] - The options of the layout.
 *
 * @export
 * @interface ConsoleGuiOptions
 */
export interface ConsoleGuiOptions {
    logLocation?: 0 | 1 | 2 | 3 | "popup";
    showLogKey?: string;
    logPageSize?: number;
    layoutOptions?: LayoutOptions;
    title?: string;
    enableMouse?: boolean; // enable the mouse support (default: true) - Only for Linux and other Mouse Tracking terminals
}

/**
 * @class ConsoleManager
 * @extends EventEmitter
 * @description This class is used to manage the console GUI and all the widgets.
 * This is a singleton class, so you can use it like this: const CM = new ConsoleManager()
 * Emits the following events: 
 * - "keypressed" to propagate the key pressed event to the application
 * - "exit" when the user wants to exit the application
 * @param {object} options - The options of the ConsoleManager.
 * @example const CM = new ConsoleManager({ logPageSize: 10, layoutBorder: true, changeLayoutKey: 'ctrl+l', title: 'Console Application' })
 */
class ConsoleManager extends EventEmitter {
    Terminal: NodeJS.WriteStream & { fd: 1 }
    Input: NodeJS.ReadStream & { fd: 0 }
    static instance: ConsoleManager
    Screen!: Screen
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    widgetsCollection: any[] = []
    eventListenersContainer: { [key: string]: (_str: string, key: KeyListenerArgs) => void } = {}
    logLocation!: 0 | 1 | 2 | 3 | "popup"
    logPageSize!: number
    logPageTitle!: string
    pages!: PageBuilder[]
    layoutOptions!: LayoutOptions
    layout!: LayoutManager
    changeLayoutKey!: string
    changeLayoutkeys!: string[]
    applicationTitle!: string
    showLogKey!: string
    stdOut!: PageBuilder
    remainingMouseFrames = 0 // used to avoid the mouse event to be triggered multiple times

    public constructor(options: ConsoleGuiOptions | undefined = undefined) {
        super()
        this.Terminal = process.stdout
        this.Input = process.stdin
        if (!ConsoleManager.instance) {
            ConsoleManager.instance = this

            /** @const {Screen} Screen - The screen instance */
            this.Screen = new Screen(this.Terminal)
            this.Screen.on("error", (err) => {
                this.error(err)
            })

            this.widgetsCollection = []
            this.eventListenersContainer = {}

            /** @const {number | 'popup'} logLocation - Choose where the logs are displayed: number (0,1) - to pot them on one of the two layouts, string ("popup") - to put them on a CustomPopup that can be displayed on the window. */
            this.logLocation = 1
            this.logPageSize = 10
            this.logPageTitle = "LOGS"

            this.layoutOptions = {
                showTitle: true,
                boxed: true,
                boxColor: "cyan",
                boxStyle: "bold",
                changeFocusKey: "ctrl+l",
                type: "double",
                direction: "vertical",
            }

            /** @const {string} changeLayoutKey - The key or combination to switch the selected page */
            this.changeLayoutKey = this.layoutOptions.changeFocusKey
            this.changeLayoutkeys = this.changeLayoutKey.split("+")
            this.applicationTitle = ""

            if (options) {
                if (options.logLocation !== undefined) {
                    if (typeof options.logLocation === "number") {
                        this.logLocation = options.logLocation > 0 ? options.logLocation : 0
                    } else {
                        if (options.logLocation === "popup") {
                            this.logLocation = "popup"
                            this.showLogKey = options.showLogKey || "o"
                        } else {
                            this.logLocation = 1
                        }
                    }
                }
                if (options.logPageSize) {
                    this.logPageSize = options.logPageSize
                }
                if (typeof options.layoutOptions !== "undefined") {
                    this.layoutOptions = options.layoutOptions
                    if (options.layoutOptions.changeFocusKey) {
                        this.changeLayoutKey = options.layoutOptions.changeFocusKey
                    }
                }
                if (options.title) {
                    this.applicationTitle = options.title
                }
                if (options.enableMouse) {
                    this.enableMouse()
                    process.on("exit", () => {
                        this.disableMouse()
                    })
                }
            }

            /** @const {Array<PageBuilder>} homePage - The main application */
            switch (this.layoutOptions.type) {
            case "single":
                this.pages = [new PageBuilder()]
                break
            case "double":
                this.pages = [new PageBuilder(), new PageBuilder()]
                break
            case "triple":
                this.pages = [new PageBuilder(), new PageBuilder(), new PageBuilder()]
                break
            case "quad":
                this.pages = [new PageBuilder(), new PageBuilder(), new PageBuilder(), new PageBuilder()]
                break
            default:
                this.pages = [new PageBuilder(), new PageBuilder()]
                break
            }

            /** @const {PageBuilder} stdOut - The logs page */
            this.stdOut = new PageBuilder()
            this.stdOut.setRowsPerPage(this.logPageSize)

            /** @const {LayoutManager} layout - The layout instance */
            this.layout = new LayoutManager(this.pages, this.layoutOptions)

            if (this.logLocation === "popup") {
                this.setPages(this.pages)
            } else if (typeof this.logLocation === "number") {
                this.setPage(this.stdOut, this.logLocation)
                this.pages.forEach((page, index) => {
                    if (index !== this.logLocation) {
                        this.setPage(page, index)
                    }
                })
                this.layout.setTitle(this.logPageTitle, this.logLocation)
            } else {
                this.setPages([...this.pages, this.stdOut])
                this.layout.setTitle(this.applicationTitle, 0)
                this.layout.setTitle(this.logPageTitle, 1)
            }
            this.addGenericListeners()

            // I use readline to manage the keypress event
            readline.emitKeypressEvents(this.Input)
            this.Input.setRawMode(true) // With this I only get the key value
        }
        return ConsoleManager.instance
    }

    /**
     * Enables "mousepress" events on the *input* stream. Note that `stream` must be
     * an *output* stream (i.e. a Writable Stream instance), usually `process.stdout`.
     *
     * @param {Stream} stream writable stream instance
     * @api public
     */
    private enableMouse() {
        this.Terminal.write("\x1b[?1000h")
        this.Terminal.write("\x1b[?1005h")
        this.Terminal.write("\x1b[?1003h")
        this.Input.on("data", (b) => {
            const s = b.toString("utf8")
            if (s === "\u0003") {
                //console.error("Ctrl+C")
                this.Input.pause()
            // eslint-disable-next-line no-control-regex
            } else if (/^\u001b\[M/.test(s)) {
                // mouse event
                //console.error("s.length:", s.length)
                // reuse the key array albeit its name
                // otherwise recompute as the mouse event is structured differently
                const modifier = s.charCodeAt(3)
                const key: MouseListenerArgs = {}
                key.shift = !!(modifier & 4)
                key.meta = !!(modifier & 8)
                key.ctrl = !!(modifier & 16)
                key.x = s.charCodeAt(4) - 32
                key.y = s.charCodeAt(5) - 32
                key.button = null
                key.sequence = s
                key.buf = Buffer.from(key.sequence)
                if ((modifier & 96) === 96) {
                    key.name = "scroll"
                    key.button = modifier & 1 ? "down" : "up"
                } else {
                    key.name = modifier & 64 ? "move" : "click"
                    switch (modifier & 3) {
                    case 0 : key.button = "left"; break
                    case 1 : key.button = "middle"; break
                    case 2 : key.button = "right"; break
                    case 3 : key.button = "none"; break
                    default : return
                    }
                }
                this.log(`Mouse event: ${JSON.stringify(key)}`)
                // Now we have to propagate the mouse event to the upper layers.
                // TODO: propagate the mouse event to the upper layers
            } else {
                // something else...
                //console.error(0, s, b)
            }
        })
    }

    /**
     * Disables "mousepress" events from being sent to the *input* stream.
     * Note that `stream` must be an *output* stream (i.e. a Writable Stream instance),
     * usually `process.stdout`.
     *
     * @param {Stream} stream writable stream instance
     * @api public
     */
    private disableMouse() {
        this.Terminal.write("\x1b[?1000l")
        this.Terminal.write("\x1b[?1005l")
        this.Terminal.write("\x1b[?1003l")
    }

    /**
     * @description This method is used to get the log page size.
     * @returns {number} The log page size.
     * @memberof ConsoleManager
     * @example CM.getLogPageSize()
     */
    public getLogPageSize(): number {
        return this.logPageSize
    }

    /**
     * @description This method is used to set the log page size.
     * @param {number} size - The new log page size.
     * @returns {void}
     * @example CM.setLogPageSize(10)
     */
    public setLogPageSize(size: number): void {
        this.logPageSize = size
    }

    /**
     * @description This function is used to make the ConsoleManager handle the key events when no widgets are showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @memberof ConsoleManager
     */
    private addGenericListeners(): void {
        this.Input.addListener("keypress", (_str: string, key: KeyListenerArgs): void => {
            /* 
                Use this filter to grab the mouse events "[M" and then skip the rest 3 bytes of the following mouse events
                The mouse events are handled in the enableMouse() function
                The trouble is that "readline" doesn't handle the mouse events so I have to do it manually
                every mouse event acts like a 4 keypress events: the first has the "code" property set to "[M" 
                and the other 3 have the "code" property set to "undefined" and they acts like normal keys.
                so they can be confused with normal keys.
                */
            //this.log(JSON.stringify(key))
            if (key.code && key.code === "[M") {
                this.remainingMouseFrames = 3
                return
            }
            if (this.remainingMouseFrames > 0) {
                this.remainingMouseFrames--
                return
            }
            let change = false
            if (this.changeLayoutkeys.length > 1) {
                if (this.changeLayoutkeys[0] == "ctrl") {
                    if (key.ctrl && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == "meta") {
                    if (key.alt && key.name === this.changeLayoutkeys[1])
                        change = true
                }
                if (this.changeLayoutkeys[0] == "shift") {
                    if (key.shift && key.name === this.changeLayoutkeys[1])
                        change = true
                }
            } else {
                if (key.name === this.changeLayoutkeys[0])
                    change = true
            }

            if (this.showLogKey && key.name === this.showLogKey) {
                this.showLogPopup()
            }

            if (change) {
                this.layout.changeLayout()
                this.refresh()
                return
            }

            if (key.ctrl && key.name === "c") {
                this.emit("exit")
            } else {
                if (Object.keys(this.widgetsCollection).length === 0) {
                    if (key.name === "down") {
                        this.layout.pages[this.layout.getSelected()].decreaseScrollIndex()
                        this.refresh()
                        return
                    } else if (key.name === "up") {
                        this.layout.pages[this.layout.getSelected()].increaseScrollIndex()
                        this.refresh()
                        return
                    }
                    if (this.layoutOptions.type !== "single") {
                        if (key.name === "left") {
                            this.layout.decreaseRatio(0.01)
                            this.refresh()
                            return
                        } else if (key.name === "right") {
                            this.layout.increaseRatio(0.01)
                            this.refresh()
                            return
                        }
                    }
                    this.emit("keypressed", key)
                }
            }
        })
    }

    /**
     * @description This function is used to set a key listener for a specific widget. The event listener is stored in the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @param {function} manageFunction - The function to call when the key is pressed.
     * @memberof ConsoleManager
     * @example CM.setKeyListener('inputPopup', popup.keyListener)
     */
    public setKeyListener(id: string, manageFunction: (_str: string, key: KeyListenerArgs) => void): void {
        this.eventListenersContainer[id] = manageFunction
        this.Input.addListener("keypress", this.eventListenersContainer[id])
    }

    /**
     * @description This function is used to remove a key listener for a specific widget. The event listener is removed from the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     * @example CM.removeKeyListener('inputPopup')
     */
    public removeKeyListener(id: string): void {
        this.Input.removeListener("keypress", this.eventListenersContainer[id])
        delete this.eventListenersContainer[id]
    }

    /**
     * @description This function is used to register a widget. The widget is stored in the widgetsCollection object. That is called by the widgets in show().
     * @param {Widget} widget - The widget to register.
     * @memberof ConsoleManager
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public registerWiget(widget: any): void {
        this.widgetsCollection[widget.id] = widget
    }

    /**
     * @description This function is used to unregister a widget. The widget is removed from the widgetsCollection object. That is called by the widgets in hide().
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public unRegisterWidget(widget: any): void {
        if (this.widgetsCollection[widget.id]) {
            delete this.widgetsCollection[widget.id]
        }
    }

    /**
     * @description This function is used to set the home page. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setHomePage(p)
     * @deprecated since version 1.1.12 - Use setPage or setPages instead
     */
    public setHomePage(page: PageBuilder): void {
        this.pages[0] = page
        if (this.logLocation === "popup") {
            this.layout.setPage(page, 0)
        } else if (typeof this.logLocation === "number") {
            if (this.logLocation === 0) {
                this.layout.setPage(page, 1)
            } else {
                this.layout.setPage(page, 0)
            }
        } else {
            this.layout.setPage(page, 1)
        }
        this.refresh()
    }

    /**
     * @description This function is used to set a page of layout. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @param {number} [pageNumber] - The page number to set. 0 is the first page, 1 is the second page.
     * @param {string | null} [title] - The title of the page to overwrite the default title. Default is null.
     * @memberof ConsoleManager
     * @example CM.setPage(p, 0)
     */
    public setPage(page: PageBuilder, pageNumber = 0, title: string | null = null): void {
        this.pages[pageNumber] = page
        if (typeof this.logLocation === "number") {
            if (this.logLocation === pageNumber) {
                this.pages[this.logLocation] = this.stdOut
            }
        }
        this.layout.setPage(this.pages[pageNumber], pageNumber)
        if (title) this.layout.setTitle(title, pageNumber)
        this.refresh()
    }

    /**
     * @description This function is used to set both pages of layout. It also refresh the screen.
     * @param {Array<PageBuilder>} pages - The page to set as home page.
     * @param {string[] | null} [titles] - The titles of the page to overwrite the default titles. Default is null.
     * @memberof ConsoleManager
     * @example CM.setPages([p1, p2], 0)
     */
    public setPages(pages: Array<PageBuilder>, titles: string[] | null = null): void {
        pages.forEach((page, index) => {
            if (typeof this.logLocation === "number" && this.logLocation === index) {
                return
            } else {
                this.pages[index] = page
            }
        })
        this.layout.setPages(this.pages)
        if (titles) this.layout.setTitles(titles)
        this.refresh()
    }

    /**
     * @description This function is used to refresh the screen. It do the following sequence: Clear the screen, draw layout, draw widgets and finally print the screen to the stdOut.
     * @memberof ConsoleManager
     * @example CM.refresh()
     */
    public refresh(): void {
        this.Screen.update()
        this.layout.draw()
        for (const widget in this.widgetsCollection) {
            if (this.widgetsCollection[widget].isVisible())
                this.widgetsCollection[widget].draw()
        }
        this.Screen.print()
    }

    /**
     * @description This function is used to show a popup containing all the stdOut of the console.
     * @memberof ConsoleManager
     * @returns the instance of the generated popup.
     * @example CM.showLogPopup()
     */
    public showLogPopup(): CustomPopup {
        return new CustomPopup("logPopup", "Application Logs", this.stdOut, this.Screen.width - 12).show()
    }

    /**
     * @description This function is used to log a message. It is used to log messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.log("Hello world")
     */
    public log(message: string): void {
        this.stdOut.addRow({ text: message, color: "white" })
        this.updateLogsConsole(true)
    }

    /** 
     * @description This function is used to log an error message. It is used to log red messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.error("Anomaly detected")
     */
    public error(message: string): void {
        this.stdOut.addRow({ text: message, color: "red" })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to log a warning message. It is used to log yellow messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.warn("Anomaly detected")
     */
    public warn(message: string): void {
        this.stdOut.addRow({ text: message, color: "yellow" })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to log an info message. It is used to log blue messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.info("Anomaly detected")
     */
    public info(message: string): void {
        this.stdOut.addRow({ text: message, color: "blue" })
        this.updateLogsConsole(true)
    }

    /**
     * @description This function is used to update the logs console. It is called by the log functions.
     * @param {boolean} resetCursor - If true, the log scroll index is resetted.
     * @memberof ConsoleManager
     */
    private updateLogsConsole(resetCursor: boolean): void {
        if (resetCursor) {
            this.stdOut.setScrollIndex(0)
        }
        this.refresh()
    }

    // TODO: move to utils
    /**
     * @description This function is used to truncate a string adding ... at the end.
     * @param {string} str - The string to truncate.
     * @param {number} n - The number of characters to keep.
     * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
     * @memberof ConsoleManager
     * @example CM.truncate("Hello world", 5, true) // "Hello..."
     */
    public truncate(str: string, n: number, useWordBoundary: boolean): string {
        if (str.length <= n) { return str }
        const subString = str.substring(0, n - 1) // the original check
        return (useWordBoundary ?
            subString.substring(0, subString.lastIndexOf(" ")) :
            subString) + "…"
    }
}

export {
    PageBuilder,
    ConsoleManager,
    OptionPopup,
    InputPopup,
    ConfirmPopup,
    ButtonPopup,
    CustomPopup,
    FileSelectorPopup
}