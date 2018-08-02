import { Component, OnInit } from '@angular/core';
import { Post, Category } from '../../../store/models';

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.scss']
})
export class BlogGridComponent implements OnInit {

  posts: Post[] = [
    {
     id: 1,
     category: 0,
     comments_count: 7,
     date: 'June 21, 2018',
     name: 'Why It’s Time to Re-Evaluate Your Email Security Solution',
     slug: 'why-its-time-to-re-evaluate-your-email-security-solution',
     image_card: 'assets/images/blog/blog-img-1.jpg',
     image_featured: 'assets/images/blog/blog-img-1.jpg',
     image: 'assets/images/blog/blog-img-1.jpg',
     text: '',
     excerpt: `We have some great news to share. Several months ago, we were asked to come to TED Global to give a talk about privacy – 
     and today the video is finally getting published! It was a great opportunity for us to talk about why privacy matters and showcase 
     the end-to-end encryption technology we use in CTemplar to protect your data.`
    },
    {
      id: 2,
      category: 1,
      comments_count: 14,
      date: 'August 1, 2018',
      name: 'What Yahoo\'s NSA Surveillance Means for Email Privacy?',
      slug: 'what-yahoos-nsa-surveillance-means-for-email-privacy',
      image_card: 'assets/images/blog/blog-img-2.jpg',
      image_featured: 'assets/images/blog/blog-img-2.jpg',
      image: 'assets/images/blog/blog-img-2.jpg',
      text: '',
      excerpt: `This week, it was revealed that as a result of a secret US government directive, Yahoo was forced to implement special 
      surveillance software to scan all Yahoo Mail accounts at the request of the NSA and FBI. Sometime in early 2015, Yahoo secretly 
      modified their spam and malware filters to scan all incoming email messages.`
     },
     {
      id: 3,
      category: 0,
      comments_count: 2,
      date: 'July 20, 2018',
      name: 'We have launched support for custom domains and paid accounts!',
      slug: 'we-have-launched-support-for-custom-domains-and-paid-accounts',
      image_card: 'assets/images/blog/blog-img-3.jpg',
      image_featured: 'assets/images/blog/blog-img-3.jpg',
      image: 'assets/images/blog/blog-img-3.jpg',
      text: '',
      excerpt: `For the first time, you can now use your own domain name with CTemplar. This means emails sent to/from name@domain.com can 
      go through CTemplar and benefit from end-to-end encryption. For those who wish to support CTemplar, and gain access to extra features 
      and storage, it is now possible to upgrade to a paid account!`
     }
  ];

  categories: Category[] = [{
    id: 1,
    name: 'NEWS',
    color: '#ffcc00'
    },{
    id: 2,
    name: 'ARTICLE',
    color: '#ffcc00'
  }];

  constructor() { }

  ngOnInit() {
  }

}
