# parcel-resolver-pnpm

## About

ParcelJS considers all dependencies that are symbolic links as "source dependencies" and then takes special treatment. However, for the PNPM package manager each installed package is a symbolic link to the packages stored in the store. Learn more in [this issue](https://github.com/parcel-bundler/parcel/issues/5784).

The purpose of this plugin is to improve the integration between the PNPM and ParcelJS.

## Usage

```sh
pnpm i parcel-resolver-pnpm
```

Partial `.parcelrc` file:

```
{
  "resolvers": [
    "parcel-resolver-pnpm",
    "..."
  ]
}
```

----

This Proof-Of-Concept solution is based on [this comment](https://github.com/parcel-bundler/parcel/issues/5784#issuecomment-780607850).

[```src/PNPMResolver.ts```](src/PNPMResolver.ts) (based on [DefaultResolver](https://github.com/parcel-bundler/parcel/blob/17404e9a9ee6323b973a681017937a4bc6966277/packages/resolvers/default/src/DefaultResolver.js)):

```diff
+ resolver.processPackage = async function (pkg: any, file: string, dir: string) {
+   await NodeResolver.prototype.processPackage.call(this, pkg, file, dir)
+   if (pkg.source) {
+     const realpath = await this.fs.realpath(file)
+     if (realpath.includes("node_modules/.pnpm")) {
+       delete pkg.source
+     }
+   }
+ }
```

## References:

- <https://github.com/parcel-bundler/parcel/issues/5784>

- <https://github.com/parcel-bundler/parcel/issues/5784#issuecomment-780583921>

- <https://github.com/parcel-bundler/parcel/blob/f28eaf60ac018d49d2176c563c86d09f84feaa8e/packages/utils/node-resolver-core/src/NodeResolver.js#L647-L654>

- <https://github.com/parcel-bundler/parcel/blob/17404e9a9ee6323b973a681017937a4bc6966277/packages/resolvers/default/src/DefaultResolver.js>

## License

MIT