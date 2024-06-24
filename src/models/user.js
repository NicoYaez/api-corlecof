const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    rut: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Profesional', 'Secretary', 'Admin']
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, { discriminatorKey: 'role', collection: 'users' }, {
    timestamps: true,
    versionKey: false,
});

userSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.validatePassword = async function (password, receivedPassword) {
    return await bcrypt.compare(password, receivedPassword);
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
