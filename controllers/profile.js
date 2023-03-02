const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleProfileGet = async(req, res) =>{
    const { id } = req.params;
    
    const userProfile = await prisma.users.findOne({
      where: {
        id: id,
      },
    })
    if (!userProfile) {
      return res.status(400).json("User not found");
    }
    return res.json(userProfile);

}

module.exports = {handleProfileGet};