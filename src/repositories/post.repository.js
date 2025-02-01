const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const findStarByRegion = async (region) => {
    const existingStar = await prisma.star.findFirst({
        where: {
            region: region,
        },
    });

    console.log(existingStar)
    return existingStar;
};

const findStarsByUserId = async (userId) => {
    const stars = await prisma.stars.findFirst({
        where: {
            user_id: userId, // userId 조건 설정
        },
    });

    return stars; 
};

const createStar = async (region) => {
    try {
        const star = await prisma.star.create({
            data: {
                region: region,
            }});
        return star; // star 객체를 반환
    } catch (error) {
        throw new Error(error); // 오류 발생 시 처리
    }
};



const savePost = async (userId, starId, postData) => {
    if (!starId) {
        throw new Error('Star ID is required');
    }

    return await prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            music: postData.music,
            feeling: postData.feeling,
            storage: postData.storage,
            user: {
                connect: { user_id: userId },  // user와 연결 (user_id를 통해)
            },
            star: {
                connect: { star_id: starId },  // star와 연결
            },
        },
    });
};

const getAllUserPosts = async (skip, userId) => {
    const posts = await prisma.post.findMany({
        select: {
            post_id: true,
            title: true,
            created_at: true,
            star: {
                select: {
                    star_id: true,
                    region: true, // star 테이블의 region 컬럼 추가
                }
            }
        },
        where: {
            user_id: userId,
        },
        orderBy: { post_id: "desc" },
        skip, // 앞에서 skip 개수만큼 건너뛰기
        take: 10, // 가져올 개수
    });

    console.log(posts); // 반환된 posts 확인
    return posts;
};

const getFrPost = async (skip, userId) => {
    return prisma.post.findMany({
        select: {
            post_id: true,
            title: true,
            created_at: true,
            star: {
                select: {
                    star_id: true,
                    region: true,
                }
            }
        },
        where: {
            user_id: userId,
            storage: { in: [0, 1] }
        },
        orderBy: {
            post_id: "desc"
        },
        skip,
        take: 10,
    });
};

const getFrPost2 = async (userId, postsId) => {
    return prisma.post.findUnique({
        where: {
            user_id: userId,
            post_id: postsId,
            storage: { in: [0, 1] }
        }
    })
};

const getPostList2 = async (userId, postsId) => {
    return prisma.post.findUnique({
        where: {
            user_id: userId,
            post_id: postsId,
            storage: 0
        }
    })
};

const getPostList = async (skip, userId) => {
    return prisma.post.findMany({
        select: {
            post_id: true,
            title: true,
            created_at: true,
            star: {
                select: {
                    star_id: true,
                    region: true,
                }
            }
        },
        where: {
            user_id: userId,
            storage: 0,
        },
        orderBy: {
            post_id: "desc"
        },
        skip,
        take: 10,
    });
};

const getPostById = async (userId, postsId) => {
    await prisma.post.update({
        where: {
            user_id: userId,
            post_id: parseInt(postsId),
        },
        data: {
          views: {
            increment: 1
          }
        }
    });

    return prisma.post.findUnique({
        where: { 
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const getStarById = async (starId) => {
    return prisma.star.findUnique({
        where: {
            star_id: parseInt(starId)
        },
    });
};

const checkFriendship = async (userId, viewerId) => {
    console.log(typeof userId, userId); 
    console.log(typeof viewerId, viewerId);
    return prisma.Friend.findFirst({
        where: {
            are_we_friend: true,
            AND: [
                { from_user_id: userId, to_user_id: viewerId },
                { from_user_id: viewerId, to_user_id: userId }
            ],
        },
    });
};

const updatePost = async (post, editData) => {
    const star_id = post.star_id;

    const existingStar = await prisma.star.findUnique({
        where: { star_id: star_id },
        select: { region: true }, // region 칼럼만 가져오기
    });

    if (!existingStar) {
        throw new Error('Star 데이터가 존재하지 않습니다.');
    }

    const newRegion = editData.region;
    const oldRegion = existingStar.region;

    if (oldRegion !== newRegion) {
        console.log(`Region 변경됨: ${oldRegion} -> ${newRegion}`);

        // 같은 region을 가진 star가 이미 있는지 확인
        const existingNewStar = await prisma.star.findFirst({
            where: { region: newRegion },
        });
        console.log('existingNewStar:', existingNewStar);
        
        // 해당 star_id의 post 개수 확인
        const postCount = await prisma.post.count({
            where: { star_id: star_id },
        });

        console.log(`해당 star_id의 post 개수: ${postCount}`);

        let targetStarId;

        if (!existingNewStar) {
            // 같은 region을 가진 star가 없으면 새로 생성
            const newStar = await prisma.star.create({
                data: { region: newRegion },
            });
            targetStarId = newStar.star_id;
            console.log('새로운 star 생성:', targetStarId);
        } else {
            // 같은 region을 가진 star가 이미 있으면 해당 star_id 사용
            targetStarId = existingNewStar.star_id;
            console.log('기존 star_id 사용:', targetStarId);
        }

        // 현재 post의 star_id를 새로운 star_id로 변경
        await prisma.post.update({
            where: { post_id: post.post_id },
            data: { star_id: targetStarId },
        });

        console.log('해당 post의 star_id 변경 완료.');

        if (postCount === 1) {
            await prisma.star.delete({
                where: { star_id: star_id },
            })
        }
    } else {
        console.log('Region 변경되지 않음.');
    }

    const { region, photos, ...postData } = editData;

    return await prisma.post.update({
        where: { post_id: post.post_id },
        data: postData,
    });
}

const getPostById2 = async (userId, postsId) => {
    return prisma.post.findUnique({
        where: { 
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const getRelatedPostsByStarId = async (starId) => {
    return await prisma.post.findMany({
        where: { 
            star_id: parseInt(starId)
        },
    });
};

const deletePost = async (userId, postsId) => {
    return await prisma.post.delete({
        where: {
            user_id: userId,
            post_id: parseInt(postsId),
        },
    });
};

const deleteStar = async (starId) => {
    return await prisma.star.delete({
        where: {
            star_id: parseInt(starId)
        },
    });
};

const createComment = async (userId, commentData) => {
    return prisma.user.update({
        where: {
            user_id: userId,
        },
        data: {
            comment: commentData.comment,
        }
    });
};

module.exports = {
    findStarByRegion,
    findStarsByUserId,
    createStar,
    savePost,
    getPostById,
    getFrPost,
    getFrPost2,
    getPostList,
    getPostList2,
    checkFriendship,
    getStarById,
    updatePost,
    getPostById2,
    getRelatedPostsByStarId,
    deletePost,
    deleteStar,
    getAllUserPosts,
    createComment,
};