const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; //esto se usa para referenciar las asociacion de un modelo con otro(como en otras bases de datos pero en mongodb)

const topicSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim:true,
            required:true,
            maxlength: 2000

        },
        description: {
            type:String,
            required: true,
            maxlength: 4000
        },
        category: {
            type: ObjectId,
            ref: "Category",
            required: true
        },
        route:{
            type: String,
            trim:true,
            required:true,
            maxlength: 3000
        },
        photo: {
            data: Buffer,
            contentType: String,
            
        }

    },
    {timestamps: true}
);

module.exports = mongoose.model("Topic",topicSchema);