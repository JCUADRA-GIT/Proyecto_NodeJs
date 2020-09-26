const express = require("express");
const router = express.Router();

const {
    create,
    commentById,
    read,
    list,
    listBySearch
   

} = require("../controllers/comment");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");
const { TopicById } = require("../controllers/topic");

router.get("/comment/:commentId", read);
 


router.post("/comment/create/:userId", requireSignin, isAuth, isAdmin, create);



router.get("/comments", list);


router.param("commentId", commentById);

router.param("userId", userById);





module.exports = router;