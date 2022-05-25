# SGMF Scripts

This repository contains a collection of scrips that are useful for creating Storefront Reference Architecture overlay cartridges. All of the scripts are executable through CLI.

## Available commands

`--help` - Generate help message

`--upload [path::String]` - Upload a file to a sandbox. Requires dw.json file at the root directory.

`--uploadCartridge [String]` - Upload a cartridge. Requires dw.json file at the root directory.

`--test [path::String]` - Run unittests on specified files/directories.

`--integration [path::String]` - Run overlay integration tests on specified files/directories.

`--cover [--include **/cartridges/**/*.js] [--exclude **/bin/**,**/cartridges/**]` - Run all unittests with coverage report. The include and exclude parameter is meant to limit coverage reporting to the requested paths.

`--compile String` - Compile css/js files. - either: css or js

`--lint String` - Lint scss/js files. - either: js or css

`--createCartridge String` - Create new cartridge structure

`--watch` - Watch and upload files

`--watch --skipUpload` - Watch files without uploading them


## Installation and usage

You can install this module from NPM command:

```sh
npm install sgmf-scripts --save-dev
```

```sgmf command to run overlay cartridge integration tests, in the overlay cartridge root directory
npm run test:integration https://hostname/on/demandware.store/Sites-RefArch-Site/en_US
```

```sample debug sgmf script in VSCode, add this configuration to launch.json, this runs the local sgmf script index.js file instead of the published one, so that you can set break point in the local version of sgmf.
 {
            "type": "node",
            "request": "launch",
            "name": "Mocha overlay Integration Tests",
            "program": "${workspaceFolder}/../sgmf-scripts/index.js",
            "args": [
                "--integration",
                "test/integration/**/*.js",
                "--baseUrl",
                "https://hostname/on/demandware.store/Sites-RefArch-Site/en_US",  
            ],
            "cwd": "${workspaceFolder}",
            "internalConsoleOptions": "openOnSessionStart"
        }
}
```

```call local sgmf script instead of the published sgmf 
1. From sgmf-scripts repo root directory
npm link
2. From plugin cartridge root directory
npm link sgmf-scripts
you will see something like this to indicate the link has created : 
/Users/xxx/Salesforce/plugin_giftregistry/node_modules/sgmf-scripts -> /usr/local/lib/node_modules/sgmf-scripts -> /Users/xxx/Salesforce/sgmf-scripts
3. To remove the link, just delete the node_modules directory and run npm install again
```


In order for all commands to work, this script makes a few assumptions:

* There's a `dw.json` file at the root of your repository, that contains information with the path to your sandbox, as well as username and password
* There's a `cartridges` top level folder that contains your cartridge
* `name` property in `package.json` matches the name of your cartridge, or if it doesn't, there's a `packageName` property with the name of the cartridge
* If this an overlay cartridge, `package.json` contains `paths` property, that's of type `Array` and contains key/value pairs with name/path to all cartridges that will come below yours. For example, if you are creating a cartridge that will be overlayed on top of `app_storefront_base` `paths` property will look something like this: `[{ "base": "../sfra/cartridges/app_storfront_base"}]`
* ESLint and Stylelint are dev-dependancies of your cartridge. You have all required plugins and configs installed as well.
* There's a webpack.config.js at the top of your project that specifies how to compile client-side JavaScript files.
* Your `package.json` file contains `browserslist` key that specifies which browsers you are targeting, to compile SCSS files with correct prefixes. See https://github.com/ai/browserslist for more details

