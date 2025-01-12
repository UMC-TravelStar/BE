export const addPost = async (data) => {
    const existingPost = await prismapost.findFirst({ where: { title: data.title } });
    if (existingPost) {
        return null;
    }

    const createdPost = await prisma.post.create({
        data: {
            title: data.title,       
            location: data.location,
            music: data.music || "", 
            content: data.content,   
            photos: data.photos,    
            feeling: data.feeling,  
        },
    });

    return createdPost.id;
};