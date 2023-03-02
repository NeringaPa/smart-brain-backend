const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleSignin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission!");
  }

  const user = await prisma.login.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(400).json("Unable to get user");
  }

  const isValid = bcrypt.compareSync(password, user.hash);
  if (!isValid) {
    return res.status(400).json("Wrong credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      entries: user.entries,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
};

module.exports = { handleSignin };
