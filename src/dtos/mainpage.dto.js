class PostResponseDTO {
  constructor(post) {
      this.post_id = post.post_id; 
      this.user_id = post.user.user_id; 
      this.title = post.title; 
      this.updated_at = post.updated_at; 
      this.region = post.star.region; 
      this.images = post.post_images.map(image => image.file_name); 
      this.user = {
          nickname: post.user.nickname, 
          profileImage: post.user.u_image ? post.user.u_image.file_name : null 
      };
  }
}

module.exports = PostResponseDTO;
