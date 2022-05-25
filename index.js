#!/usr/bin/env node

'use strict';

const shell = require('shelljs');
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const css = require('./lib/compile/cssCompile');
const js = require('./lib/compile/jsCompile');
const createCartridge = require('./lib/createCartridge');
const overlayTester = require('./lib/tests/overlayTester');
const chalk = require('chalk');
const os = require('os');
const webpack = require('webpack');
const chokidar = require('chokidar');
const multiScssConfigs = require('./lib/utils/multiScssConfigs');
const multiJSConfigs = require('./lib/utils/multiJSConfigs');

const cwd = process.cwd();
const pwd = __dirname;

const optionator = require('optionator')(require('./lib/utils/options'));

function checkForDwJson() {
    return fs.existsSync(path.join(cwd, 'dw.json'));
}

function getDwJson() {
    if (checkForDwJson()) {
        return require(path.join(cwd, 'dw.json'));
    }
    return {};
}

function dwuploadModule() {
    let dwupload = fs.existsSync(path.resolve(cwd, './node_modules/.bin/dwupload')) ?
        path.resolve(cwd, './node_modules/.bin/dwupload') :
        path.resolve(pwd, './node_modules/.bin/dwupload');

    if (os.platform() === 'win32') {
        dwupload += '.cmd';
    }
    return dwupload;
}

function shellCommands(param, fileOrCartridge) {
    const dwupload = dwuploadModule();
    if (os.platform() === 'win32') {
        return `cd ./cartridges && ${dwupload} ${param} ${fileOrCartridge} && cd ..`;
    }
    return `cd ./cartridges && node ${dwupload} ${param} ${fileOrCartridge} && cd ..`;
}

function uploadFiles(files) {
    shell.cp('dw.json', './cartridges/'); // copy dw.json file into cartridges directory temporarily

    files.forEach(file => {
        const relativePath = path.relative(path.join(cwd, './cartridges/'), file);
        shell.exec(shellCommands('--file', relativePath));
    });

    shell.rm('./cartridges/dw.json'); // remove dw.json file from cartridges directory
}

function deleteFiles(files) {
    shell.cp('dw.json', './cartridges/'); // copy dw.json file into cartridges directory temporarily

    files.forEach(file => {
        const relativePath = path.relative(path.join(cwd, './cartridges/'), file);
        shell.exec(shellCommands('delete --file', relativePath));
    });

    shell.rm('./cartridges/dw.json'); // remove dw.json file from cartridges directory
}

function createIstanbulParameter(option, command) {
    let commandLine = ' ';

    if (option) {
        commandLine = option.split(',')
            .map(commandPath => ' -' + command + ' ' + commandPath).join(' ') + ' ';
    }

    return commandLine;
}

const options = optionator.parse(process.argv);

if (options.help) {
    console.log(optionator.generateHelp());
    process.exit(0);
}


// upload a file
if (options.upload) {
    if (!checkForDwJson()) {
        console.error(chalk.red('Could not find dw.json file at the root of the project.'));
        process.exit(1);
    }

    uploadFiles(options.upload);

    process.exit(0);
}

// upload cartridge
if (options.uploadCartridge) {
    if (!checkForDwJson()) {
        console.error(chalk.red('Could not find dw.json file at the root of the project.'));
        process.exit(1);
    }

    shell.cp(path.join(cwd, 'dw.json'), path.join(cwd, './cartridges/'));

    const cartridges = options.uploadCartridge;
    cartridges.forEach(cartridge => {
        shell.exec(shellCommands('--cartridge', cartridge));
    });

    shell.rm(path.join(cwd, './cartridges/dw.json'));
    process.exit(0);
}

// run unittests
if (options.test) {
    const mocha = fs.existsSync(path.resolve(cwd, './node_modules/.bin/_mocha')) ?
        path.resolve(cwd, './node_modules/.bin/_mocha') :
        path.resolve(pwd, './node_modules/.bin/_mocha');
    console.log(`${mocha} "${options.test.join(' ')}" --reporter spec`);
    const subprocess = spawn(
        `${mocha} "${options.test.join(' ')}" --reporter spec --recursive `,
        { stdio: 'inherit', shell: true, cwd }
    );

    subprocess.on('exit', code => {
        process.exit(code);
    });
}

// run unittest coverage
if (options.cover) {
    const istanbul = fs.existsSync(path.resolve(cwd, './node_modules/.bin/istanbul')) ?
        path.resolve(cwd, './node_modules/.bin/istanbul') :
        path.resolve(pwd, './node_modules/.bin/istanbul');
    const mocha = fs.existsSync(path.resolve(cwd, './node_modules/.bin/_mocha')) ?
        path.resolve(cwd, './node_modules/mocha/bin/_mocha') :
        path.resolve(pwd, './node_modules/mocha/bin/_mocha');

    const subprocess = spawn(
        `${istanbul} cover ${createIstanbulParameter(options.exclude, 'x')} ${createIstanbulParameter(options.include, 'i')} ${mocha}  -- -R spec --recursive "${options.cover.join(' ')}"`,
        { stdio: 'inherit', shell: true, cwd }
    );

    subprocess.on('exit', code => {
        process.exit(code);
    });
}

// compile static assetts
if (options.compile) {
    const packageFile = require(path.join(cwd, './package.json'));
    if (options.compile === 'js') {
        js(packageFile, cwd, code => {
            process.exit(code);
        });
    }
    if (options.compile === 'css') {
        css(packageFile, cwd, code => {
            process.exit(code);
        });
    }
}

if (options.lint) {
    if (options.lint === 'js') {
        const subprocess = spawn(
            path.resolve(cwd, './node_modules/.bin/eslint') +
            ' .', { stdio: 'inherit', shell: true, cwd });

        subprocess.on('exit', code => {
            process.exit(code);
        });
    }
    if (options.lint === 'css') {
        const subprocess = spawn(
            path.resolve(cwd, './node_modules/.bin/stylelint') +
            ' --syntax scss "**/*.scss"', { stdio: 'inherit', shell: true, cwd });

        subprocess.on('exit', code => {
            process.exit(code);
        });
    }
}

if (options.createCartridge) {
    const cartridgeName = options.createCartridge;
    console.log('Created folders and files for cartridge ' + cartridgeName);
    createCartridge(cartridgeName, cwd);
}

if (options.integration) {
    const integrationTests = options.integration[0];
    let baseUrl = options.baseUrl;

    if (!baseUrl && !checkForDwJson()) {
        console.error(chalk.red('Could not find dw.json file or --baseUrl parameter'));
        process.exit(1);
    }

    baseUrl = baseUrl || getDwJson().hostname;

    global.baseUrl = baseUrl;

    let tester = overlayTester.addAllTests(cwd, integrationTests);
    tester = overlayTester.dedupeTests(tester);
    overlayTester.runTests(tester);

    delete global.baseUrl;
}

if (options.watch) {
    const jsConfigs = multiJSConfigs.getConfigs();
    const scssConfigs = multiScssConfigs.getConfigs();

    let config = [];
    config = config.concat(jsConfigs);
    config = config.concat(scssConfigs);

    const compiler = webpack(config);

    compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });

    if (!options.onlycompile) {
        const watcher = chokidar.watch(path.join(cwd, 'cartridges'), {
            ignored: [
                '**/cartridge/js/**',
                '**/cartridge/client/**',
                '**/*.scss'
            ],
            persistent: true,
            ignoreInitial: true,
            followSymlinks: false,
            awaitWriteFinish: {
                stabilityThreshold: 300,
                pollInterval: 100
            }
        });

        watcher.on('change', filename => {
            console.log(`Detected change in file: ${filename}`);
            if (!options.skipUpload) {
                uploadFiles([filename]);
            }
        });

        watcher.on('add', filename => {
            console.log(`Detected added file: ${filename}`);
            if (!options.skipUpload) {
                uploadFiles([filename]);
            }
        });

        watcher.on('unlink', filename => {
            console.log(`Detected deleted file: ${filename}`);
            if (!options.skipUpload) {
                deleteFiles([filename]);
            }
        });
    }
}

