const PremiumScannedFoods = require("./database/models/premiumScannedFoodSchema");
const TACO = require("./database/models/tacoSchema");
const {
  MongoFindTransactionException,
  MongoInsertTransactionException,
} = require("./exceptions/mongoExcpetions");

const findTacoFoodDescriptionByName = async (labeledFood) => {
  try {
    const tacoLabel = await TACO.find({
      description: labeledFood,
    });
    return JSON.parse(JSON.stringify(tacoLabel));
  } catch (error) {
    console.error("Erro ao encontrar a descrição do alimento: ", error);
    throw MongoFindTransactionException(
      `Erro ao buscar pelo alimento na TACO com a label: ${labeledFood}`
    );
  }
};

const insertValidatedFoodAssignment = async (consolidatedResponse) => {
  try {
    if (consolidatedResponse) {
      await PremiumScannedFoods.insertMany(consolidatedResponse);
      return "Scan consolidado populado no MangoDB";
    } else
      throw new missingPaylodException(
        "Objeto de consolidação não deve ser nulo/undefined"
      );
  } catch (error) {
    console.error("Erro na inserção do labeling consolidado no Mongo: ", error);
    throw MongoInsertTransactionException(
      `Erro ao salvar ${consolidatedResponse} no Banco`
    );
  }
};

module.exports = {
  findTacoFoodDescriptionByName,
  insertValidatedFoodAssignment,
};
