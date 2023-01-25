import { 
    ConsoleManager, 
    ConsoleGuiOptions, 
    Progress, 
    ProgressConfig,
    ConfirmPopup, 
    PageBuilder, 
    KeyListenerArgs,
    SimplifiedStyledElement
} from "console-gui-tools"
import os from "node:os"
import psList from "ps-list"

const opt = {
    title: "Progress Bar Test",
    layoutOptions: {
        type: "single"
    },
    logLocation: "popup",
    enableMouse: true
} as ConsoleGuiOptions

const GUI = new ConsoleManager(opt)

GUI.on("exit", () => {
    closeApp()
})

GUI.on("keypressed", (key: KeyListenerArgs) => {
    switch (key.name) {
    case "q":
        new ConfirmPopup("popupQuit", "Are you sure you want to quit?", undefined).show().on("confirm", () => closeApp())
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

const cores: Progress[] = []

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
    } as ProgressConfig))
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
} as ProgressConfig)

//Create function to get CPU information
function cpuAverage(core: number) {
    //Initialise sum of idle and time of cores and fetch CPU info
    let totalIdle = 0, totalTick = 0
  
    //Select CPU core
    const cpu = os.cpus()[core]
  
    //Total up the time in the cores tick
    for (let i = 0, len = Object.keys(cpu.times).length; i < len; i++) {
        totalTick += Object.values(cpu.times)[i]
    }
  
    //Total up the idle time of the core
    totalIdle += cpu.times.idle
  
    //Return the average Idle and Tick times
    return {idle: totalIdle, total: totalTick}
}
  
// load average for the past 1000 milliseconds calculated every 100
function getCPULoadAVG(core: number, avgTime = 1000, delay = 500) {
    return new Promise((resolve, reject) => {
        const n = ~~(avgTime / delay)
        if (n <= 1) {
            reject("Error: interval to small")
        }
        let i = 0
        const samples: number[] = []
        const avg1 = cpuAverage(core)
  
        const interval = setInterval(() => {
            GUI.log("CPU Interval: " + i)
  
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
            cores[i].setValue(core as number)
        })
        mem.setValue(info.memUsage / (1024 * 1024 * 1024))
    })
}, 1000)

async function getData() {
    // Draw header for top table
    const uptime = os.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    const uptimeText = `${hours}:${minutes}:${seconds}s`
    const limit = 20
    const table = await psList({all: true})
    // Sort by CPU usage
    /*table.sort((a, b) => {
        b.cpu - a.cpu
    })*/
    // Limit to 20 processes
    table.splice(limit)
    if (table.length === 0) return
    const p = new PageBuilder()
    p.addSpacer()
    p.addRow({text: `${" ".repeat(58)}Uptime: `, color: "#3d96da", bold: true}, {text: `${uptimeText}`, color: "cyan", bold: true})
    p.addSpacer(numberOfCores + 1)
    const header = Object.keys(table[0]).map((h) => h.toUpperCase())
    const maxSizes = header.map((h) => h.length)

    const spacing = 2

    table.forEach(row => {
        const keys = Object.keys(row)
        keys.forEach((key, i) => {
            if (Object.values(row)[i].toString().length > maxSizes[i]) {
                maxSizes[i] = Object.values(row)[i].toString().length
            }
        })
    })

    p.addRow(
        ...header.map((h, i) => {
            return {text: `${h}${" ".repeat((maxSizes[i] - h.length > 0 ? maxSizes[i] - h.length : 0) + spacing)}`, color: "black", bg: "bgGreen", bold: true} as SimplifiedStyledElement
        })
    )
    table.forEach(row => {
        p.addRow(
            ...header.map((_, i) => {
                return {text: `${Object.values(row)[i]}${" ".repeat((maxSizes[i] - Object.values(row)[i].toString().length > 0 ? maxSizes[i] - Object.values(row)[i].toString().length : 0) + spacing)}`, color: "white"/*, bg: "bgBlack"*/, bold: true} as SimplifiedStyledElement
            })
        )
    })
    drawGui(p)

    setTimeout(() => {
        getData()
    }, 1000)
}


const drawGui = (p: PageBuilder) => {
    GUI.setPage(p)
    GUI.refresh()
}

getData()