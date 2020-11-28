const mongoose = require("mongoose")
const mangoDBConnectionString = 'mongodb://localhost:27017/?readPreference=primary&ssl=false'
const PremiumScannedFoods = require("../database/models/premiumScannedFoodSchema");
const TACO = require("../database/models/tacoSchema")
const { findTacoFoodDescriptionByName, insertValidatedFoodAssignment } = require("../mangoDBTransactions")
const {returnConsolidatedFoodScan, returnTacoFoodResult} = require('./__mocks__/mockks')

mongoose.connect(mangoDBConnectionString)

  describe('Should test mongoDB TACO Collection transactions', ()=>{
    beforeAll(async () =>{
        await TACO.remove({})
    })

    afterEach(async()=>{
        await TACO.remove({})
    })

    test('should validate TACO schema', () => {
        expect(TACO).toBeDefined()
    })

    // test('should return a single food which has been filtered by description', async () => {
    //     const tacoCollection = new TACO(returnTacoFoodResult()[0])
    //     await tacoCollection.save()
    //     const premiumResultsFilteredByName = await findTacoFoodDescriptionByName("Meat, beef, ground beef, ground, cooked")
    //     expect(premiumResultsFilteredByName).toEqual(returnTacoFoodResult())
    // })
  })

  describe('Should test mongoDB ScannedFood Collection transactions', ()=>{
    beforeAll(async () =>{
        await PremiumScannedFoods.remove({})
    })

    afterEach(async()=>{
        await PremiumScannedFoods.remove({})
    })

    test('should validate PremiumScannedFoods schema', () => {
        expect(PremiumScannedFoods).toBeDefined()
    })

    test('should insert a consolidated food scan in MongoDB', async () => {
        const insertedConsolidatedFoodScan = await insertValidatedFoodAssignment(returnConsolidatedFoodScan())
        expect(insertedConsolidatedFoodScan).toEqual('Scan consolidado populado no MangoDB')
        
    })
  })