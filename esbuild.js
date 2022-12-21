/* eslint-disable no-useless-escape */
// esbuild.js
import { execSync } from "child_process"
import { build } from "esbuild"
import pkg from "./package.json" assert { type: "json" }

const watch = process.argv.includes("--watch")

build({
    bundle: true,
    platform: "node",
    target: "node16.0",
    minify: true,
    sourcemap: true,
    format: "esm",
    color: true,
    banner: {
        js: 
        "/* eslint-disable linebreak-style */\n" +
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
        "   This program is free software: you can redistribute it and/or modify\n*/\n"
    },
    watch: watch ? {
        onRebuild(error, result) {
            if (error) console.error("watch build failed:", error)
            else console.log("watch build succeeded:", result)
        }
    } : false,
    outdir: "dist",
    entryPoints: ["src/ConsoleGui.ts"],
    plugins: [
        {
            name: "TypeScriptDeclarationsPlugin",
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) return
                    execSync("npx tsc --emitDeclarationOnly")
                })
            }
        }
    ]
}).then(() => {
    watch ? console.log("\u001b[36mWatching...\u001b[37m") : console.log("\u001b[36mBuild complete!\u001b[37m")
})