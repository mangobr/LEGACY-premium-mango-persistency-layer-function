const R = require("ramda")
const MangoDBConnect = require("./database/mangoodbConnect")
const {IncomingS3EventNotFound, RekoNotFoundExcpetion} = require("./exceptions/payloadExceptions")

MangoDBConnect()

const mangoDBOperationsPremium = async (event) => {
  let assignedFoods = [];
  try {
    const s3EventObject = R.pathOr(
      null,
      ["requestPayload", "requestPayload","Records", [0], "s3"],
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

    const labelList = R.pathOr(null, ["responsePayload", "responsePayload", "CustomLabels"], event);
    if (!labelList)
      throw new RekoNotFoundExcpetion(
        `Não foi possível identificar os objetos do eventId: ${event.requestContext.requestId}`
      );
    labelList.map(async label => {
        const customLabelAccuracy = R.pathOr(null, ["Confidence"], label)
        if(customLabelAccuracy > 40){
            // const foodDBResponse = 
        }
    })
  } catch(error){
    console.log(error)   
  }
};

module.exports = mangoDBOperationsPremium
