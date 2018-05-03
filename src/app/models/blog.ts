export class Category {
  id: number;
  name: string;
  color: string; 
}

export class Comment {
  id: number;
  post: number;
  reply_to?: number;
  text: string;
  datetime?: string;
  author?: string;
  replies?: Comment[];
}

export class Post {
  id: number;
  category: Category;
  name: string;
  slug: string;
  text: string;
  date: string;
  comments_count: number;
  image: string;
  image_card: string;
  image_featured: string;
  comments?: Comment[];
  excerpt?: string;
  isloaded?: boolean;
}

export enum NumberOfColumns {
  Two = 2, 
  Three = 3
}

export enum Mode {
  Recent,
  Related
}

