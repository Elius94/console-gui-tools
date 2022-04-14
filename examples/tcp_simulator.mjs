// For colors in the console
import chalk from 'chalk';
chalk.level = 1
import net from 'net';
import EventEmitter from 'events';

const PORT = 9090
const HOST = '127.0.0.1'
let period = 100

let mode = 'random'

const periodList = [10, 100, 250, 500, 1000, 2000, 5000, 10000, 20000, 30000, 60000, 120000, 300000, 600000, 900000, 1800000, 3600000, 7200000, 14400000, 28800000, 43200000, 86400000]
const modeList = ["random", "linear"]

const clientManager = new EventEmitter()

import { ConsoleManager, OptionPopup, InputPopup } from '../index.js'
const GUI = new ConsoleManager({
    title: 'TCP Simulator', // Title of the console
    logsPageSize: 8, // Number of lines to show in logs page
    changeLayoutKey: 'ctrl+l', // Change layout with ctrl+l to switch to the logs page
})

let connectedClients = 0
    // The number of TCP message sent since start
let tcpCounter = 0

// Make A TCP Server that listens on port 9090
const server = net.createServer(socket => {
    connectedClients++;
    //drawGui()
    clientManager.on('send', (data) => {
        socket.write(data + '\n')
        tcpCounter++;
    })
    socket.on("error", function(err) {
        lastErr = chalk.bgRed("Error: ") + ` ${err.stack}`;
    });
    socket.on('end', function() {
        lastErr = chalk.bgRed("Error: ") + ` Client disconnected!`;
        connectedClients--;
    });
}).listen(PORT, HOST);

let lastErr = ""

server.on('error', err => {
    lastErr = chalk.red("Error: ") + chalk.white(` ${err.message}`);
    GUI.error(lastErr)
})

let min = 9
let max = 12

let values = [0, 0, 0, 0, 0, 0]

const frame = async() => {
    switch (mode) {
        case 'random':
            await updateWithRandomValues()
            break
        case 'linear':
            await updateWithLinearValues()
            break
        default:
            break
    }
    await sendValuesAsCsv()
}

let valueEmitter = null //setInterval(frame, period)
let direction = [1, 0, 1, 1, 0, 0] // 1 = Up
let step = 0.01

const updateWithRandomValues = async() => {
    values = values.map(value => Math.random() * (max - min) + min)
}

const updateWithLinearValues = async() => {
    // Generate linear values using direction and max/min values
    values = values.map((value, index) => {
        if (value >= max) {
            direction[index] = 0
        } else if (value <= min) {
            direction[index] = 1
        }
        return direction[index] === 1 ? value + step : value - step
    })
}

const sendValuesAsCsv = async() => {
    const csv = values.map(v => v.toFixed(4)).join(',')
    clientManager.emit('send', csv)
    drawGui()
}

let window = "HOME"

/**
 * @description Updates the console screen
 *
 */
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

GUI.on("exit", () => {
    closeApp()
})

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

const closeApp = () => {
    console.clear()
    clearInterval(valueEmitter)
    server.close()
    process.exit()
}

drawGui()