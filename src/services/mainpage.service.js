const PostResponseDTO = require("../dtos/mainpage.dto");
const { getUserPosts, countUserPosts } = require("../repositories/mainpage.repository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 친구 관계 확인 함수 (두 유저가 친구이면 true)
const checkFriendship = async (currentUserId, userId) => {
    const friendship = await prisma.friend.findFirst({
        where: {
            are_we_friend: true,
            OR: [
                { from_user_id: currentUserId, to_user_id: userId },
                { from_user_id: userId, to_user_id: currentUserId },
            ],
        },
    });
    return !!friendship;
};

// 포스트 목록 조회 
const listUserPosts = async (currentUserId, page, limit) => {
    const skip = (page - 1) * limit;
    const totalPosts = await countUserPosts();

    // 현재 사용자가 작성한 포스트를 제외한 게시물 조회
    const posts = await getUserPosts(skip, limit);
    const filteredPosts = posts.filter(post => post.user.user_id !== currentUserId);

    // 각 포스트에 대해 친구 여부를 체크하고 DTO 변환
    const formattedPosts = await Promise.all(
        filteredPosts.map(async post => {
            const isFriend = await checkFriendship(currentUserId, post.user.user_id);
            return new PostResponseDTO(post, isFriend);
        })
    );

    return {
        posts: formattedPosts,
        totalPosts: filteredPosts.length, // 필터링된 게시물 수
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
    };
};


// 검색 기능 – 제목에 searchTerm이 포함된 게시글 조회 (이미지 포함)
const searchPosts = async (searchTerm, page, limit, currentUserId) => {
    const skip = (page - 1) * limit;
    const results = await prisma.post.findMany({
        where: {
            title: { contains: searchTerm },
            user: {
                user_id: { not: currentUserId }
            }
        },
        include: {
            star: { select: { star_id: true, region: true } },
            post_images: { select: { imageUrl: true } },
            user: {
                select: {
                    user_id: true,
                    nickname: true,
                    u_image: { select: { file_name: true } },
                },
            },
        },
        orderBy: { updated_at: 'desc' },
        skip,
        take: limit,
    });

    const formattedResults = await Promise.all(
        results.map(async post => {
            const isFriend = await checkFriendship(currentUserId, post.user.user_id);
            return new PostResponseDTO(post, isFriend);
        })
    );

    return formattedResults;
};

// 검색 기록 저장
const recordSearch = async (searchTerm) => {
    const existingSearch = await prisma.search.findFirst({
        where: { word: searchTerm },
    });
    if (existingSearch) {
        return await prisma.search.update({
            where: { search_id: existingSearch.search_id },
            data: { number: existingSearch.number + 1 },
        });
    } else {
        return await prisma.search.create({
            data: { word: searchTerm, number: 1 },
        });
    }
};

// 검색 순위 조회
const getSearchRankings = async () => {
    return await prisma.search.findMany({
        orderBy: { number: 'desc' },
    });
};

module.exports = {
    listUserPosts,
    searchPosts,
    recordSearch,
    getSearchRankings,
};
