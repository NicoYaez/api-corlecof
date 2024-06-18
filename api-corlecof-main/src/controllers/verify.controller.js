const User = require("../models/user");
const { Role } = require("../models/role");

const verifyController = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ auth: false, message: 'Usuario no encontrado' });
    }

    res.status(200).json({ auth: true, message: 'Usuario encontrado' });
};

module.exports = { verifyController };
