const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).send("Inccorect form submission!");
  }

const userExist = await prisma.users.findFirst({
  where: {
    email,
  }
})
  if (userExist) {
    return res.status(400).send("User already exists with provided email");
  }

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  const createdUser = await prisma.users.create({
    data: {
      name,
      email,
      joined: new Date(),
    },
  });
  if (!createdUser) {
    return res.status(400).send("User is not created");
  }

  await prisma.login.create({
    data: {
      email,
      hash,
    },
  });
  if (createdUser) {
    return res.json(createdUser);
  } else {
    return res.status(400).send("Problems with hashing");
  }
};

module.exports = { handleRegister };
