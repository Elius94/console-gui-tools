/**
 * @class OptionPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with a list of selectable options.
 *
 * ![OptionPopup](https://user-images.githubusercontent.com/14907987/165752387-2eac4936-1b5d-462e-9353-562d04f1b4fe.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm the option
 * - "cancel" when the user cancel the option
 * - "exit" when the user exit the option
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {Array<string | number>} options - The options of the popup.
 * @param {string | number} selected - The selected option.
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new OptionPopup("popup1", "Choose the option", options, selectedOption).show().on("confirm", (option) => { console.log(option) }) // show the popup and wait for the user to confirm
 */
export class OptionPopup extends EventEmitter {
    constructor(id: any, title: any, options: any, selected: any, visible?: boolean);
    /** @const {ConsoleManager} CM the instance of ConsoleManager (singleton) */
    CM: ConsoleManager;
    id: any;
    title: any;
    options: any;
    selected: any;
    visible: boolean;
    marginTop: number;
    startIndex: number;
    adaptOptions(): any;
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} str - The string of the input.
     * @param {Object} key - The key object.
     * @memberof OptionPopup
     */
    keyListner(str: string, key: Object): void;
    /**
     * @description This function is used to get the selected option.
     * @returns {string | number} The selected value of the popup.
     * @memberof OptionPopup
     */
    getSelected(): string | number;
    /**
     * @description This function is used to change the selection of the popup. It also refresh the ConsoleManager.
     * @param {string | number} selected - The new value of the selection.
     * @memberof OptionPopup
     * @returns {OptionPopup} The instance of the OptionPopup.
     */
    setSelected(selected: string | number): OptionPopup;
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    show(): OptionPopup;
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    hide(): OptionPopup;
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof OptionPopup
     */
    isVisible(): boolean;
    /**
     * @description This function is used to add the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    manageInput(): OptionPopup;
    /**
     * @description This function is used to remove the OptionPopup key listener callback to te ConsoleManager.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    unManageInput(): OptionPopup;
    /**
     * @description This function is used to draw the OptionPopup to the screen in the middle.
     * @returns {OptionPopup} The instance of the OptionPopup.
     * @memberof OptionPopup
     */
    draw(): OptionPopup;
}
export default OptionPopup;
import { EventEmitter } from "events";
import { ConsoleManager } from "../../ConsoleGui.js";
