const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Topic = require("../models/topic");
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.TopicById = (req, res, next, id) => {
    Topic.findById(id).exec((err, topic) => {
        if(err || !topic) {
            return res.status(400).json({
                error: "Topic not found"
            });
        }
        req.topic = topic;
        next();
    });
};

exports.read = (req, res) => {
    req.topic.photo = undefined;
    return res.json(req.topic);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields

        const {
            name,
            description,
            category,
            route
        } = fields;

        if (
            !name ||
            !description ||
            !category ||
            !route 
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let topic = new Topic(fields);

        if(files.photo) {
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            topic.photo.data = fs.readFileSync(files.photo.path);
            topic.photo.contentType = files.photo.type;
        }

        topic.save((err, result) => {
            if(err) {
               return res.status(400).json({
                   error: errorHandler(err)
               });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let topic = req.topic;
    topic.remove((err, deletedTopic) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Topic deleted successfully"
        });
    });
};


exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {
            name,
            description,
            category,
            route
        } = fields;

        if (
            !name ||
            !description ||
            !category ||
            !route
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let topic = req.topic;
        topic = _.extend(topic, fields);

        if(files.photo) {
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            topic.photo.data = fs.readFileSync(files.photo.path);
            topic.photo.contentType = files.photo.type;
        }

        topic.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};


exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Topic.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, topics) => {
            if (err) {
                return res.status(400).json({
                    error: "Topics not found"
                });
            }
            res.json(topics);
        });
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Topic.find({ _id: { $ne: req.topic}, category: req.topic.category})
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, topics) => {
            if (err) {
                return res.status(400).json({
                        error: "Topics not found"
                });
            }
            res.json(topics);
        });
};

exports.listCategories = (req, res) => {
    Topic.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy: "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "category") {
                findArgs[key] = req.body.filters[key];
                    
                
            } 
        }
    }

    Topic.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Topics not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};


//
exports.photo = (req, res, next) => {
    if(req.topic.data) {
        res.$et("Content-Type", req.topic.photo.contentType);
        return res.send(req.topic.photo.data);     
    }
    next();
};
