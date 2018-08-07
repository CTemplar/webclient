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
    },
    {
      id: 2,
      category: 1,
      comments_count: 8,
      date: 'August 08, 2018',
      name: 'CTemplar\'s 4 Wall Protection',
      slug: 'ctemplar-4-wall-protection',
      image_card: 'assets/images/blog/ctemplar-4-wall-protection.jpg',
      image_featured: 'assets/images/blog/ctemplar-4-wall-protection.jpg',
      image: 'assets/images/blog/ctemplar-4-wall-protection.jpg',
      text: `protection was created by the CTemplar team after seeing other email services knowingly offer vulnerable services under
      the illusion of complete security.   For example, they may provide good encryption, but they have access to your username
      and password and can legally be required to turn them over without your knowledge or consent.  The 4 walls of protection
      include "Company Protection, Encryption Protection, Legal Protection, and Technology Protection."`,
      excerpt: ``
    },
    {
      id: 3,
      category: 1,
      comments_count: 14,
      date: 'August 08, 2018',
      name: 'CTemplar vs Protonmail',
      slug: 'ctemplar-vs-protonmail',
      image_card: 'assets/images/blog/ctemplar-vs-proton-mail.jpg',
      image_featured: 'assets/images/blog/ctemplar-vs-proton-mail.jpg',
      image: 'assets/images/blog/ctemplar-vs-proton-mail.jpg',
      text: `Ctemplar is the unparalleled best email service in the world for these reasons below.  We lead the industry by providing
      maximum protection for our users.  People desiring the highest level of protection should not buy discount services that may
      give the illusion of security.  Your privacy is your fortress, you want the walls to be thick and impenetrable to even the
      strongest attacks.`,
      excerpt: ``
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
