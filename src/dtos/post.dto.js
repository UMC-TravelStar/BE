class UserPostResponseDTO {
    constructor(post, star) {
        this.region = star.region;
        this.title = post.title;
        this.content = post.content;
        this.music = post.music;
        this.feeling = post.feeling;
        this.storage = post.storage;
    }
}

class EditPostDto {
    constructor({ title, region, music, content, photos, feeling }) {
        this.title = title;
        this.region = region;
        this.music = music || "";
        this.content = content;
        this.photos = Array.isArray(photos) ? photos : [];
        this.feeling = feeling;
    }
}

module.exports = {
    UserPostResponseDTO,
    EditPostDto
};