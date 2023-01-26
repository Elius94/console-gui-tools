import { 
    ConsoleManager, 
    ConsoleGuiOptions, 
    Progress, 
    ProgressConfig,
    ConfirmPopup, 
    PageBuilder, 
    KeyListenerArgs,
    SimplifiedStyledElement,
    InPageWidgetBuilder,
    Box,
    OptionPopup
} from "console-gui-tools"
import { RelativeMouseEvent } from "console-gui-tools/dist/types/components/MouseManager"
import _ from "lodash"
import os from "node:os"
import psList, { ProcessDescriptor } from "ps-list"

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
    case "f10":
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

const tableData = {
    selectedRow: 0,
    psTab: [] as ProcessDescriptor[],
    header: [] as string[],
    table: new InPageWidgetBuilder(100),
    maxSizes: [] as number[],
    spacing: 2,
    sortBy: "name",
}

const Table = new Box({ 
    id: "table", 
    x: 0, 
    y: mem.absoluteValues.y + 3, 
    width: 100, 
    height: 30,
})

Table.on("keypress", (key: KeyListenerArgs) => {
    if (!Table.focused) return
    switch (key.name) {
    case "up":
        if (tableData.selectedRow > 0) {
            tableData.selectedRow -= 1
            drawTable()
        }
        break
    case "down": 
        if (tableData.selectedRow < tableData.psTab.length - 1) {
            tableData.selectedRow += 1
            drawTable()
        }
        break
    case "f9":
        // Kill process
        if (tableData.psTab.length > 0) {
            const selectedProcess = tableData.psTab[tableData.selectedRow]
            new ConfirmPopup("popupKill", `Are you sure you want to kill process ${selectedProcess.name} (${selectedProcess.pid})?`, undefined).show().on("confirm", () => {
                process.kill(selectedProcess.pid)
            })
        }
        break
    case "f6":
        // Sort by
        {
            const sortOptions = Object.keys(tableData.psTab[0])
            new OptionPopup("popupSort", "Sort by", sortOptions, tableData.sortBy).show().on("confirm", (option: string) => {
                tableData.sortBy = option
                drawTable()
            })
        }
        break
    case "f1":
        // Help
        new ConfirmPopup("popupHelp", "Help", `Use the mouse wheel to scroll the table.${os.EOL}Use the up and down arrow keys to select a row.${os.EOL}Press F9 to kill a process.${os.EOL}Press F6 to sort the table.${os.EOL}Press F1 to show this help.${os.EOL}Press F10 or Q to quit.`).show()
        break
    default:
        break
    }
})

Table.on("relativeMouse", (e: RelativeMouseEvent) => {
    if (e.name === "MOUSE_WHEEL_UP") {
        if (tableData.selectedRow > 0) {
            tableData.selectedRow -= 1
            drawTable()
        }
    } else if (e.name === "MOUSE_WHEEL_DOWN") {
        if (tableData.selectedRow < tableData.psTab.length - 1) {
            tableData.selectedRow += 1
            drawTable()
        }
    } else if (e.name === "MOUSE_LEFT_BUTTON_PRESSED") {
        if (tableData.psTab.length <= Table.absoluteValues.height) {
            tableData.selectedRow = e.data.y - 1
            drawTable()
            return
        }
        const realStartIndex = mapToRange(Table.content.scrollIndex, tableData.psTab.length - Table.absoluteValues.height, 0, 0, tableData.psTab.length - Table.absoluteValues.height)
        tableData.selectedRow = e.data.y + realStartIndex - 1
        drawTable()
    }
})

function mapToRange(value: number, min1: number, max1: number, min2: number, max2: number) {
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}

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
    //const limit = 10
    const psTable = await psList({all: true})

    // Limit to 20 processes
    //psTable.splice(limit)
    if (psTable.length === 0) return
    const p = new PageBuilder()
    p.addSpacer()
    p.addRow({text: `${" ".repeat(58)}Uptime: `, color: "#3d96da", bold: true}, {text: `${uptimeText}`, color: "cyan", bold: true})
    p.addSpacer(numberOfCores + 1)
    const header = Object.keys(psTable[0]).map((h) => h.toUpperCase())
    const maxSizes = header.map((h) => h.length)

    const spacing = 2

    psTable.forEach(row => {
        const keys = Object.keys(row)
        keys.forEach((key, i) => {
            if (Object.values(row)[i].toString().length > maxSizes[i]) {
                maxSizes[i] = Object.values(row)[i].toString().length
            }
        })
    })

    p.addRow(
        ...header.map((h, i) => {
            return {text: `${h}${" ".repeat((maxSizes[i] - h.length > 0 ? maxSizes[i] - h.length : 0) + spacing)}`, color: "black", bg: "bgGreen", bold: false} as SimplifiedStyledElement
        })
    )

    drawGui(p)

    updateTable(psTable, header, maxSizes, spacing)
    drawTable()

    setTimeout(getData, 1000)
}

const drawTable = () => {
    let orderDirection = ""
    switch (tableData.sortBy.toUpperCase()) {
    case "PID":
    case "PPID":
    case "CPU":
    case "MEMORY":
    case "UID":
        orderDirection = "desc"
        break
    default:
        orderDirection = "asc"
        break
    }
    
    tableData.psTab = _.orderBy(tableData.psTab, (obj: ProcessDescriptor) => {
        switch (tableData.sortBy.toUpperCase()) {
        case "PID":
        case "PPID":
        case "CPU":
        case "MEMORY":
        case "UID":
            return Number(Object.values(obj)[Object.keys(obj).indexOf(tableData.sortBy)])
        default:
            return Object.values(obj)[Object.keys(obj).indexOf(tableData.sortBy)]
        }
    }, orderDirection as "asc" | "desc")
    tableData.table.clear()    
    tableData.psTab.forEach((row, index) => {
        const background = index === tableData.selectedRow ? "bgCyan" : undefined
        tableData.table.addRow(
            ...tableData.header.map((_, i) => {
                return {text: `${Object.values(row)[i]}${" ".repeat((tableData.maxSizes[i] - Object.values(row)[i].toString().length > 0 ? tableData.maxSizes[i] - Object.values(row)[i].toString().length : 0) + tableData.spacing)}`, color: "white", bg: background, bold: true} as SimplifiedStyledElement
            })
        )
    })
    Table.setContent(tableData.table)
}

const updateTable = (psTable: ProcessDescriptor[], header: string[], maxSizes: number[], spacing: number) => {
    tableData.psTab = psTable
    tableData.header = header
    tableData.maxSizes = maxSizes
    tableData.spacing = spacing
}

const drawGui = (p: PageBuilder) => {
    GUI.setPage(p)
    GUI.refresh()
}

const footer = new Box({
    id: "footer",
    x: 0,
    y: GUI.Screen.height - 1,
    width: GUI.Screen.width,
    height: 1,
})
const row = new InPageWidgetBuilder(1)

row.addRow(
    { text: "F1:", color: "white", bold: true },
    { text: "Help  ", color: "black", bg: "bgCyan", bold: false },
    { text: "F6:", color: "white", bold: true },
    { text: "SortBy", color: "black", bg: "bgCyan", bold: false },
    { text: "F9:", color: "white", bold: true },
    { text: "Kill  ", color: "black", bg: "bgCyan", bold: false },
    { text: "F10:", color: "white", bold: true },
    { text: "Quit  ", color: "black", bg: "bgCyan", bold: false },
)
footer.setContent(row)

GUI.on("resize", () => {
    footer.absoluteValues = {
        x: 0,
        y: GUI.Screen.height - 2,
        width: GUI.Screen.width,
        height: 1,
    }
    GUI.refresh()
})


getData()