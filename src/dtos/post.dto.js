class UserPostResponseDTO {
    constructor(post, star) {
        this.region = star.region;
        this.title = post.title;
        this.content = post.content;
        this.music = post.music;
        this.feeling = post.feeling;
        this.feel_color = post.feel_color;
        this.storage = post.storage;
        this.images = post.post_images ? post.post_images.map(image => image.imageUrl).filter(url => url !== null) : [];
        this.created_at = post.created_at;
        this.updated_at = post.updated_at;
    }
}

class PostResponseDTO {
    constructor(post) {
        this.post_id = post.post_id;
        this.title = post.title;
        this.content = post.content;
        this.music = post.music;
        this.created_at = post.created_at;
        this.star_id = post.star?.star_id;
        this.region = post.star?.region;
        this.images = post.post_images ? post.post_images.map(image => image.imageUrl).filter(url => url !== null) : [];
        this.user_id = post.user?.user_id || null;
        this.nickname = post.user?.nickname || null;
        this.user_image = post.user?.u_image?.length > 0 ? post.user.u_image[0].file_name : null;
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
        feel_color: post.feel_color,
        createdAt: post.created_at,
        star: {
            id: post.star.star_id,  // star_id 추가
            region: post.star.region // star 테이블의 region 값 추가
        },
        images: post.post_images.map(image => image.imageUrl)
    };
};

class EditPostDto {
    constructor({ title, region, music, content, feeling, feel_color }) {
        this.title = title;
        this.region = region;
        this.music = music || "";
        this.content = content;
        this.feeling = feeling;
        this.feel_color = feel_color;
    }
}

module.exports = {
    formatPostResponse,
    UserPostResponseDTO,
    EditPostDto,
    PostResponseDTO,
};