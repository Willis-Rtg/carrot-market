"use server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { commentSchema } from "./schema";

export const getPostCache = (id: number) => {
  const operation = nextCache(getPost, ["post"], {
    tags: [`post-${id}`, `post`],
    revalidate: 60,
  });
  return operation(id);
};
export async function getPost(id: number) {
  try {
    return await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
        comments: {
          select: {
            id: true,
            user: {
              select: {
                avatar: true,
                username: true,
              },
            },
            payload: true,
            created_at: true,
            comments: {
              select: {
                user: true,
                payload: true,
                created_at: true,
              },
              orderBy: {
                created_at: "desc",
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return null;
  }
}

// export const updatePostViewsCache = (postId: number) => {
//   const operation = nextCache(updatePostViews, [`post-views`], {
//     tags: [`post-views-${postId}`, "post-views"],
//   });
//   return operation(postId);
// };

// export async function updatePostViews(postId: number) {
//   await db.post.update({
//     where: {
//       id: postId,
//     },
//     data: {
//       views: {
//         increment: 1,
//       },
//     },
//   });
// }

export async function getLikeStatusCache(postId: number) {
  const session = await getSession();

  const cachedOperation = nextCache(getLikeStatus, ["is-liked"], {
    tags: [`like-status-${postId}`],
    revalidate: 60,
  });

  return cachedOperation(postId, session.id!);
}
export async function getLikeStatus(postId: number, userId: number) {
  try {
    const isLiked = await db.like.findUnique({
      where: {
        id: {
          userId,
          postId,
        },
      },
    });
    const likeCount = await db.like.count({
      where: {
        postId,
      },
    });
    return { isLiked: Boolean(isLiked), likeCount };
  } catch (e) {
    console.log(e);
  }
}

export async function likePost(postId: number) {
  const session = await getSession();
  // const postId = +formData.get("postId")!;
  try {
    const like = await db.like.create({
      data: {
        postId,
        // userId: +formData.get("userId")!,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function disLikePost(postId: number) {
  const session = await getSession();
  // const postId = +formData.get("postId")!;

  try {
    await db.like.delete({
      where: {
        id: {
          // userId: +formData.get("userId")!,
          userId: session.id!,
          postId,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function addComment(formData: FormData) {
  console.log(formData);
  const data = {
    payload: formData.get("payload"),
  };
  const postId = formData.get("postId");

  const validData = await commentSchema.safeParse(data);

  const session = await getSession();

  if (session.id && postId) {
    const comment = await db.comment.create({
      data: {
        payload: validData.data?.payload!,
        userId: session.id,
        postId: +postId,
      },
    });
    if (!!comment) {
      revalidateTag(`post-${postId}`);
    }
  }
}

export async function addOfComment(formData: FormData) {
  const data = {
    payload: formData.get("ofComment"),
  };
  const postId = +formData.get("postId")!;
  const commentId = +formData.get("commentId")!;

  const validData = await commentSchema.safeParse(data);

  const session = await getSession();

  console.log(formData);

  if (session.id && commentId) {
    const comment = await db.comment.create({
      data: {
        userId: session.id,
        commentId,
        payload: validData.data?.payload!,
      },
    });
    if (!!comment) {
      revalidateTag(`post-${postId}`);
    }
  }
}
