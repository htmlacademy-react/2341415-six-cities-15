import { Comment } from '../types';

export const comments: Comment[] = [
  {
    id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
    date: new Date('2019-05-08T14:13:56.569Z'),
    user: {
      name: 'Oliver Conner',
      avatarUrl: 'https://15.design.htmlacademy.pro/static/avatar/1.jpg',
      isPro: false,
    },
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
    rating: 4
  },
  {
    id: 'a4a64551-b89f-4dcb-a7ac-10b343bc94a7',
    date: new Date('2019-05-08T14:13:56.569Z'),
    user: {
      name: 'Isaac',
      avatarUrl: 'https://15.design.htmlacademy.pro/static/avatar/2.jpg',
      isPro: false,
    },
    comment: 'Beautiful space, fantastic location and atmosphere, really a wonderful place to spend a few days. Will be back.',
    rating: 1
  },
  {
    id: '02d57096-a33c-4fc2-8d0b-b974b608c2d7',
    date: new Date('2019-05-08T14:13:56.569Z'),
    user: {
      name: 'Zak',
      avatarUrl: 'https://15.design.htmlacademy.pro/static/avatar/2.jpg',
      isPro: true,
    },
    comment: 'Home is amazing. I\'s like staying in a museum. The rooms, furnishings and artworks are incredible. The views of My Vesuvius',
    rating: 2
  },

];
