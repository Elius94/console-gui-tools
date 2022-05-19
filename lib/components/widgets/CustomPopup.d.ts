/**
 * @class CustomPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a free content built with PageBuilder class.
 *
 * ![Animation](https://user-images.githubusercontent.com/14907987/165736767-d60f857f-3945-4b95-aa4f-292b6a41f789.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * - "data" when the user send custom event - the data is an object with the data and the event name
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {PageBuilder} content - The content of the popup.
 * @param {number} width - The width of the popup.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new CustomPopup("popup1", "See that values", new PageBuilder()).show()
 */
export class CustomPopup extends EventEmitter {
    constructor(id: any, title: any, content: any, width: any, visible?: boolean);
    /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
    CM: ConsoleManager;
    id: any;
    title: any;
    content: any;
    width: any;
    visible: boolean;
    marginTop: number;
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the input is text and it is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof CustomPopup
     */
    keyListner(str: string, key: Object): void;
    /**
     * @description This function is used to get the content of the popup.
     * @returns {PageBuilder} The content of the popup.
     * @memberof CustomPopup
     */
    getContent(): PageBuilder;
    /**
     * @description This function is used to change the content of the popup. It also refresh the ConsoleManager.
     * @param {PageBuilder} newContent - The new content of the popup.
     * @memberof CustomPopup
     * @returns {CustomPopup} The instance of the CustomPopup.
     */
    setContent(newContent: PageBuilder): CustomPopup;
    /**
     * @description This function is used to change the popup width. It also refresh the ConsoleManager.
     * @param {number} newWidth - The new width of the popup.
     * @memberof CustomPopup
     * @returns {CustomPopup} The instance of the CustomPopup.
     */
    setWidth(newWidth: number): CustomPopup;
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    show(): CustomPopup;
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    hide(): CustomPopup;
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof CustomPopup
     */
    isVisible(): boolean;
    /**
     * @description This function is used to add the CustomPopup key listener callback to te ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    manageInput(): CustomPopup;
    /**
     * @description This function is used to remove the CustomPopup key listener callback to te ConsoleManager.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    unManageInput(): CustomPopup;
    /**
     * @description This function is used to draw a single line of the layout to the screen. It also trim the line if it is too long.
     * @param {Array<object>} line the line to be drawn
     * @memberof CustomPopup
     * @returns {void}
     */
    drawLine(line: Array<object>, width: any): void;
    /**
     * @description This function is used to draw the CustomPopup to the screen in the middle.
     * @returns {CustomPopup} The instance of the CustomPopup.
     * @memberof CustomPopup
     */
    draw(): CustomPopup;
}
export default CustomPopup;
import { EventEmitter } from "events";
import { ConsoleManager } from "../../ConsoleGui.js";
