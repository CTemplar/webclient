///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class Comment {
  id: number;
  author: string;
  datetime: string;
  post: number;
  replies?: Comment[];
  reply_to?: number;
  text: string;
}

export class Post {
  id: number;
  category: string;
  comments_count: number;
  comments?: Comment[];
  date: string;
  image_card?: string;
  image_featured?: string;
  image?: string;
  name: string;
  slug: string;
  text: string;
}
