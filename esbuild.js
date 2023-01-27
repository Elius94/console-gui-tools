/* eslint-disable no-useless-escape */
// esbuild.js
import { execSync } from "child_process"
import { build, context } from "esbuild"
import fs from "fs"

const stripJSONComments = (data) => {
    var re = new RegExp("\/\/(.*)", "g")
    return data.toString().replace(re, "")
}

const tsc = JSON.parse(stripJSONComments(fs.readFileSync("./tsconfig.json")))
const pkg = JSON.parse(fs.readFileSync("./package.json"))

const watch = process.argv.includes("--watch")
const dev = process.argv.includes("--dev") || process.env.NODE_ENV === "development"

const nodeMajor = 14 // process.versions.node.split(".")[0]
const nodeMinor = 17 // process.versions.node.split(".")[1]

if (nodeMajor < 14 || (nodeMajor === 14 && nodeMinor < 17)) {
    console.error("\u001b[31mNode 14.17 or higher is required to run this project!\u001b[37m")
    process.exit(1)
}

let target = ["node14.17", "es2020"]
if (nodeMajor === 14 && nodeMinor >= 17) {
    target = [`node${nodeMajor}.${nodeMinor}`, "es2020"]
} else if ((nodeMajor === 15 && nodeMinor >= 14) || (nodeMajor >= 16 && nodeMajor < 17)) {
    target = [`node${nodeMajor}.${nodeMinor}`, "es2021"]
} else if ((nodeMajor === 17 && nodeMinor >= 9) || (nodeMajor >= 18 && nodeMajor <= 20)) {
    target = [`node${nodeMajor}.${nodeMinor}`, "es2022"]
}

tsc.compilerOptions.target = target[1]

// write tsconfig.json to a temp file
fs.writeFileSync("./tsconfig_esbuild.json", JSON.stringify(tsc, null, 4))

console.log(`\u001b[36mBuilding for Node ${target[0]}, ECMAScript ${target[1]}...\u001b[37m`)

const banner = "/* eslint-disable linebreak-style */\n" +
    "/*                                                                            \n" +
    "   ____                      _         ____       _   _____           _       \n" +
    "  / ___|___  _ __  ___  ___ | | ___   / ___|_   _(_) |_   _|__   ___ | |___   \n" +
    " | |   / _ \\| '_ \\/ __|/ _ \\| |/ _ \\ | |  _| | | | |   | |/ _ \\ / _ \\| / __|  \n" +
    " | |__| (_) | | | \\__ \\ (_) | |  __/ | |_| | |_| | |   | | (_) | (_) | \\__ \\  \n" +
    "  \\____\\___/|_| |_|___/\\___/|_|\\___|  \\____|\\__,_|_|   |_|\\___/ \\___/|_|___/  \n" +
    "                                                                              \n" +
    `                                                                      v${pkg.version} \n\n\n` +
    `   ${pkg.description}                                                          \n\n` +
    `   Author: ${pkg.author}\n` +
    `   License: ${pkg.license}\n` +
    `   Repository: ${pkg.repository.url}\n\n` +
    "   This program is free software: you can redistribute it and/or modify\n\n" +
    `   Build: ${new Date().toUTCString()} for Node ${target[0]}, ECMAScript ${target[1]}\n*/\n`

const buildOptions = {
    bundle: true,
    platform: "node",
    target: target,
    minifySyntax: dev ? true : false,
    minify: dev ? false : true,
    sourcemap: true,
    format: "esm",
    color: true,
    metafile: dev ? true : false,
    tsconfig: "./tsconfig_esbuild.json",
    outExtension: { ".js": ".mjs" },
    banner: {
        js: banner
    },
    outdir: "dist/esm",
    entryPoints: ["src/ConsoleGui.ts"],
    plugins: [
        {
            name: "TypeScriptDeclarationsPlugin",
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) return
                    execSync("npx tsc --emitDeclarationOnly --declarationDir ./dist/types -p ./tsconfig_esbuild.json")
                })
            }
        },
        {
            name: "rebuildListener",
            setup(build) {
                let count = 0
                build.onEnd(result => {
                    if (count++ === 0) console.log("First build:", result)
                    else console.log("Subsequent build:", result)
                })
            },
        }
    ]
}

const buildOptionsCjs = {
    ...buildOptions,
    format: "cjs",
    outExtension: { ".js": ".cjs" },
    outdir: "dist/cjs",
    plugins: []
}

if (dev) {
    const ctxEsm = await context(buildOptions)
    const ctxCjs = await context(buildOptionsCjs)

    if (watch) {
        await ctxEsm.watch().then(() => {
            console.log("\u001b[36mWatching ESM...\u001b[37m")
        })
        await ctxCjs.watch().then(() => {
            console.log("\u001b[36mWatching CJS...\u001b[37m")
        })
    }
} else {
    // ESM Build
    await build(buildOptions)
    console.log("\u001b[36mESM Build succeeded!\u001b[37m")
    // CJS Build
    await build(buildOptionsCjs)
    console.log("\u001b[36mCJS Build succeeded!\u001b[37m")
}

process.on("exit", () => {
    fs.unlinkSync("./tsconfig_esbuild.json")
})
