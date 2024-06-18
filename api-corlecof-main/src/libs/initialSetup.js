const { Role } = require("../models/role");

exports.createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount();

        if (count > 0) return;

        const values = await Promise.all([
            new Role({ name: 'profesional' }).save(),
            new Role({ name: 'secretario' }).save(),
            new Role({ name: 'admin' }).save()
        ]);
        console.log(values);
    } catch (error) {
        console.log(error);
    }
};
