import fs from 'fs'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const src = 'src'

const main = (pkg) => {
  const copyTargets = []
  const plugins = [
    typescript({ useTsconfigDeclarationDir: true }),
    process.env.M !== 'false' && terser(),
    copy({ targets: copyTargets }),
  ]

  const { dependencies = {}, peerDependencies = {}, main, module, types } = pkg.config

  const external = (key) => {
    return dependencies[key] || peerDependencies[key] || key.startsWith('./internal')
  }
  const basePath = path.relative(__dirname, pkg.dir)
  const outputPath = path.relative(__dirname, 'dist/')
  let input = path.join(basePath, `${src}/index.tsx`)
  let copyPath = path.join(basePath, 'copy')
  const output = []

  if (fs.existsSync(copyPath)) {
    copyTargets.push({ src: `${copyPath}/*`, dest: outputPath })
  }
  ;['package.json', 'README.md'].forEach((fileName) => {
    const filePath = path.join(basePath, fileName)
    if (fs.existsSync(filePath)) {
      copyTargets.push({ src: filePath, dest: outputPath })
    }
  })

  if (main) {
    output.push({
      file: path.join(outputPath, main),
      format: 'cjs',
    })
  }

  if (module) {
    output.push({
      file: path.join(outputPath, module),
      format: 'esm',
    })
  }
  
  const results = []

  results.push({
    input,
    output,
    external,
    plugins,
  })

  if (types) {
    const typesInput = path.join('dist/ts-out', basePath, `${src}/index.d.ts`)
    const typesOutput = []
    if (main) typesOutput.push({ file: path.join(outputPath, 'index.d.ts'), format: 'es' })

    results.push({
      input: typesInput,
      output: typesOutput,
      external,
      plugins: [dts()],
    })
  }
  return results
}

const getPkg = (dir) => {
  const config = require(path.join(__dirname, dir, '/package.json'))

  return {dir, config, name: config.name}
}

export default main(getPkg('.'))
