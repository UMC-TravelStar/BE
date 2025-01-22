const bodyToPost = (body) => {
    return {
        title: body.title,
        music: body.music || "",
        content: body.content,
        photos: body.photos,
        feeling: body.feeling,
        author_id: body.author_id, // 작성자 ID를 추가로 받도록 수정
        region: body.region || "default_region",  // region도 추가
        feel_color: body.feel_color
    };
};

const responseFromPost = (post) => {
    return {
        id: post.id,
        title: post.title,
        music: post.music || "",
        content: post.content,
        photos: post.photos,
        feeling: post.feeling,
        createdAt: post.createdAt
    };
};

class UserPostResponseDTO {
    constructor(post) {
      this.post_id = post.id;
      this.title = post.title;
      this.music = post.music;
      this.content = post.content;
      this.photos = post.photos || [];
      this.createdAt = post.createdAt;
      this.updatedAt = post.updatedAt;
    }
}

module.exports = {
    bodyToPost,
    responseFromPost,
    UserPostResponseDTO
};