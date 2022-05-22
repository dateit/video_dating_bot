import { prisma } from '../helpers/database';

export const createLike = async (likerId: string, likedId: string, dislike = false) => {
  return await prisma.likes.create({ data: { likerId, likedId, dislike } });
};

export const getLiked = async (likerId: string, likedId: string) => {
  return await prisma.likes.findFirst({
    where: {
      likedId,
      likerId,
      dislike: false,
    },
    include: {
      liker: true,
    },
  });
};

export const markLikeAsMutual = async (id: string) => {
  return await prisma.likes.update({
    where: { id },
    data: {
      mutual: true,
    },
  });
};

export const markLikeAsDisliked = async (id: string) => {
  return await prisma.likes.update({
    where: { id },
    data: {
      dislike: true,
    },
  });
};
