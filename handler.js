const R = require("ramda");
const MangoDBConnect = require("./database/mangoodbConnect");
const {
  IncomingS3EventNotFound,
  RekoNotFoundExcpetion,
} = require("./exceptions/payloadExceptions");
const {
  findTacoFoodDescriptionByName,
  insertValidatedFoodAssignment,
} = require("./mangoDBTransactions");
const createPreassignedModel = require("./factory/modelPreassignFactory");
const createConsolidatedScan = require("./factory/foodAggregateRecognitionFactory");

MangoDBConnect();

const mangoDBOperationsPremium = async (event) => {
  try {
    let assignedNutritionalFactsList = [];
    const s3EventObject = R.pathOr(
      null,
      ["requestPayload", "requestPayload", "Records", [0], "s3"],
      event
    );
    if (!s3EventObject)
      throw new IncomingS3EventNotFound(
        `Evento de upload não contém informações do S3 no eventId: ${event.requestContext.requestId}`
      );

    const objectKeys = R.path(["object", "key"], s3EventObject);
    const bucketName = R.path(["bucket", "name"], s3EventObject);
    const userId = R.split("/", objectKeys)[1];
    const photo = R.split("/", objectKeys)[2];

    const labelList = R.pathOr(
      null,
      ["responsePayload", "responsePayload", "CustomLabels"],
      event
    );
    if (!labelList)
      throw new RekoNotFoundExcpetion(
        `Não foi possível identificar os objetos do eventId: ${event.requestContext.requestId}`
      );
    await Promise.all(
      labelList.map(async (label) => {
        const customLabelAccuracy = R.pathOr(null, ["Confidence"], label);
        const foodLabel = R.propOr(null, ["Name"], label);
        if (customLabelAccuracy > 40) {
          const foodNutritionalFacts = await findTacoFoodDescriptionByName(
            foodLabel
          );
          if (!R.isEmpty(foodNutritionalFacts)) {
            const assignedNutritionalFacts = createPreassignedModel(
              foodLabel,
              foodNutritionalFacts[0]
            );
            assignedNutritionalFactsList.push(assignedNutritionalFacts);
          }
        }
      })
    );
    const consolidatedFoodAssignment = createConsolidatedScan(
      userId,
      assignedNutritionalFactsList,
      R.propOr(null, ["timestamp"], event),
      `https://s3.amazonaws.com/${bucketName}/uploads/${userId}/${photo}`
    );
    await insertValidatedFoodAssignment(consolidatedFoodAssignment)
  } catch (error) {
    console.log(error);
  }
};

module.exports = mangoDBOperationsPremium;
