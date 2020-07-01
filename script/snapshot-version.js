const {execSync} = require('child_process')
const fs = require('fs')

let version = getVersion()

if(version.endsWith('-SNAPSHOT')) {
    version = version.concat(`-${(new Date).getTime()}`)

    execSync(`npm version ${version} --git-tag-version=false`)

}
console.log(`Version will be deploy: ${version} `)

function getVersion() {
    const pkg = fs.readFileSync('./package.json')
    return JSON.parse(pkg.toString()).version

}