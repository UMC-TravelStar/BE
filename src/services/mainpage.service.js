const PostResponseDTO = require("../dtos/mainpage.dto");
const { PrismaClient } = require("@prisma/client");
const { getUserPosts, countUserPosts } = require("../repositories/mainpage.repository");
const prisma = new PrismaClient();

// 친구 관계 확인 함수
const checkFriendship = async (currentUserId, userId) => {
    const friendship = await prisma.friend.findFirst({
        where: {
            are_we_friend: true,
            OR: [
                {
                    from_user_id: currentUserId,
                    to_user_id: userId
                },
                {
                    from_user_id: userId,
                    to_user_id: currentUserId
                }
            ]
        }
    });
    return !!friendship; // 친구 관계가 있으면 true, 없으면 false
};

// 포스트 목록 조회
const listUserPosts = async (currentUserId, page, limit) => {
    const skip = (page - 1) * limit;
    const totalPosts = await countUserPosts();
    const posts = await getUserPosts(skip, limit);

    const formattedPosts = await Promise.all(posts.map(async post => {
        const isFriend = await checkFriendship(currentUserId, post.user_id); 
        return new PostResponseDTO(post, isFriend); 
    }));

    return {
        posts: formattedPosts,
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit)
    };
};

// 검색 기능
const searchPosts = async (searchTerm, page, limit, currentUserId) => {
    const skip = (page - 1) * limit;
    const results = await prisma.post.findMany({
        where: {
            title: {
                contains: searchTerm,
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

    const formattedResults = await Promise.all(results.map(async post => {
        const isFriend = await checkFriendship(currentUserId, post.user_id);
        return new PostResponseDTO(post, isFriend); 
    }));

    return formattedResults;
};

// 검색 기록 저장
const recordSearch = async (searchTerm) => {
  const existingSearch = await prisma.search.findFirst({
      where: { word: searchTerm }
  });

  if (existingSearch) {
      return await prisma.search.update({
          where: { search_id: existingSearch.search_id },
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
    getSearchRankings,
    checkFriendship 
};