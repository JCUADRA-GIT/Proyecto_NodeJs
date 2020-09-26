  
const express = require("express");
const router = express.Router();


const {
    create,
    TopicById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
} = require("../controllers/topic");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");


router.get("/topic/:topicId", read);


router.post("/topic/create/:userId", requireSignin, isAuth, isAdmin, create);

router.delete(
    "/topic/:topicId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.put(
    "/topic/:topicId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get("/topics", list);
router.get("/topics/related/:topicId", listRelated);
router.get("/topics/categories", listCategories);
router.post("/topics/by/search", listBySearch);
router.get("/topic/photo/:topicId", photo);

router.param("userId", userById);
router.param("topicId", TopicById);

module.exports = router;