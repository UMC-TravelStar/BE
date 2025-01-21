const bodyToPost = (body) => {
    return {
        title: body.title,
        location: body.location,
        music: body.music || "",
        content: body.content,
        photos: body.photos,
        feeling: body.feeling,
        author_id: body.author_id // 작성자 ID를 추가로 받도록 수정
    };
};

const responseFromPost = (post) => {
    return {
        id: post.id,
        title: post.title,
        location: post.location,
        music: post.music || "",
        content: post.content,
        photos: post.photos,
        feeling: post.feeling,
        createdAt: post.createdAt
    };
};

module.exports = {
    bodyToPost,
    responseFromPost
};