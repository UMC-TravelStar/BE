import { createPost } from "../services/post.service.js";
import { bodyToPost } from "../dtos/post.dto.js";

export const handleAddPost = async (req, res, next) => {
    console.log("request to add post");
    console.log("body:", req.body);

    const postData = bodyToPost(req.body);
    const post = await createPost(postData);
    res.status(StatusCodes.CREATED).json({ result: post });
}
