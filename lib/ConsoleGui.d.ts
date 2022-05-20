/// <reference types="node" />
import { EventEmitter } from "events";
import DoubleLayout, { DoubleLayoutOptions } from "./components/layout/DoubleLayout.js";
import PageBuilder from "./components/PageBuilder.js";
import Screen from "./components/Screen.js";
import CustomPopup from "./components/widgets/CustomPopup.js";
import ButtonPopup from "./components/widgets/ButtonPopup.js";
import ConfirmPopup from "./components/widgets/ConfirmPopup.js";
import FileSelectorPopup from "./components/widgets/FileSelectorPopup.js";
import InputPopup from "./components/widgets/InputPopup.js";
import OptionPopup from "./components/widgets/OptionPopup.js";
/**
 * @description This type is used to define the parameters of the KeyListener event (keypress).
 * @typedef {Object} KeyListenerArgs
 * @property {string} name - The name of the key pressed.
 * @property {boolean} ctrl - If the ctrl key is pressed.
 * @property {boolean} shift - If the shift key is pressed.
 * @property {boolean} alt - If the alt key is pressed.
 * @property {boolean} meta - If the meta key is pressed.
 * @property {boolean} sequence - If the sequence of keys is pressed.
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
}
/**
 * @description This type is used to define the ConsoleGui options.
 * @typedef {Object} ConsoleGuiOptions
 * @property {string} [title] - The title of the ConsoleGui.
 * @property {0 | 1 | "popup"} [logLocation] - The location of the logs.
 * @property {string} [showLogKey] - The key to show the log.
 * @property {number} [logPageSize] - The size of the log page.
 * @property {DoubleLayoutOptions} [layoutOptions] - The options of the layout.
 *
 * @export
 * @interface ConsoleGuiOptions
 */
export interface ConsoleGuiOptions {
    logLocation?: 0 | 1 | "popup";
    showLogKey?: string;
    logPageSize?: number;
    layoutOptions?: DoubleLayoutOptions;
    title?: string;
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
declare class ConsoleManager extends EventEmitter {
    Terminal: NodeJS.WriteStream & {
        fd: 1;
    };
    Input: NodeJS.ReadStream & {
        fd: 0;
    };
    static instance: ConsoleManager;
    Screen: Screen;
    widgetsCollection: any[];
    eventListenersContainer: {
        [key: string]: (_str: string, key: KeyListenerArgs) => void;
    };
    logLocation: 0 | 1 | "popup";
    logPageSize: number;
    logPageTitle: string;
    pages: PageBuilder[];
    layoutOptions: DoubleLayoutOptions;
    changeLayoutKey: string;
    changeLayoutkeys: string[];
    applicationTitle: string;
    showLogKey: string;
    stdOut: PageBuilder;
    layout: DoubleLayout;
    constructor(options?: ConsoleGuiOptions | undefined);
    getLogPageSize(): number;
    setLogPageSize(rows: number): void;
    /**
     * @description This function is used to make the ConsoleManager handle the key events when no widgets are showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @memberof ConsoleManager
     */
    private addGenericListeners;
    /**
     * @description This function is used to set a key listener for a specific widget. The event listener is stored in the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @param {function} manageFunction - The function to call when the key is pressed.
     * @memberof ConsoleManager
     * @example CM.setKeyListener('inputPopup', popup.keyListener)
     */
    setKeyListener(id: string, manageFunction: (_str: string, key: KeyListenerArgs) => void): void;
    /**
     * @description This function is used to remove a key listener for a specific widget. The event listener is removed from the eventListenersContainer object.
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     * @example CM.removeKeyListener('inputPopup')
     */
    removeKeyListener(id: string): void;
    /**
     * @description This function is used to register a widget. The widget is stored in the widgetsCollection object. That is called by the widgets in show().
     * @param {Widget} widget - The widget to register.
     * @memberof ConsoleManager
     */
    registerWiget(widget: any): void;
    /**
     * @description This function is used to unregister a widget. The widget is removed from the widgetsCollection object. That is called by the widgets in hide().
     * @param {string} id - The id of the widget.
     * @memberof ConsoleManager
     */
    unRegisterWidget(widget: any): void;
    /**
     * @description This function is used to set the home page. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setHomePage(p)
     * @deprecated since version 1.1.12 - Use setPage or setPages instead
     */
    setHomePage(page: PageBuilder): void;
    /**
     * @description This function is used to set a page of layout. It also refresh the screen.
     * @param {PageBuilder} page - The page to set as home page.
     * @param {number} [pageNumber] - The page number to set. 0 is the first page, 1 is the second page.
     * @param {string} [title] - The title of the page to overwrite the default title. Default is null.
     * @memberof ConsoleManager
     * @example CM.setPage(p, 0)
     */
    setPage(page: PageBuilder, pageNumber?: number, title?: string | null): void;
    /**
     * @description This function is used to set both pages of layout. It also refresh the screen.
     * @param {Array<PageBuilder>} pages - The page to set as home page.
     * @memberof ConsoleManager
     * @example CM.setPages([p1, p2], 0)
     */
    setPages(pages: Array<PageBuilder>): void;
    /**
     * @description This function is used to refresh the screen. It do the following sequence: Clear the screen, draw layout, draw widgets and finally print the screen to the stdOut.
     * @memberof ConsoleManager
     * @example CM.refresh()
     */
    refresh(): void;
    /**
     * @description This function is used to show a popup containing all the stdOut of the console.
     * @memberof ConsoleManager
     * @returns the instance of the generated popup.
     * @example CM.showLogPopup()
     */
    showLogPopup(): CustomPopup;
    /**
     * @description This function is used to log a message. It is used to log messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.log("Hello world")
     */
    log(message: string): void;
    /**
     * @description This function is used to log an error message. It is used to log red messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.error("Anomaly detected")
     */
    error(message: string): void;
    /**
     * @description This function is used to log a warning message. It is used to log yellow messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.warn("Anomaly detected")
     */
    warn(message: string): void;
    /**
     * @description This function is used to log an info message. It is used to log blue messages in the log page. Don't add colors to the message.
     * @param {string} message - The message to log.
     * @memberof ConsoleManager
     * @example CM.info("Anomaly detected")
     */
    info(message: string): void;
    /**
     * @description This function is used to update the logs console. It is called by the log functions.
     * @param {boolean} resetCursor - If true, the log scroll index is resetted.
     * @memberof ConsoleManager
     */
    private updateLogsConsole;
    /**
     * @description This function is used to truncate a string adding ... at the end.
     * @param {string} str - The string to truncate.
     * @param {number} n - The number of characters to keep.
     * @param {boolean} useWordBoundary - If true, the truncation will be done at the end of the word.
     * @memberof ConsoleManager
     * @example CM.truncate("Hello world", 5, true) // "Hello..."
     */
    truncate(str: string, n: number, useWordBoundary: boolean): string;
}
export { PageBuilder, ConsoleManager, OptionPopup, InputPopup, ConfirmPopup, ButtonPopup, CustomPopup, FileSelectorPopup };
