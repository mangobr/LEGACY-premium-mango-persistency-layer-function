const scannedFoodMockk = require('./json/scannedFooodMock.json')
const tacoFoodResult = require('./json/mockkMangoDB.json')

const returnConsolidatedFoodScan = () => {
    return scannedFoodMockk[0]
}

const returnTacoFoodResult = () =>{
    return tacoFoodResult
}
module.exports = {
  returnConsolidatedFoodScan,
  returnTacoFoodResult
};
