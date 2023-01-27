import { KeyListenerArgs } from "../../ConsoleGui.js"
import ButtonPopup from "./ButtonPopup.js"

/**
 * @description The configuration for the ConfirmPopup class.
 * @typedef {Object} ConfirmPopupConfig
 * 
 * @prop {string} id - The id of the popup.
 * @prop {string} title - The title of the popup.
 * @prop {string} [message] - The message of the popup.
 *
 * @export
 * @interface ConfirmPopupConfig
 */
// @type definition
export interface ConfirmPopupConfig {
    id: string,
    title: string,
    message?: string,
}

/**
 * @class ConfirmPopup
 * @extends ButtonPopup
 * @description This class is an overload of ButtonPopup that is used to create a popup with That asks for a confirm [Yes, No]. 
 * 
 * ![ConfirmPopup](https://user-images.githubusercontent.com/14907987/165752226-b76b157f-4935-4248-a5cc-3b21d087cb04.gif)
 * 
 * Emits the following events: 
 * - "confirm" when the user confirm
 * - "cancel" when the user cancel
 * - "exit" when the user exit
 * @param {ConfirmPopupConfig} config - The configuration of the popup.
 * 
 * @example ```ts
 * const popup = new ConfirmPopup({
 *  id: "popup1", 
 *  title: "Are you shure",
 * }) 
 * popup.show() // show the popup
 * popup.on("confirm", (answer) => {
 *  console.log(console.log(answer))
 * })
 * ```
 */
export class ConfirmPopup extends ButtonPopup {
    public constructor(config: ConfirmPopupConfig) {
        if (!config) throw new Error("The config is not defined")
        const { id, title, message } = config
        super({
            id,
            title,
            message,
            buttons: ["Yes", "No"],
            visible: false,
        })
        super.keyListener = (_str: string, key : KeyListenerArgs) => {
            const checkResult = this.CM.mouse.isMouseFrame(key, this.parsingMouseFrame)
            if (checkResult === 1) {
                this.parsingMouseFrame = true
                return
            } else if (checkResult === -1) {
                this.parsingMouseFrame = false
                return
            } // Continue only if the result is 0
            switch (key.name) {
            case "left":
                if (this.selected > 0 && this.selected <= this.buttons.length) {
                    this.selected--
                } else {
                    return
                }
                break
            case "right":
                if (this.selected >= 0 && this.selected < this.buttons.length - 1) {
                    this.selected++
                } else {
                    return
                }
                break
            case "return":
                {
                    if (this.selected === 0) {
                        this.emit("confirm")
                    } else {
                        this.emit("cancel")
                    }
                    this.CM.unregisterPopup(this)
                    this.hide()
                    //delete this
                }
                break
            case "escape":
                {
                    this.emit("cancel")
                    this.CM.unregisterPopup(this)
                    this.hide()
                    //delete this
                }
                break
            case "q":
                {
                    this.CM.emit("exit")
                    this.CM.unregisterPopup(this)
                    this.hide()
                    //delete this
                }
                break
            default:
                break
            }
            this.CM.refresh()
        }
    }
}

export default ConfirmPopup