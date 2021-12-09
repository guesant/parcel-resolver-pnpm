/*
This file is based on the ParcelJS's DefaultResolver v2.0.1

Source Code: https://github.com/parcel-bundler/parcel/blob/17404e9a9ee6323b973a681017937a4bc6966277/packages/resolvers/default/src/DefaultResolver.js
*/

import NodeResolver from "@parcel/node-resolver-core"
import { Resolver } from "@parcel/plugin"

// Throw user friendly errors on special webpack loader syntax
// ex. `imports-loader?$=jquery!./example.js`
const WEBPACK_IMPORT_REGEX = /^\w+-loader(?:\?\S*)?!/

export default new Resolver({
  resolve({ dependency, options, specifier }) {
    if (WEBPACK_IMPORT_REGEX.test(dependency.specifier)) {
      throw new Error(
        `The import path: ${dependency.specifier} is using webpack specific loader import syntax, which isn't supported by Parcel.`
      )
    }

    const resolver = new NodeResolver({
      fs: options.inputFS,
      projectRoot: options.projectRoot,
      // Extensions are always required in URL dependencies.
      extensions:
        dependency.specifierType === "commonjs" ||
        dependency.specifierType === "esm"
          ? ["ts", "tsx", "js", "jsx", "json"]
          : [],
      mainFields: ["source", "browser", "module", "main"]
    })

    resolver.processPackage = async function (pkg: any, file: string, dir: string) {
      await NodeResolver.prototype.processPackage.call(this, pkg, file, dir)
      if (pkg.source) {
        const realpath = await this.fs.realpath(file)
        if (realpath.includes("node_modules/.pnpm")) {
          delete pkg.source
        }
      }
    }

    return resolver.resolve({
      filename: specifier,
      specifierType: dependency.specifierType,
      parent: dependency.resolveFrom,
      env: dependency.env,
      sourcePath: dependency.sourcePath
    })
  }
})
