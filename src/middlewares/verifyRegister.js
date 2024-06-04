const { RolesActivos } = require("../models/role");
const User = require("../models/user");

const checkRegisterUser = async (req, res, next) => {
    const emailBody = req.body.email.toLowerCase();
    const user = await User.findOne({ username: req.body.username })

    if (user) return res.status(400).json({ message: "El usuario ya existe" })

    const email = await User.findOne({ email: emailBody })

    if (email) return res.status(400).json({ message: "El email ya existe" })
    
    next();
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!RolesActivos.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: `El role ${req.body.roles[i]} no existe`
                })
            }
        }
    }
    next();
}
module.exports = {
    checkRegisterUser,
    checkRolesExisted
  };