# console-gui-tools
 A simple library to draw option menu or other popup inputs and layout on Node.js console.

[![npm version](https://badge.fury.io/js/console-gui-tools.svg)](https://npmjs.com/package/console-gui-tools) [![npm](https://img.shields.io/npm/dt/console-gui-tools)](https://npmjs.com/package/console-gui-tools) ![npm bundle size](https://img.shields.io/bundlephobia/min/console-gui-tools) ![GitHub](https://img.shields.io/github/license/elius94/console-gui-tools)

# console-gui-tools
A simple Node.js library to create Console Apps like wizard (or maybe if you like old style colored screen or something like "teletext" programs 😂)
Apart from jokes, it is a library that allows you to create a screen divided into a part with everything you want to see (such as variable values) and another in which the logs run.
Moreover in this way the application is managed by the input event "keypressed" to which each key corresponds to a bindable command.
For example, to change variables you can open popups with an option selector or with a textbox.
It's in embryonic phase, any suggestion will be constructive :D

![Animation](https://user-images.githubusercontent.com/14907987/162479866-e53f0634-8e96-4c23-9f32-ee920b7cdf2f.gif)


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
import { ConsoleManager, OptionPopup, InputPopup } from '../index.js'
const GUI = new ConsoleManager({
    title: 'TCP Simulator', // Title of the console
    logsPageSize: 12, // Number of lines to show in logs page
    changeLayoutKey: 'ctrl+l', // Change layout with ctrl+l to switch to the logs page
})

// Creating a main page updater:
const updateConsole = async() => {
    let screen = ""
    screen += chalk.yellow(`TCP server simulator app! Welcome...`) + `\n`
    screen += chalk.green(`TCP Server listening on ${HOST}:${PORT}`) + `\n`
    screen += chalk.green(`Connected clients: `) + chalk.white(`${connectedClients}\n`)
    screen += chalk.magenta(`TCP Messages sent: `) + chalk.white(`${tcpCounter}`) + `\n\n`

    // Print if simulator is running or not
    if (!valueEmitter) {
        screen += chalk.red(`Simulator is not running! `) + chalk.white(`press 'space' to start`) + `\n`
    } else {
        screen += chalk.green(`Simulator is running! `) + chalk.white(`press 'space' to stop`) + `\n`
    }
    // Print mode:
    screen += chalk.cyan(`Mode:`) + chalk.white(` ${mode}`) + `\n`;
    // Print message frequency:
    screen += chalk.cyan(`Message period:`) + chalk.white(` ${period} ms`) + `\n`;
    // Print Min and Max
    screen += chalk.cyan(`Min:`) + chalk.white(` ${min}`) + `\n`;
    screen += chalk.cyan(`Max:`) + chalk.white(` ${max}`) + `\n`;
    // Print current values:
    screen += chalk.cyan(`Values:`) + chalk.white(` ${values.map(v => v.toFixed(4)).join('   ')}`) + `\n`;

    // Spacer
    screen += `\n\n`;

    if (lastErr.length > 0) {
        screen += lastErr + `\n\n`
    }

    screen += chalk.bgBlack(`Commands:`) + `\n`;
    screen += `  ${chalk.bold('space')}   - ${chalk.italic('Start/stop simulator')}\n`;
    screen += `  ${chalk.bold('m')}       - ${chalk.italic('Select simulation mode')}\n`;
    screen += `  ${chalk.bold('s')}       - ${chalk.italic('Select message period')}\n`;
    screen += `  ${chalk.bold('h')}       - ${chalk.italic('Set max value')}\n`;
    screen += `  ${chalk.bold('l')}       - ${chalk.italic('Set min value')}\n`;
    screen += `  ${chalk.bold('q')}       - ${chalk.italic('Quit')}\n`;

    GUI.setHomePage(screen)
}

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
                period = _period
                GUI.warn(`NEW PERIOD: ${period}`)
                drawGui()
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
            closeApp()
            break
        default:
            break
    }
})

const drawGui = () => {
    updateConsole()
}

```

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

Pressing enter it will close the popup and set the new value

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

## Console.log and other logging tools
To log you have to use the following functions:

```js
GUI.log(`NEW MIN VALUE: ${min}`)
GUI.warn(`NEW MIN VALUE: ${min}`)
GUI.error(`NEW MIN VALUE: ${min}`)
GUI.info(`NEW MIN VALUE: ${min}`)
```
And they written to the bottom of the page.

![Animation](https://user-images.githubusercontent.com/14907987/162482192-042d88e5-f810-4523-8f0d-1d87a573d1b1.gif)

You can switch to the log view by pressing the "changeLayoutKey" key or combination:
The maximum number of lines is set to 10 by default but you can change it by setting the option "logsPageSize".
When the logs exceed the limit, you can scroll up and down with up and down arrows (if you are in the log view).

![Animation](https://user-images.githubusercontent.com/14907987/162482410-bfe26922-88f5-46bd-8659-059fcc698cf8.gif)

This library is in development now. New componets will come asap.


## License and copyright

MIT License Copyright (c) 2022 [Elia Lazzari](https://github.com/Elius94)

## Code Documentation

To see the code documentation, please click on the following link:

[Code documentation](DOCS.md)