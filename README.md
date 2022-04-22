# console-gui-tools
 A simple library to draw option menu, text popup or other widgets and layout on a Node.js console.

[![npm version](https://badge.fury.io/js/console-gui-tools.svg)](https://npmjs.com/package/console-gui-tools) [![npm](https://img.shields.io/npm/dt/console-gui-tools)](https://npmjs.com/package/console-gui-tools) ![npm bundle size](https://img.shields.io/bundlephobia/min/console-gui-tools) ![GitHub](https://img.shields.io/github/license/elius94/console-gui-tools)

# console-gui-tools
A simple Node.js library to create Console Apps like a wizard (or maybe if you like old style colored screen or something like "teletext" programs 😂)
Apart from jokes, it is a library that allows you to create a screen divided into a part with everything you want to see (such as variable values) and another in which the logs run.
Moreover in this way the application is managed by the input event "keypressed" to which each key corresponds to a bindable command.
For example, to change variables you can open popups with an option selector or with a textbox.
It's in embryonic phase, any suggestion will be constructive :D

![Animation](https://user-images.githubusercontent.com/14907987/164765317-062c0fe9-7af3-4aa5-a96e-9407a9245341.gif)


 [![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=elius94&repo=console-gui-tools&theme=github_dark&show_icons=true)](https://github.com/Elius94/console-gui-tools) [![https://nodei.co/npm/console-gui-tools.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/console-gui-tools.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/console-gui-tools)

## Installation

Install with:
```sh
npm i console-gui-tools
```

## Options
The library has a few options that can be set in the constructor.

### options.title
The title of the application. It will be displayed in the top of the screen.

### options.logsPageSize
The number of lines that will be displayed in the logs page.

### options.changeLayoutKey
The key that will be used to change the layout. (To switch between the two pages, logs and main page)

### options.layoutBorder
To enable the border of the layout and the title.

Example of usage:
```js
// Import module with ES6 syntax
import { ConsoleManager, OptionPopup, InputPopup, PageBuilder, ButtonPopup, ConfirmPopup } from '../src/ConsoleGui.js'
const GUI = new ConsoleManager({
    title: 'TCP Simulator', // Title of the console
    logsPageSize: 8, // Number of lines to show in logs page
    changeLayoutKey: 'ctrl+l', // Change layout with ctrl+l to switch to the logs page
})

// Creating a main page updater:
const updateConsole = async() => {
    const p = new PageBuilder()
    p.addRow({ text: `TCP server simulator app! Welcome...`, color: 'yellow' })
    p.addRow({ text: `TCP Server listening on ${HOST}:${PORT}`, color: 'green' })
    p.addRow({ text: `Connected clients:`, color: 'green' }, { text: ` ${connectedClients}`, color: 'white' })
    p.addRow({ text: `TCP messages sent:`, color: 'green', bg: 'bgRed', bold: true, italic: true, underline: true }, { text: ` ${tcpCounter}`, color: 'white' })

    // Print if simulator is running or not
    if (!valueEmitter) {
        p.addRow({ text: `Simulator is not running! `, color: 'red' }, { text: `press 'space' to start`, color: 'white' })
    } else {
        p.addRow({ text: `Simulator is running! `, color: 'green' }, { text: `press 'space' to stop`, color: 'white' })
    }

    // Print mode:
    p.addRow({ text: `Mode: `, color: 'cyan' }, { text: `${mode}`, color: 'white' })
        // Print message frequency:
    p.addRow({ text: `Message period: `, color: 'cyan' }, { text: `${period} ms`, color: 'white' })
        // Print Min and Max
    p.addRow({ text: `Min: `, color: 'cyan' }, { text: `${min}`, color: 'white' })
    p.addRow({ text: `Max: `, color: 'cyan' }, { text: `${max}`, color: 'white' })
        // Print current values:
    p.addRow({ text: `Values: `, color: 'cyan' }, { text: ` ${values.map(v => v.toFixed(4)).join('   ')}`, color: 'white' })

    // Spacer
    p.addSpacer()

    if (lastErr.length > 0) {
        p.addRow({ text: lastErr, color: 'red' })
        p.addSpacer(2)
    }

    p.addRow({ text: "Commands:", color: 'white', bg: 'black' })
    p.addRow({ text: `  'space'`, color: 'gray', bold: true }, { text: `   - Start/stop simulator`, color: 'white', italic: true })
    p.addRow({ text: `  'm'`, color: 'gray', bold: true }, { text: `       - Select simulation mode`, color: 'white', italic: true })
    p.addRow({ text: `  's'`, color: 'gray', bold: true }, { text: `       - Select message period`, color: 'white', italic: true })
    p.addRow({ text: `  'h'`, color: 'gray', bold: true }, { text: `       - Set max value`, color: 'white', italic: true })
    p.addRow({ text: `  'l'`, color: 'gray', bold: true }, { text: `       - Set min value`, color: 'white', italic: true })
    p.addRow({ text: `  'q'`, color: 'gray', bold: true }, { text: `       - Quit`, color: 'white', italic: true })

    GUI.setHomePage(p)
}

GUI.on("exit", () => {
    closeApp()
})

// And manage the keypress event from the library
GUI.on("keypressed", (key) => {
    switch (key.name) {
        case 'space':
            if (valueEmitter) {
                clearInterval(valueEmitter)
                valueEmitter = null
            } else {
                valueEmitter = setInterval(frame, period)
            }
            break
        case 'm':
            new OptionPopup("popupSelectMode", "Select simulation mode", modeList, mode).show().on("confirm", (_mode) => {
                mode = _mode
                GUI.warn(`NEW MODE: ${mode}`)
                drawGui()
            })
            break
        case 's':
            new OptionPopup("popupSelectPeriod", "Select simulation period", periodList, period).show().on("confirm", (_period) => {
                new ButtonPopup("popupConfirmPeriod", "Confirm period", `Period set to ${period} ms, apply?`, ["Yes", "No", "?"]).show().on("confirm", (answer) => {
                    if (answer === "Yes") {
                        period = _period
                        GUI.warn(`NEW PERIOD: ${period}`)
                    } else if (answer === "?") {
                        GUI.info(`Choose ok to confirm period`)
                    }
                    drawGui()
                })
            })
            break
        case 'h':
            new InputPopup("popupTypeMax", "Type max value", max, true).show().on("confirm", (_max) => {
                max = _max
                GUI.warn(`NEW MAX VALUE: ${max}`)
                drawGui()
            })
            break
        case 'l':
            new InputPopup("popupTypeMin", "Type min value", min, true).show().on("confirm", (_min) => {
                min = _min
                GUI.warn(`NEW MIN VALUE: ${min}`)
                drawGui()
            })
            break
        case 'q':
            new ConfirmPopup("popupQuit", "Are you sure you want to quit?").show().on("confirm", () => closeApp())
            break
        default:
            break
    }
})

const drawGui = () => {
    updateConsole()
}

```

## How to draw the application page?

## NEW DRAWING ALGORYTM

![Animation](https://user-images.githubusercontent.com/14907987/164305847-ea699cba-bb40-46a2-88ea-01496d73b8b1.gif)

All the page is prerendered before printing on the console to prevent noisy flickering.

Introduced new styling design pattern:

Each page need to be created with the new class
```js
const p = new PageBuilder()
```
and to add a styled row it's neccessary to call:
```js
p.addRow({ text: `  'm'`, color: 'gray', bold: true }, { text: `       - Select simulation mode`, color: 'white', italic: true })
```
The arguments of that function is an array of object (function arguments syntax, no []!), so in a row you can add different phrases with different styles.

The styles are converted to the Chalk modificator:

### colors:
 - black
 - red
 - green
 - yellow
 - blue
 - magenta
 - cyan
 - white
 - blackBright (alias: gray, grey)
 - redBright
 - greenBright
 - yellowBright
 - blueBright
 - magentaBright
 - cyanBright
 - whiteBright

### Background colors ('bg')
 - bgBlack
 - bgRed
 - bgGreen
 - bgYellow
 - bgBlue
 - bgMagenta
 - bgCyan
 - bgWhite
 - bgBlackBright (alias: bgGray, bgGrey)
 - bgRedBright
 - bgGreenBright
 - bgYellowBright
 - bgBlueBright
 - bgMagentaBright
 - bgCyanBright
 - bgWhiteBright

### Formatters (Each is a prop):
 - italic
 - bold
 - dim
 - underline
 - overline
 - inverse
 - hidden
 - strikethrough

eg:

```js
p.addRow({ text: `TCP messages sent:`, color: 'green', bg: 'bgRed', bold: true, italic: true, underline: true }, { text: ` ${tcpCounter}`, color: 'white' })
```

And so, we can add the PageBuilder to the home page

```js
GUI.setHomePage(p)
```

The new Screen class is used internally by the ConsoleManager.

## To create an option popup (select)
```js
new OptionPopup("popupSelectPeriod", "Select simulation period", periodList, period).show().on("confirm", (_period) => {
    period = _period
    GUI.warn(`NEW PERIOD: ${period}`)
    drawGui()
})
```

### Class OptionPopup:
constructor(id, title, options, selected)
 - id: string
 - title: string
 - options: Array<string | number>
 - selected: string | number

The response is triggered via EventEmitter using "on"
The result is this:

![Animation](https://user-images.githubusercontent.com/14907987/162480195-b08b4a0b-5d10-4122-8bff-9210295aac1f.gif)

Pressing enter it will close the popup and set the new value. If the list is too long, it will scroll reaching the bottom or top.
Now you can also use "pageup" amd "pagedown" keys to navigate faster.

## To create an input popup (numeric or string)
```js
new InputPopup("popupTypeMax", "Type max value", max, true).show().on("confirm", (_max) => {
    max = _max
    GUI.warn(`NEW MAX VALUE: ${max}`)
    drawGui()
})
```

### Class InputPopup:
constructor(id, title, value, isNumeric)
 - id: string
 - title: string
 - value: string | number
 - isNumeric: boolean

You can use it for example to set a numeric threshold:

![Animation](https://user-images.githubusercontent.com/14907987/162480554-3e29513b-13d1-4d3f-bd16-09cba30db358.gif)

If you set isNumeric to true, only numbers are allowed.
All class of components will be destroyed when the popup is closed. The event listeners are removed from the store. Then the garbage collector will clean the memory.

## To create a button popup
```js
new ButtonPopup("popupConfirmPeriod", "Confirm period", `Period set to ${period} ms, apply?`, ["Yes", "No", "?"]).show().on("confirm", (answer) => {
    if (answer === "Yes") {
        period = _period
        GUI.warn(`NEW PERIOD: ${period}`)
    } else if (answer === "?") {
        GUI.info(`Choose ok to confirm period`)
    }
    drawGui()
})
```

### Class ButtonPopup:
constructor(id, title, message, buttons = ["Ok", "Cancel", "?"])
 - id: string
 - title: string
 - message: string
 - buttons: Array<string> - The text of the buttons

You can use it for example to make a question:

![Animation](https://user-images.githubusercontent.com/14907987/164768181-48f18d25-d05a-4959-88ec-8ce93212e356.gif)

## To create a confirm popup (if you only need a yes or no answer)
```js
new ConfirmPopup("popupQuit", "Are you sure you want to quit?").show().on("confirm", () => closeApp())
```

### Class ConfirmPopup:
constructor(id, title)
 - id: string
 - title: string

You can use it for example to confirm before quit the app:

![Animation](https://user-images.githubusercontent.com/14907987/164768797-3f538673-78da-4f67-b2c3-be1319f2fb95.gif)
 
All class of components will be destroyed when the popup is closed. The event listeners are removed from the store. Then the garbage collector will clean the memory.

## Console.log and other logging tools
To log you have to use the following functions:

```js
GUI.log(`NEW MIN VALUE: ${min}`)
GUI.warn(`NEW MIN VALUE: ${min}`)
GUI.error(`NEW MIN VALUE: ${min}`)
GUI.info(`NEW MIN VALUE: ${min}`)
```
And then written to the bottom of the page.

![Animation](https://user-images.githubusercontent.com/14907987/162482192-042d88e5-f810-4523-8f0d-1d87a573d1b1.gif)

You can switch to the log view by pressing the "changeLayoutKey" key or combination:
The maximum number of lines is set to 10 by default but you can change it by setting the option "logsPageSize".
When the logs exceed the limit, you can scroll up and down with up and down arrows (if you are in the log view).

![Animation](https://user-images.githubusercontent.com/14907987/162482410-bfe26922-88f5-46bd-8659-059fcc698cf8.gif)

This library is in development now. New componets will come asap.


## License and copyright

MIT License Copyright (c) 2022 [Elia Lazzari](https://github.com/Elius94)
 
Colors and styles are managed using [Chalk](https://github.com/chalk/chalk)
![image](https://user-images.githubusercontent.com/14907987/164770011-d29579ad-e681-43b2-b550-7fb52fd74021.png)

## Code Documentation

To see the code documentation, please click on the following link:

[Code documentation](DOCS.md)
