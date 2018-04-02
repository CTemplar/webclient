export class Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export class Comment {
  id: number;
  post: number;
  user: number;
  reply_to: number;
  text: string;
  date: string;
}

export class Post {
  id: number;
  category: Category;
  name: string;
  slug: string;
  featured: boolean;
  text: string;
  date: string;
  comments_count: number;
  excerpt: string;
  excerpt_long: string;
  image: string;
  image_card: string;
  image_featured: string;
}
