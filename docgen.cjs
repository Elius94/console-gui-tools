"use strict"
const jsdoc2md = require("jsdoc-to-markdown")
const fs = require("fs")
const path = require("path")
const dmd = require("dmd")

// First of all, we need to make a hack to the code to make it work with jsdoc2md
// find and replace all strings "// @type definition" with "1 // @type definition"
// this is a workaround for a bug in the babel plugin and jsdoc
const ORIGINAL = "// @type definition"
const REPLACEMENT = "1 // WORKARAOUND"

const dir = path.join(process.cwd(), "src")

const replaceToDir = (dir, reverse = false) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        // check if file is a directory
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            replaceToDir(path.join(dir, file), reverse)
            continue
        }

        if (!file.endsWith(".ts")) {
            continue
        }
        const filePath = path.join(dir, file)
        const content = fs.readFileSync(filePath, "utf8")
        if (!reverse) {
            // replace all occurrences of ORIGINAL with REPLACEMENT
            const newContent = content.replace(new RegExp(ORIGINAL, "g"), REPLACEMENT)
            fs.writeFileSync(filePath, newContent)
        } else {
            const newContent = content.replace(new RegExp(REPLACEMENT, "g"), ORIGINAL)
            fs.writeFileSync(filePath, newContent)
        }
    }
}

replaceToDir(dir)

const docsFolder = "docs"

// This is where the root plugin folder is, relative to this script
const pluginsRootDir = ["src", "src/components", "src/components/layout", "src/components/widgets"]

const pluginModules = pluginsRootDir.map(dir => {
    return fs.readdirSync(path.join(__dirname, dir))
        .filter(file => file.endsWith(".ts") && !file.endsWith("index.ts"))
        .map(file => path.join(__dirname, dir, file))
})

const allFiles = []
pluginModules.forEach(modules => {
    modules.forEach(module => {
        allFiles.push(module)
    })
})

// Go through plugin folders and create an array of objects containing the plugin name and path
const plugins = allFiles.map((plugin) => ({
    pluginPath: plugin,
    pluginName: plugin.substring(plugin.lastIndexOf("\\") + 1, plugin.lastIndexOf("."))
}))

// create docs directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, docsFolder))) {
    fs.mkdirSync(path.join(__dirname, docsFolder))
}

// Go through plugin folders and generate an .md file for each folder
plugins.forEach(({ pluginPath, pluginName }) => {
    jsdoc2md.getJsdocData({ files: pluginPath, configure: "./jsdoc2md.json" })

    const templateData = jsdoc2md.getTemplateDataSync({ files: pluginPath, configure: "./jsdoc2md.json" })
    const output = dmd(templateData)

    fs.writeFileSync(path.join(__dirname, docsFolder, `${pluginName}.md`), output)
})

// Create a DOCS.md file that contains a list of all the plugins and their links to their docs
const header = "# DOCS\n\nTo view the documentation for a specific component or class, click on the links below.\n\n"

const links = plugins.map(({ pluginName }) => {
    return `* [${pluginName}](${docsFolder}/${pluginName}.md)\n`
})

fs.writeFileSync(path.join(__dirname, "DOCS.md"), header + links.join(""))

// Restore the original code
replaceToDir(dir, true)