// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

// Models
import { Post, Category, Mode } from '../../store/models';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Services
import { SpinnerService } from '../../shared/spinner/services/spinner.service';

// Store
import { Store } from '@ngrx/store';
import { getNewBlogs, getCategories } from '../../store/selectors';
import { GetPosts, GetCategories } from '../../store/actions';
import { FinalLoading } from '../../store/actions';
// Models
import { NumberOfColumns } from '../../store/models';


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  firstPost: Post = {
    id: 1,
    category: 1,
    comments_count: 10,
    date: 'August 08, 2018',
    name: 'Why Everyone Needs CTemplar?',
    slug: 'why-everyone-needs-ctemplar',
    image_card: 'assets/images/blog/why-everyone-needs-ctemplar.jpg',
    image_featured: 'assets/images/blog/why-everyone-needs-ctemplar.jpg',
    image: 'assets/images/blog/why-everyone-needs-ctemplar.jpg',
    text: `Picking a secure email system is not just checking for that little padlock to see that your webpages are encrypted when using
    webmail.  When you are searching around for the most secure email system, whether for business or personal purposes, you will find a
    range of options available. When evaluating each product, you will need to pour over the security features, software setup, privacy
    policy, terms and conditions of use, and company background with a fine-tooth comb.`,
    excerpt: ``
  };
  postPosition: number = 0;
  positionCount: number = 7;
  isPostsLoading: boolean = false;

  getBlogState$: Observable<any>;
  getCategories$: Observable<any>;
  categories: Category[];
  mode: Mode;
  numberOfColumns: NumberOfColumns;

  constructor(
    private store: Store<any>,
    private spinnerService: SpinnerService
  ) {
    // this.store.dispatch(new FinalLoading({ loadingState: true }));

    this.getBlogState$ = this.store.select(getNewBlogs);
    this.getCategories$ = this.store.select(getCategories);
    this.getCategories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit() {
    this.mode = Mode.Recent;
    this.numberOfColumns = NumberOfColumns.Three;

    this.getCategories();
    this.getBlogState$.subscribe(blogs => {
      if (blogs.length) {
        this.sortPosts(blogs);
      } else {
        this.getPosts();
      }
    });
  }

  getPosts() {
    this.isPostsLoading = true;
    this.store.dispatch(
      new GetPosts({ limit: this.positionCount, offset: this.postPosition })
    );
  }

  getCategories() {
    this.isPostsLoading = true;
    this.store.dispatch(new GetCategories({}));
  }

  sortPosts(newPosts) {
    this.isPostsLoading = false;
    newPosts.map((post: Post) => {
      post.isLoaded = false;
      if (post.text.length > 500) {
        post.excerpt = post.text.substring(0, 500) + '...';
      } else {
        post.excerpt = post.text;
      }
    });
    if (!this.postPosition) {
      // this.firstPost = newPosts[0];
      this.posts = newPosts.slice(1);
      this.setParamsOfPosts(newPosts.length, -1);
    } else {
      this.posts = this.posts.concat(newPosts);
      this.setParamsOfPosts(newPosts.length, 0);
    }
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  setParamsOfPosts(length, isFirst) {
    this.postPosition += length;
    if (length - isFirst < 6) {
      this.positionCount = 12 - length + isFirst;
    } else {
      this.positionCount = 6;
    }
  }

  ngOnDestroy() {
   // this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
