class PostResponseDTO {
  constructor(post, isFriend) {
      this.post_id = post.post_id;
      this.user_id = post.user.user_id;  // 작성자 유저 아이디
      this.title = post.title;
      this.updated_at = post.updated_at;
      this.region = post.star.region;
      this.images = post.post_images.map(image => image.imageUrl); 
      this.user = {
          nickname: post.user.nickname,
          profileImage: post.user.u_image ? post.user.u_image.file_name : null
      };
      this.isFriend = isFriend;
  }
}

module.exports = PostResponseDTO;
