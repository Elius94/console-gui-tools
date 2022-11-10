import { EventEmitter } from "events"

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
 * @class MouseManager
 * @description This class is used to manage the mouse tracking events.
 * @param {object} Terminal - The terminal object (process.stdout).
 * @extends EventEmitter
 * @example const mouse = new MouseManager(process.stdout)
 */
export class MouseManager extends EventEmitter {
    Terminal: NodeJS.WriteStream
    Input: NodeJS.ReadStream

    constructor(_Terminal: NodeJS.WriteStream, _Input: NodeJS.ReadStream) {
        super()
        this.Terminal = _Terminal
        this.Input = _Input
    }

    /**
     * Enables "mousepress" events on the *input* stream. Note that `stream` must be
     * an *output* stream (i.e. a Writable Stream instance), usually `process.stdout`.
     *
     * @api public
     */
    public enableMouse() {
        process.on("exit", () => {
            this.disableMouse()
        })
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
                //this.log(`Mouse event: ${JSON.stringify(key)}`)
                // Now we have to propagate the mouse event to the upper layers.
                this.emit("mousepress", key)
            } else {
                // something else...
                //console.error(0, s, b)
                this.emit("error", s, b)
            }
        })
    }

    /**
     * Disables "mousepress" events from being sent to the *input* stream.
     * Note that `stream` must be an *output* stream (i.e. a Writable Stream instance),
     * usually `process.stdout`.
     *
     * @api public
     */
    public disableMouse() {
        this.Terminal.write("\x1b[?1000l")
        this.Terminal.write("\x1b[?1005l")
        this.Terminal.write("\x1b[?1003l")
    }

    public isMouseFrame(keyCode: string, frameCounter: number) : false | number {
        /* 
            Use this filter to grab the mouse events "[M" and then skip the rest 3 bytes of the following mouse events
            The mouse events are handled in the enableMouse() function
            The trouble is that "readline" doesn't handle the mouse events so I have to do it manually
            every mouse event acts like a 4 keypress events: the first has the "code" property set to "[M" 
            and the other 3 have the "code" property set to "undefined" and they acts like normal keys.
            so they can be confused with normal keys.
            */
        //this.log(JSON.stringify(key))
        if (keyCode && keyCode === "[M") {
            return 3
        }
        if (frameCounter > 0) {
            return frameCounter - 1
        }
        return false
    }
}

export default MouseManager