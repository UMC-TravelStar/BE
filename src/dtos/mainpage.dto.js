class PostResponseDTO {
  constructor(post, isFriend) {
    this.post_id = post.post_id;
    this.user_id = post.user.user_id; // 작성자 ID
    this.title = post.title;
    this.content = post.content;
    this.music = post.music;
    this.created_at = post.created_at;
    this.star = {
      id: post.star?.star_id || null,
      region: post.star?.region || null,
    };
    // post_images가 배열이면 imageUrl들을 반환
    this.images = Array.isArray(post.post_images)
      ? post.post_images
          .map(image => image.imageUrl)
          .filter(url => url !== null)
      : [];
    this.user = {
      nickname: post.user.nickname,
      profileImage: post.user.u_image
        ? // u_image가 배열이나 객체일 수 있으므로 조건 처리 (예: 배열의 첫 요소)
          Array.isArray(post.user.u_image)
            ? post.user.u_image[0]?.file_name || null
            : post.user.u_image.file_name
        : null,
    };
    this.isFriend = isFriend;
  }
}

module.exports = PostResponseDTO;
