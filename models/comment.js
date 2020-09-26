const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; //esto se usa para referenciar las asociacion de un modelo con otro(como en otras bases de datos pero en mongodb)


const commentSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
            maxlength: 3000
        },
        description:{
            type: String,
            required:true,
            maxlength:10000
        },
        topic: {
            type: ObjectId,
            ref: "Topic",
            required: true
        }

    },
    {timestamps: true}
);
module.exports = mongoose.model("Comment", commentSchema);