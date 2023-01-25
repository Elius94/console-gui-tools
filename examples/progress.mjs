import { execSync, spawn, spawnSync } from "node:child_process"
import { ConsoleManager, Progress, ConfirmPopup, PageBuilder } from "../dist/esm/ConsoleGui.mjs"
import os from "node:os"

const opt = {
    title: "Progress Bar Test",
    layoutOptions: {
        type: "single"
    },
    logLocation: "popup",
    enableMouse: true
}

const GUI = new ConsoleManager(opt)

GUI.on("exit", () => {
    closeApp()
})

GUI.on("keypressed", (key) => {
    switch (key.name) {
    case "q":
        new ConfirmPopup("popupQuit", "Are you sure you want to quit?").show().on("confirm", () => closeApp())
        break
    default:
        break
    }
})

const closeApp = () => {
    console.clear()
    process.exit()
}

GUI.refresh()

const numberOfCores = os.cpus().length

const cores = []

for (let i = 0; i < numberOfCores; i++) {
    cores.push(new Progress({
        id: `htop-cpu-${i}`,
        x: 2,
        y: 1 + i,
        label: `${i}  `,
        length: 40,
        min: 0,
        max: 100,
        style: {
            boxed: true,
            theme: "htop",
            showMinMax: false,
            showValue: false,
        }
    }))
}

const mem = new Progress({
    id: "htop-mem",
    x: 2,
    y: 1 + numberOfCores,
    label: "Mem",
    length: 40,
    min: 0,
    max: os.totalmem() / (1024 * 1024 * 1024),
    unit: "G",
    style: {
        boxed: true,
        theme: "htop",
        showMinMax: false,
    }
})

//Create function to get CPU information
function cpuAverage(core) {
    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0
  
    //Select CPU core
    var cpu = os.cpus()[core]
  
    //Total up the time in the cores tick
    for (const type in cpu.times) {
        totalTick += cpu.times[type]
    }
  
    //Total up the idle time of the core
    totalIdle += cpu.times.idle
  
    //Return the average Idle and Tick times
    return {idle: totalIdle, total: totalTick}
}
  
// load average for the past 1000 milliseconds calculated every 100
function getCPULoadAVG(core, avgTime = 1000, delay = 500) {
    return new Promise((resolve, reject) => {
        const n = ~~(avgTime / delay)
        if (n <= 1) {
            reject("Error: interval to small")
        }
        let i = 0
        let samples = []
        const avg1 = cpuAverage(core)
  
        let interval = setInterval(() => {
            GUI.log("CPU Interval: ", i)
  
            if (i >= n) {
                clearInterval(interval)
                resolve(~~((samples.reduce((a, b) => a + b, 0) / samples.length) * 100))
            }
  
            const avg2 = cpuAverage(core)
            const totalDiff = avg2.total - avg1.total
            const idleDiff = avg2.idle - avg1.idle
  
            samples[i] = (1 - idleDiff / totalDiff)
            i++
        }, delay)
    })
}
  
const getSystemInfo = async () => {
    const coresPercent = []

    for (let i = 0; i < numberOfCores; i++) {
        const load = await getCPULoadAVG(i).catch(err => console.error(err))
        coresPercent.push(load)
    }
    const memUsage = os.totalmem() - os.freemem()
    return {
        cpuUsage: coresPercent,
        memUsage
    }
}

setInterval(() => {
    getSystemInfo().then((info) => {
        info.cpuUsage.forEach((core, i) => {
            cores[i].setValue(core)
        })
        mem.setValue(info.memUsage / (1024 * 1024 * 1024))
    })
}, 1000)

function getData() {
    // Draw header for top table
    const uptime = os.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    const uptimeText = `${hours}:${minutes}:${seconds}s`
    if (table.length === 0) return
    const p = new PageBuilder()
    p.addSpacer()
    p.addRow({text: `${" ".repeat(58)}Uptime: `, color: "#3d96da", bold: true}, {text: `${uptimeText}`, color: "cyan", bold: true})
    p.addSpacer(numberOfCores + 1)
    const header = ["PID", "CPU", "MEM", "PROCESS" ]
    const maxSizes = header.map((h) => h.length)

    table.forEach(row => {
        const keys = Object.keys(row)
        keys.forEach((key, i) => {
            if (row[key]?.length > maxSizes[i]) {
                maxSizes[i] = row[key]?.length
            }
        })
    })

    p.addRow(
        {text: `PID${" ".repeat(maxSizes[0] - 3 > 0 ? maxSizes[0] - 3 : 0)}`, color: "black", bg: "bgGreen", bold: true},
        {text: `CPU${" ".repeat(maxSizes[1] - 3 > 0 ? maxSizes[1] - 3 : 0)}`, color: "black", bg: "bgGreen", bold: true},
        {text: `MEM${" ".repeat(maxSizes[2] - 3 > 0 ? maxSizes[2] - 3 : 0)}`, color: "black", bg: "bgGreen", bold: true},
        {text: `PROCESS${" ".repeat(maxSizes[3] - 7 > 0 ? maxSizes[3] - 7 : 0)}`, color: "black", bg: "bgGreen", bold: true},
    )
    table.forEach(row => {
        p.addRow(
            row.pid ? {text: `${row.pid}${" ".repeat(maxSizes[0] - row.pid.length > 0 ? maxSizes[0] - row.pid.length : 0)}`, color: "white", bold: true} : {text: ""},
            row.cpu ? {text: `${row.cpu}${" ".repeat(maxSizes[1] - row.cpu.length > 0 ? maxSizes[1] - row.cpu.length : 0)}`, color: "white", bold: true} : {text: ""},
            row.mem ? {text: `${row.mem}${" ".repeat(maxSizes[2] - row.mem.length > 0 ? maxSizes[2] - row.mem.length : 0)}`, color: "white", bold: true} : {text: ""},
            row.name ? {text: `${row.name}${" ".repeat(maxSizes[3] - row.name.length > 0 ? maxSizes[3] - row.name.length : 0)}`, color: "white", bold: true} : {text: ""},
        )
    })
    drawGui(p)
}


const drawGui = (p) => {
    GUI.setPage(p)
    GUI.refresh()
}

getData()