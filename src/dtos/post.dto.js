class UserPostResponseDTO {
    constructor(post, star) {
        this.region = star.region;
        this.title = post.title;
        this.content = post.content;
        this.music = post.music;
        this.feeling = post.feeling;
        this.storage = post.storage;
        this.created_at = post.created_at;
        this.updated_at = post.updated_at;
    }
}

class PostResponseDTO {
    constructor(post) {
        this.title = post.title;
        this.content = post.content;
        this.music = post.music;
        this.created_at = post.created_at;
        this.star = {
            id: post.star.star_id,
            region: post.star.region
        };
    }
}

const formatPostResponse = (post) => {
    if (!post) {
        console.error('Received undefined or null post:', post); // post가 undefined나 null일 때 로그 출력
        return {}; // 빈 객체를 반환하거나 에러를 처리
    }

    return {
        id: post.post_id,
        title: post.title,
        createdAt: post.created_at,
        star: {
            id: post.star.star_id,  // star_id 추가
            region: post.star.region // star 테이블의 region 값 추가
        }
    };
};

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
    formatPostResponse,
    UserPostResponseDTO,
    EditPostDto,
    PostResponseDTO,
};