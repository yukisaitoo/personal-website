import fs from "fs";
import matter from "gray-matter";
import path from "path";

const rootDirectory = path.join(process.cwd(), "content", "blog");

export type Post = {
  metadata: PostMetadata;
  content: string;
};

export type PostMetadata = {
  title?: string;
  summary?: string;
  image?: string;
  publishedAt?: string;
  slug: string;
};

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(rootDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFileSync(filePath, { encoding: "utf-8" });
    const { data, content } = matter(fileContents);

    return { metadata: { ...data, slug }, content };
  } catch (error) {
    return null;
  }
}

export async function getPosts(limit?: number): Promise<PostMetadata[]> {
  const files = fs.readdirSync(rootDirectory);

  const posts = files
    .map((file) => getPostMetaData(file))
    .sort(
      (a, b) =>
        (new Date(b.publishedAt ?? "").getTime() || 0) -
        (new Date(a.publishedAt ?? "").getTime() || 0),
    );

  if (limit) {
    return posts.slice(0, limit);
  }

  return posts;
}

export function getPostMetaData(filePath: string): PostMetadata {
  const slug = filePath.replace(/\.mdx$/, "");
  const fullFilePath = path.join(rootDirectory, filePath);
  const fileContent = fs.readFileSync(fullFilePath, { encoding: "utf8" });
  const { data } = matter(fileContent);

  return { ...data, slug };
}
