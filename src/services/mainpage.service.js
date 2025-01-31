const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PostResponseDTO = require("../dtos/mainpage.dto");
const { getUserPosts, countUserPosts } = require("../repositories/mainpage.repository");

// 포스트 목록 조회
const listUserPosts = async (userId, page, limit) => {
    const skip = (page - 1) * limit;
    const totalPosts = await countUserPosts(); 
    const posts = await getUserPosts(skip, limit); 
    
    // 특정 사용자의 포스트 제외
    const filteredPosts = posts.filter(post => post.user.user_id !== userId);
    
    const formattedPosts = filteredPosts.map(post => new PostResponseDTO(post));
    
    return {
        posts: formattedPosts,
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit)
    };
};

// 검색 기능
const searchPosts = async (searchTerm, page, limit) => {
  console.log("Saving search term:", searchTerm); // 로깅 추가
  const skip = (page - 1) * limit;

  return await prisma.post.findMany({
      where: {
          title: {
              contains: searchTerm, // title에 searchTerm이 포함된 포스트 검색
          }
      },
      include: {
          star: {
              select: {
                  region: true
              }
          },
          post_images: {
              select: {
                  file_name: true
              }
          },
          user: {
              select: {
                  nickname: true,
                  u_image: {
                      select: {
                          file_name: true
                      }
                  }
              }
          }
      },
      orderBy: { updated_at: 'desc' },
      skip,
      take: limit
  });
};

// 검색 기록 저장
const recordSearch = async (searchTerm) => {
    const existingSearch = await prisma.search.findFirst({
        where: { word: searchTerm } // word를 기준으로 검색
    });

    if (existingSearch) {
        return await prisma.search.update({
            where: { search_id: existingSearch.search_id }, // search_id로 업데이트
            data: { number: existingSearch.number + 1 }
        });
    } else {
        return await prisma.search.create({
            data: { word: searchTerm, number: 1 }
        });
    }
};

// 검색 순위 조회
const getSearchRankings = async () => {
    return await prisma.search.findMany({
        orderBy: { number: 'desc' }
    });
};

module.exports = {
    listUserPosts,
    searchPosts,
    recordSearch,
    getSearchRankings
};
