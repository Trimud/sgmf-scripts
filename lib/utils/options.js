'use strict';
module.exports = {
    options: [{
        option: 'help',
        type: 'Boolean',
        description: 'Generate help message'
    }, {
        option: 'upload',
        type: '[path::String]',
        description: 'Upload a file to a sandbox. Requires dw.json file at the root directory.'
    }, {
        option: 'uploadCartridge',
        type: '[String]',
        description: 'Upload a cartridge. Requires dw.json file at the root directory.'
    }, {
        option: 'skipUpload',
        type: 'Boolean',
        description: 'Skips files uploading. Useful when you want to upload files with Prophet Uploader.'
    }, {
        option: 'test',
        type: '[path::String]',
        description: 'Run unittests on specified files/directories.'
    }, {
        option: 'cover',
        type: '[path::String]',
        description: 'Run all unit tests with coverage report.'
    }, {
        option: 'include',
        type: 'String',
        description: 'Include paths.',
        dependsOn: 'cover'
    }, {
        option: 'exclude',
        type: 'String',
        description: 'Exclude paths.',
        dependsOn: 'cover'
    }, {
        option: 'compile',
        type: 'String',
        description: 'Compile css/js files.',
        enum: ['css', 'js']
    }, {
        option: 'lint',
        type: 'String',
        description: 'Lint scss/js files.',
        enum: ['js', 'css']
    }, {
        option: 'cartridgeName',
        type: 'String',
        description: 'Overriding package.json cartridge name.',
        dependsOn: 'compile',
        example: 'sgmf-scripts --compile js --cartridgeName app_custom_cartridge'
    }, {
        option: 'createCartridge',
        type: 'String',
        description: 'Create new cartridge structure'
    }, {
        option: 'watch',
        type: 'Boolean',
        description: 'Watch and upload files'
    }, {
        option: 'onlycompile',
        type: 'Boolean',
        description: 'Only compile during the watch option.'
    }, {
        option: 'integration',
        type: '[path::String]',
        description: 'Run integration test on specified files/directories.'
    }, {
        option: 'baseUrl',
        type: 'String',
        dependsOn: ['or', 'integration'],
        description: 'Url of the server for integration/functional tests.'
    }],
    mutuallyExclusive: ['integration', 'test', 'upload', 'uploadCartridge', 'compile', 'lint', 'createCartridge', 'watch', 'onlycompile']
};
