import { addPost } from "../repositories/post.repository.js";
import { responseFromPost } from "../dtos/post.dto.js";

export const createPost = async (data) => {

    const postId = await addPost({
        title: data.title,
        location: data.location,
        music: data.music || "",
        content: data.content,
        photos: data.photos,
        feeling: data.feeling
    });
  
    return responseFromPost({ id: postId, ...data }); 
};