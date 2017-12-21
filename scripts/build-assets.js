#!/usr/bin/env node
'use strict'

const sass = require('node-sass')
const postcss = require('postcss')
const fs = require('fs')
const copydir = require('copy-dir')

const PATHS = {
  build: 'public',
  src: 'src',
  imagesDir: 'images'
}
/**
 * Builds our sass and moves appropriate files around
 *
 * @param {any} sassEntry
 * @param {any} flags any postcss flags we want to pass in
 */
function build (sassEntry, flags) {
  const sourceFile = `${process.cwd()}/${sassEntry}`
  const outputFile = `${process.cwd()}/${PATHS.build}/build.css`

  // make the build direcotry if it doesn't exist
  fs.mkdir(`${process.cwd()}/${PATHS.build}`, (err) => {
    if (err && err.errno !== -17) {
      throw err
    }
  })

  function postcssPlugins() {
    const postcssrc = (() => {
      if (flags.postcssconfig && fs.existsSync(`${process.cwd()}/${flags.postcssconfig}`)) {
        return require(`${process.cwd()}/${flags.postcssconfig}`)
      } else if (fs.existsSync(`${process.cwd()}/.postcss.json`)) {
        return require(`${process.cwd()}/.postcss.json`)
      } else {
        return require('./.postcss.json')
      }
    })()

    return postcssrc.use.map(name => {
      return require(name)(postcssrc[name])
    })
  }

  function importer(url, prev, done) {
    if (url[0] === '~') {
      url = url.substr(1);
    }

    return  { file: url} ;
  }

  // Compile the sass
  const sassOutput = sass.renderSync({
    file: sourceFile,
    includePaths: ['node_modules'],
    outputStyle: 'compressed',
    importer: importer.bind(this)
  })

  // Process postcss
  postcss(postcssPlugins()).process(sassOutput.css.toString(), {from: sourceFile, to: outputFile}).then(result => {
    fs.writeFileSync(outputFile, result.css)
  })

  // Copy image assets over
  copydir(`${PATHS.src}/${PATHS.imagesDir}`, `${PATHS.build}/${PATHS.imagesDir}`, function(err){
    if(err){
      console.error("Failed to copy over image assets: ", err);
    }
  });
}

// Run our build script
build('src/css/index.scss', {});