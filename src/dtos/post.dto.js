export const bodyToPost = (body) => {
    return {
        title: body.title,
        location: body.location,
        music: body.music || "",
        content: body.content,
        photos: body.photos,
        feeling: body.feeling
    };
};

export const responseFromPost = (post) => {
    return {
        id: post.id,
        title: post.title,
        location: post.location,
        music: post.music || "",
        content: post.content,
        photos: post.photos,
        feeling: post.feeling,
        createdAt: post.createdAt,
    };
};