// find and replace all strings "// @type definition" with "1 // @type definition"
// this is a workaround for a bug in the babel plugin and jsdoc
import fs from "fs"
import path from "path"

const ORIGINAL = "// @type definition"
const REPLACEMENT = "1 // WORKARAOUND"

const dir = path.join(process.cwd(), "src")

const replaceToDir = (dir, reverse = false) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        // check if file is a directory
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            replaceToDir(path.join(dir, file))
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

const reverse = process.argv.includes("--reverse")

replaceToDir(dir, reverse)

