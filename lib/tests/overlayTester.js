'use strict';

const Mocha = require('mocha');
const overlays = require('../utils/overlays');
const map = require('../utils/map');
const cartridges = require('../utils/cartridge');
const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');

let allCartridges = null;

module.exports = {
    addAllTests: (cwd, testDirPostfix) => {
        allCartridges = new Map();
        allCartridges.set(cartridges.getCartridgeName(cwd), path.join(cwd, 'cartridges', cartridges.getCartridgeName(cwd), 'cartridge'));
        const underlays = overlays.getUnderlaysForDir(cwd);
        map.concat(allCartridges, underlays);
        const mocha = new Mocha();
        allCartridges.forEach(cartridge => {
            const files = shell.ls(path.join(cartridge, '../../..', testDirPostfix));
            files.forEach((file) => {
                mocha.addFile(file);
            });
        });

        return mocha;
    },
    dedupeTests: (mocha) => {
        const tests = new Map();
        const toBeDeleted = new Map();
        mocha.loadFiles(() => {
            mocha.suite.suites.forEach(suite => {
                let index = 0;
                const cartridge = cartridges.getCartridgeFromFile(suite.file, allCartridges);
                while (index < suite.tests.length) {
                    const test = suite.tests[index];
                    const filePath = cartridges.getTestRelPath(test.file, cartridge.path);
                    if (tests.has(`${filePath} ${test.fullTitle()}`)) {
                        const recordedTest = tests.get(`${filePath} ${test.fullTitle()}`);
                        const sameFile = filePath === cartridges.getTestRelPath(recordedTest.file, recordedTest.cartridge.path);
                        if (sameFile) {
                            if (overlays.isUnderlay(cartridge.name, recordedTest.cartridge.name, allCartridges)) {
                                // move tests into teBeDeleted list
                                toBeDeleted.set(`${recordedTest.filePath} ${test.fullTitle()}`, recordedTest);
                                tests.delete(`${recordedTest.filePath} ${test.fullTitle()}`);
                                index++;
                            } else {
                                // delete current test from the mocha list
                                suite.tests.splice(index, 1);
                            }
                        } else {
                            tests.set(`${filePath} ${test.fullTitle()}`, { cartridge, file: test.file, filePath, test });
                            index++;
                        }
                    } else {
                        tests.set(`${filePath} ${test.fullTitle()}`, { cartridge, file: test.file, filePath, test });
                        index++;
                    }
                }
            });

            if (toBeDeleted.size > 0) {
                mocha.suite.suites.forEach(suite => {
                    suite.tests.forEach((test, index) => {
                        if (toBeDeleted.has(test.fullTitle()) && test.file === toBeDeleted.get(test.fullTitle()).file) {
                            suite.tests.splice(index, 1);
                            toBeDeleted.delete(test.fullTitle());
                        }
                    });
                });
            }

            mocha.suite.suites.forEach(suite => {
                /* eslint-disable no-param-reassign */
                suite.title = chalk.blue(`From cartridge "${cartridges.getCartridgeFromFile(suite.file, allCartridges).name}"`) + ` - ${suite.title}`;
                /* eslint-enable no-param-reassign */
            });
        });

        return mocha;
    },
    runTests: (mocha) => {
        mocha.run((failures) => {
            if (failures) {
                process.exit(failures ? 1 : 0);
            }
        });
    }
};
