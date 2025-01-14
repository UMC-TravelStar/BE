import { addPost } from "../repositories/post.repository.js";
import { responseFromPost } from "../dtos/post.dto.js";

export const createPost = async (data) => {

    const postId = await addPost({
        title: data.title,
        region: data.region,
        detail_reg: data.detail_reg,
        music: data.music || "",
        content: data.content,
        photos: data.photos,
        feeling: data.feeling
    });
    
    if (!postId) {
        throw new Error("Failed to create post. A post with the same title might already exist.");
    }
    
    return responseFromPost({ id: postId, ...data }); 
};