
const Comment = require("../models/comment");
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.create = (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({data});
    });
};

exports.commentById = (req, res, next, id) => {
    Comment.findById(id).exec((err, comment) => { //aqui obtenemos el error o el comentario
       if(err || !comment){ // si nos da error o si comentario viene vacia
           return res.status(400).json({
               error: "Commentary does not exist"
           });
       } 
       req.comment = comment; //en el caso de que exista  le pasamos el comentario al request para mostrarlo
       next(); //continuamos con el flujo

    });
};

exports.read = (req, res) => {
    return res.json(req.comment);
};


exports.list = (req, res) => {
    Comment.find().exec((err, data) => {  //realizamos una consulta a nuestro modelo-coleccion para traer los registros asociados a ese modelo
        if(err){               // si nos da error manejamos ese contexto del error
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);  // y si no devolvemos la data, la mostramos
    });
};

///



