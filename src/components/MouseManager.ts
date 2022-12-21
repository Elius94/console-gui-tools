import { EventEmitter } from "events"

/**
 * @typedef {Object} MouseEventArgs
 * @description This type is used to define the parameters of the Mouse Listener event (mouseevent) data.
 * 
 * @prop {string} code - The code of the pressed key.
 * @prop {boolean} alt - If the alt key is pressed.
 * @prop {boolean} ctrl - If the ctrl key is pressed.
 * @prop {boolean} shift - If the shift key is pressed.
 * @prop {boolean} left - If the left mouse key is pressed.
 * @prop {boolean} right - If the right mouse key is pressed.
 * @prop {number} x - The x position of the mouse (terminal column).
 * @prop {number} y - The y position of the mouse (terminal row).
 * @prop {number | null} xFrom - The original x position of the mouse (terminal column) when the drag started.
 * @prop {number | null} yFrom - The original y position of the mouse (terminal row) when the drag started.
 *
 * @example const mouseEventArgs = { code: "MOUSE", alt: false, ctrl: false, shift: false, left: true, right: false, x: 10, y: 10, xFrom: null, yFrom: null }
 * 
 * @export
 * @interface MouseEventArgs
 */
export interface MouseEventArgs {
    code: number;
    alt: boolean;
    ctrl: boolean;
    shift: boolean;
    left: boolean;
    right: boolean;
    x: number;
    y: number;
    xFrom: number | null;
    yFrom: number | null;
}

/**
 * @typedef {Object} MouseEvent
 * @description This type is used to define the parameters of the Mouse Listener event (mouseevent).
 * available event names:
 * - MOUSE_MOTION: mouse moved (no button pressed / hover)
 * - MOUSE_DRAG: Valorized xFrom and yFrom. Use left or right to know which button is pressed.
 * - MOUSE_LEFT_BUTTON_PRESS
 * - MOUSE_LEFT_BUTTON_RELEASE
 * - MOUSE_RIGHT_BUTTON_PRESS
 * - MOUSE_RIGHT_BUTTON_RELEASE
 * - MOUSE_MIDDLE_BUTTON_PRESS
 * - MOUSE_MIDDLE_BUTTON_RELEASE
 * - MOUSE_WHEEL_UP
 * - MOUSE_WHEEL_DOWN
 * 
 * @prop {string} name - The name of the event.
 * @prop {number} eaten - The number of eaten events.
 * @prop {MouseEventArgs} args - The arguments of the event.
 *
 * @example const mouseEvent = { name: "MOUSE_MOTION", eaten: 0, args: { code: "MOUSE", alt: false, ctrl: false, shift: false, left: true, right: false, x: 10, y: 10, xFrom: null, yFrom: null } }
 * 
 * @export
 * @interface MouseEvent
 */
export interface MouseEvent {
    name: string;
    eaten: number;
    data: MouseEventArgs;
}

/**
 * @class MouseManager
 * @description This class is used to manage the mouse tracking events.
 * 
 * ![MouseManager](https://user-images.githubusercontent.com/14907987/201913001-713ca6e7-c277-42f7-ac1a-5f90ee1b144f.gif)
 * 
 * Emits the following events: 
 * - "mouseevent" when the user confirm
 * - "error" when an error occurs
 * @param {object} Terminal - The terminal object (process.stdout).
 * @emits mouseevent - The mouse event.
 * 
 * @extends EventEmitter
 * @example const mouse = new MouseManager(process.stdout)
 */
export class MouseManager extends EventEmitter {
    Terminal: NodeJS.WriteStream
    Input: NodeJS.ReadStream
    prependStdinChunk: null | Buffer
    /** @const {Object} keymap - Object containing "MOUSE" array of key codes. */ 
    keymap = {
        MOUSE: [
            { code: "\x1b[<", event: "mouse", handler: "mouseSGRProtocol" },
            { code: "\x1b[M", event: "mouse", handler: "mouseX11Protocol" }
        ]
    }
    /** @const {Object} state - Object containing the state of the mouse buttons. */
    state = {
        button: {
            left: null as null | { x: number, y: number },
            middle: null as null | { x: number, y: number },
            right: null as null | { x: number, y: number },
            other: null as null | { x: number, y: number }
        }
    }

    constructor(_Terminal: NodeJS.WriteStream, _Input: NodeJS.ReadStream) {
        super()
        this.Terminal = _Terminal
        this.Input = _Input
        this.prependStdinChunk = null
    }

    /**
     * @description Manage the mouse events for the x11 protocol.
     * @param {string} basename - The name of the event.
     * @param {Buffer} buffer - The data of the event.
     **/
    mouseX11Protocol = (basename: string, buffer: Buffer) => {
        const code = buffer[0]
        const result = {
            data: {
                shift: !!(code & 4),
                alt: !!(code & 8),
                ctrl: !!(code & 16),
                x: 0,
                y: 0,
                code: 0
            },
            name: "",
            eaten: 0
        } as MouseEvent

        if (code & 32) {
            if (code & 64) {
                result.name = basename + (code & 1 ? "_WHEEL_DOWN" : "_WHEEL_UP")
            }
            else {
                // Button event
                switch (code & 3) {
                case 0: result.name = basename + "_LEFT_BUTTON_PRESSED"; break
                case 1: result.name = basename + "_MIDDLE_BUTTON_PRESSED"; break
                case 2: result.name = basename + "_RIGHT_BUTTON_PRESSED"; break
                case 3: result.name = basename + "_BUTTON_RELEASED"; break
                }
            }
        }
        else if (code & 64) {
            // Motion event
            result.name = basename + "_MOTION"
        }

        result.eaten = 3
        result.data.code = code
        result.data.x = buffer[1] - 32
        result.data.y = buffer[2] - 32

        return result
    }

    /**
     * @description Manage the mouse events for the SGR protocol.
     * @param {string} basename - The name of the event.
     * @param {Buffer} buffer - The data of the event.
     **/
    mouseSGRProtocol = (basename: string, buffer: Buffer) => {
        const matches = buffer.toString().match(/^(-?[0-9]*);?([0-9]*);?([0-9]*)(M|m)/)

        if (!matches || matches[3].length === 0) {
            return {
                name: "ERROR",
                eaten: matches ? matches[0].length : 0,
                data: { matches }
            }
        }

        const code = parseInt(matches[1], 10)
        const pressed = matches[4] !== "m"

        const result = {
            data: {
                shift: !!(code & 4),
                alt: !!(code & 8),
                ctrl: !!(code & 16),
                // , pressed: pressed
                x: 0,
                y: 0,
                code: 0,
                left: false,
                right: false,
                xFrom: null,
                yFrom: null
            },
            name: "",
            eaten: 0
        } as MouseEvent

        result.data.x = parseInt(matches[2], 10)
        result.data.y = parseInt(matches[3], 10)
        result.eaten = matches[0].length

        if (code & 32) {
            // Motions / drag event

            switch (code & 3) {
            case 0:
                // Left drag, or maybe something else (left+right combo)
                result.name = basename + "_DRAG"
                result.data.left = true
                result.data.right = false
                result.data.xFrom = this.state.button.left ? this.state.button.left.x : null
                result.data.yFrom = this.state.button.left ? this.state.button.left.y : null
                break

                // Doesn"t seem to exist, middle drag does not discriminate from motion
                //case 1 :

            case 2:
                // Right drag
                result.name = basename + "_DRAG"
                result.data.left = false
                result.data.right = true
                result.data.xFrom = this.state.button.right ? this.state.button.right.x : null
                result.data.yFrom = this.state.button.right ? this.state.button.right.y : null
                break

            case 3:
            default:
                result.name = basename + "_MOTION"
                break
            }
        }
        else if (code & 64) {
            result.name = basename + (code & 1 ? "_WHEEL_DOWN" : "_WHEEL_UP")
        }
        else {
            // Button event
            switch (code & 3) {
            case 0:
                result.name = basename + "_LEFT_BUTTON"
                //if ( this.state.button.left === pressed ) { result.disable = true ; }
                this.state.button.left = pressed ? result.data : null
                break

            case 1:
                result.name = basename + "_MIDDLE_BUTTON"
                //if ( this.state.button.middle === pressed ) { result.disable = true ; }
                this.state.button.middle = pressed ? result.data : null
                break

            case 2:
                result.name = basename + "_RIGHT_BUTTON"
                //if ( this.state.button.right === pressed ) { result.disable = true ; }
                this.state.button.right = pressed ? result.data : null
                break

            case 3:
                result.name = basename + "_OTHER_BUTTON"
                //if ( this.state.button.other === pressed ) { result.disable = true ; }
                this.state.button.other = pressed ? result.data : null
                break
            }

            result.name += pressed ? "_PRESSED" : "_RELEASED"
        }

        result.data.code = code

        return result
    }

    /**
     * @description Enables "mouseevent" event on the *input* stream. Note that `stream` must be
     * an *output* stream (i.e. a Writable Stream instance), usually `process.stdout`.
     *
     * @api public
     */
    public enableMouse() {
        process.on("exit", () => {
            this.disableMouse()
        })
        //this.Terminal.write("\x1b[?1000h")
        this.Terminal.write("\x1b[?1006h")
        this.Terminal.write("\x1b[?1003h")
        this.Input.on("data", this.onStdin)
    }

    /**
     * @description Disables "mouseevent" event from being sent to the *input* stream.
     * Note that `stream` must be an *output* stream (i.e. a Writable Stream instance),
     * usually `process.stdout`.
     *
     * @api public
     */
    public disableMouse() {
        //this.Terminal.write("\x1b[?1000l")
        this.Input.removeListener("data", this.onStdin)
        this.Terminal.write("\x1b[?1006l")
        this.Terminal.write("\x1b[?1003l")
    }

    /**
     * @description Manage the stdin data to detect mouse events.
     * @param {Buffer} chunk - The data of the event.
     **/
    onStdin = (chunk: Buffer) => {
        let i, bytes, handlerResult, index = 0
        const length = chunk.length

        //if ( shutdown ) { return ; }

        if (this.prependStdinChunk) {
            chunk = Buffer.concat([this.prependStdinChunk, chunk])
        }

        while (index < length) {
            bytes = 1

            if (chunk[index] <= 0x1f || chunk[index] === 0x7f) {
                // Those are ASCII control character and DEL key
                //const buffer = chunk.subarray(index)
                //const keymapCode = buffer.toString()
                const startBuffer = chunk.subarray(index, 3)
                const keymapStartCode = startBuffer.toString()

                const mKeymap = this.keymap["MOUSE"].filter(function (e: { code: string }) { return e.code === keymapStartCode })
                if (mKeymap.length > 0) {
                    // First test fixed sequences
                    if (mKeymap[0].handler) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore - TS doesn't like the dynamic call
                        handlerResult = this[mKeymap[0].handler].call(this, "MOUSE", chunk.subarray(index + 3))
                        bytes = i + handlerResult.eaten

                        if (!handlerResult.disable) {
                            //console.log("emit:", mKeymap[0].event, handlerResult.name, handlerResult.data)
                            this.emit("mouseevent", handlerResult)
                        }
                    }
                }
            }
            index += bytes
        }
    }

    /**
     * @description Test if the key is a part of the mouse event.
     * @param {{ code: string, sequence: string }} key - The key object to test.
     * @return {number} - 1 if the key is the header of a mouse event, -1 if is a body part, 0 otherwise.
     **/
    public isMouseFrame(key: { code: string, sequence: string }, lock: boolean): number {
        /* 
            The only way we have to detect mouse events is to check the first key code of the sequence. 
            it should one of the codes listed in: this.keymap["MOUSE"][x].code
            To capture the end frame of a mouse event, we need to check the last key code of the sequence.
            it should be "m" or "M" (depending on the mouse mode)
            */
        if (key.code && this.keymap["MOUSE"].filter((e: { code: string }) => e.code === key.sequence).length > 0) {
            return 1
        }
        if (lock) {
            if (key.sequence.toLowerCase() === "m") {
                return -1
            }
            return 1
        }
        return 0
    }
}

export default MouseManager