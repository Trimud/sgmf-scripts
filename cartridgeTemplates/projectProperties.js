'use strict';

module.exports = cartridgeName => `## cartridge.properties for cartridge ${cartridgeName}
#${new Date(Date.now()).toString()}
demandware.cartridges.${cartridgeName}.multipleLanguageStorefront=true
demandware.cartridges.${cartridgeName}.id=${cartridgeName}
`;
