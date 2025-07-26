const mongoose = require("mongoose");

const ArbitrationSchema = new mongoose.Schema({
        _id: {
            type: String,
            default: "arbiLog",
        },

        arbiLastIndex: {
            type: Number,
            default: 0,
        },

        arbiLastTimestamp: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }); // Includes createdAt, updatedAt

ArbitrationSchema.statics.getOrCreate = async function () {
    let arbiLog = await this.findById("arbiLog");
    if (!arbiLog) {
        arbiLog = new this({ _id: "arbiLog" });
        await arbiLog.save();
    }
    return arbiLog;
};

const Arbitrations = mongoose.model("Arbitrations", ArbitrationSchema);
module.exports = Arbitrations;
