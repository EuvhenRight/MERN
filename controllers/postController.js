import PostModel from '../module/post.js'

export const getLastTags = async (req, res) => {
    try {
        const post = await PostModel.find().limit(5).exec(); // TODO it is string need read

        const tags = post.map((obj)=>obj.tags).flat().slice(0,5);

        res.json(tags);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Tags is failed"
        })
    }
}


export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec(); // TODO it is string need read

        res.json(posts);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "All post failed"
        })
    }
}

export const getOne = async (req, res) => { //TODO need read this strict
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: "after",
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Post not returned",
                    });
                }
                if (!doc) {
                    res.status(404).json({
                        message: "Post not found",
                    });
                }
                res.json(doc)
            },
        ).populate('user');

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: " Post failed"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({ // TODO need read about await
                _id: postId,
            }, {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                user: req.userId,
                imageUrl: req.body.imageUrl,
            },
            res.json({
                success: true,
            })
        )

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to update post",
        });
    }
}

export const remove = async (req, res) => { // TODO need read stick
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Failed to delete post",
                    });
                }
                if (!doc) {
                    res.status(404).json({
                        message: "Post not found",
                    })
                }
                res.json({
                    success: true,
                });
            },
        )
    } catch (err) {

    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            user: req.userId,
            imageUrl: req.body.imageUrl,
        })

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "create post failed"
        })
    }
}
