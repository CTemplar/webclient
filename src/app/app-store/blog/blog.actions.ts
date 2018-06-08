///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class GetPost {
  static readonly type = "[Blog] GetPost";
  constructor(public slug: string) {}
}

export class GetPosts {
  static readonly type = "[Blog] GetPosts";
}

export class GetRelatedPosts {
  static readonly type = "[Blog] GetRelatedPosts";
  constructor(public category: string) {}
}

export class PostComment {
  static readonly type = "[Blog] PostComment";
}
