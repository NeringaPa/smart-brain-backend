const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();

metadata.set("authorization", "Key " + process.env.API_KEY);

const handleApiCall = (req, res) => {
  console.log('Try to call to API');
  stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "age-demographics-recognition",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
  )
}

const handleImage = async(req, res) =>{
    const { id } = req.body;

    const entries = await prisma.users.update({
      where: {
        id: id,
      },
      data: { 
        entries: { increment: 1 } 
      }
    })
    if (!entries) {
      return res.status(400).json("Unable to get entries");
    }
    return res.json(entries);

}

module.exports = {handleImage, handleApiCall};