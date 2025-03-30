const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");



//CREATE POST 
// router.post("/", async (req, res) => {
//     const newPost = new Post(req.body);
//     try {
//         const savedPost = await newPost.save();
//         res.status(201).json(savedPost);
//     } catch (error) {
//         console.error("Error saving post:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.post("/", async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);  // Debugging

        if (!req.body.title || !req.body.desc || !req.body.username) {
            return res.status(400).json({ error: "Title, description, and username are required" });
        }

        const newPost = new Post(req.body);
        const savedPost = await newPost.save();

        console.log("Post saved successfully:", savedPost);  // Debugging
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error saving post:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});




// UPDATE POST
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                    }, 
                    { new:true }
                );
                res.status(200).json(updatedPost);
            } 
            catch (error) {
                res.status(500).json(error);
            }
        }
        else{
            res.status(401).json("You can update only your post")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});



router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.username !== req.body.username) {
            return res.status(401).json({ error: "Unauthorized action" });
        }

        await Post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// GET POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});




//GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if(username){
            posts = await Post.find({username});
        }
        else if(catName){
            posts = await Post.find({
                categories:{
                    $in:[catName],
                },
            });
        }
        else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});





module.exports = router 