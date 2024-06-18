const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RolesActivos = ["profesional", "secretario", "admin"];

const roleSchema = new Schema(
    {
        name: String,
    }, 
    {
        versionKey: false
    }
);

const Role = model("Role", roleSchema);

module.exports = {
    RolesActivos,
    Role
};
