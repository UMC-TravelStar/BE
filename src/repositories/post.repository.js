export const addPost = async (data) => {
    const existingPost = await prismapost.findFirst({ 
        where: { 
            title: data.title, 
            author_id: data.author_id 
        } 
    });

    if (existingPost) {
        throw new Error("Duplicate post title for this author.");
    }

    const createdPost = await prisma.post.create({
        data: {
            title: data.title,       
            region: data.region,
            detail_reg: data.detail_reg,
            music: data.music || "", 
            content: data.content,   
            photos: data.photos,    
            feeling: data.feeling,  
        },
    });

    return createdPost.post_id;
};