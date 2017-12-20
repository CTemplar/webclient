export class Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export class Comment {
  id: number;
  post: number;
  reply: number;
  text: string;
  user: number;
  date: string;
}

export class Post {
  id: number;
  category: Category;
  name: string;
  slug: string;
  text: string;
  excerpt: string;
  excerpt_long: string;
  image: string;
  image_card: string;
  image_featured: string;
  featured: boolean;
  date: string;
  comments_count: number;
}
