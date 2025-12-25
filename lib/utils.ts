import formidable from "formidable";
import { NextApiRequest } from "next";
import Post, { PostModelSchema } from "../models/Post";
import { CommentResponse, PostDetail, UserProfile } from "../utils/types";
import db from "../utils/db";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FormidablePromise<T> {
  files: formidable.Files;
  body: T;
}

export const readFile = <T extends object>(
  req: NextApiRequest
): Promise<FormidablePromise<T>> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files, body: fields as T });
    });
  });
};

/**
 * Lấy tất cả bài viết mà không giới hạn.
 */
export const readAllPostsFromDb = async (): Promise<PostModelSchema[]> => {
  await db.connectDb();
  return await Post.find()
    .sort({ createdAt: "desc" })
    .select("-content");
};

/**
 * Lấy bài viết phân trang với giới hạn tối đa 100 bản ghi.
 */
export const readPostsFromDb = async (
  limit: number,
  pageNo: number,
  skip?: number
): Promise<PostModelSchema[]> => {
  // Áp dụng giới hạn an toàn
  const safeLimit = Math.min(limit, 100);
  const finalSkip = skip !== undefined ? skip : safeLimit * pageNo;
  await db.connectDb();
  return await Post.find()
    .sort({ createdAt: "desc" })
    .select("-content")
    .skip(finalSkip)
    .limit(safeLimit);
};

export const formatPosts = (
  posts: PostModelSchema[]
): PostDetail[] => {
  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    category: post.category,
    createdAt: post.createdAt.toString(),
    thumbnail: post.thumbnail?.url || "",
    meta: post.meta,
    tags: post.tags,
  }));
};

const getLikedByOwner = (likes: any[], user: UserProfile) =>
  likes.includes(user.id);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
