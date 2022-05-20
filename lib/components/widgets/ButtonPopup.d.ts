/// <reference types="node" />
import { EventEmitter } from "events";
import { ConsoleManager, KeyListenerArgs } from "../../ConsoleGui.js";
/**
 * @class ButtonPopup
 * @extends EventEmitter
 * @description This class is used to create a popup with That asks for a confirm.
 *
 * ![ButtonPopup](https://user-images.githubusercontent.com/14907987/165752116-b796f41a-e4fe-45db-8c90-5d97318bd17a.gif)
 *
 * Emits the following events:
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * @param {string} id - The id of the popup.
 * @param {string} title - The title of the popup.
 * @param {string} message - The message of the popup.
 * @param {Array<string>} buttons - The buttons of the popup (default is ["Yes", "No"]).
 * @param {boolean} visible - If the popup is visible. Default is false (make it appears using show()).
 *
 * @example const popup = new ButtonPopup("popup1", "Choose the option", ["YES", "NO", "?"]).show().on("confirm", (answer) => { console.log(answer) }) // show the popup and wait for the user to confirm
 */
export declare class ButtonPopup extends EventEmitter {
    CM: ConsoleManager;
    id: string;
    title: string;
    message: string;
    buttons: string[];
    selected: number;
    visible: boolean;
    marginTop: number;
    startIndex: number;
    constructor(id: string, title?: string, message?: string, buttons?: string[], visible?: boolean);
    boxChars: {
        normal: {
            topLeft: string;
            topRight: string;
            bottomLeft: string;
            bottomRight: string;
            horizontal: string;
            vertical: string;
        };
        selected: {
            topLeft: string;
            topRight: string;
            bottomLeft: string;
            bottomRight: string;
            horizontal: string;
            vertical: string;
        };
    };
    /**
     * @description This function is used to make the ConsoleManager handle the key events when the popup is showed.
     * Inside this function are defined all the keys that can be pressed and the actions to do when they are pressed.
     * @param {string} _str - The string of the input.
     * @param {any} key - The key object.
     * @memberof ButtonPopup
     */
    keyListner(_str: string, key: KeyListenerArgs): void;
    /**
     * @description This function is used to show the popup. It also register the key events and refresh the ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    show(): ButtonPopup;
    /**
     * @description This function is used to hide the popup. It also unregister the key events and refresh the ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    hide(): ButtonPopup;
    /**
     * @description This function is used to get the visibility of the popup.
     * @returns {boolean} The visibility of the popup.
     * @memberof ButtonPopup
     */
    isVisible(): boolean;
    /**
     * @description This function is used to add the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    private manageInput;
    /**
     * @description This function is used to remove the ButtonPopup key listener callback to te ConsoleManager.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    private unManageInput;
    /**
     * @description This function is used to draw the ButtonPopup to the screen in the middle.
     * @returns {ButtonPopup} The instance of the ButtonPopup.
     * @memberof ButtonPopup
     */
    draw(): ButtonPopup;
}
export default ButtonPopup;
