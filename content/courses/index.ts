import { Course } from './types';

export const courses: Record<string, Course> = {
  'crypto-fundamentals': {
    title: 'Cryptocurrency Fundamentals',
    description:
      'Learn the basics of cryptocurrency, blockchain technology, and digital assets in this comprehensive course.',
    instructor: 'Dr. Sarah Chen',
    thumbnail: 'https://img.youtube.com/vi/VYWc9dFqROI/maxresdefault.jpg',
    lectures: [
      {
        title: 'Introduction to Cryptocurrency',
        videoId: 'VYWc9dFqROI',
        description: 'Understanding what cryptocurrency is and how it works',
      },
      {
        title: 'Blockchain Technology Basics',
        videoId: 'yubzJw0uiE4',
        description: 'Exploring the fundamentals of blockchain technology',
      },
      {
        title: 'Bitcoin Deep Dive',
        videoId: '8si1gB8siTA',
        description:
          'Understanding Bitcoin and its role in the crypto ecosystem',
      },
    ],
  },
  'trading-strategies': {
    title: 'Advanced Trading Strategies',
    description:
      'Master the art of cryptocurrency trading with proven strategies and techniques.',
    instructor: 'Michael Rodriguez',
    thumbnail: 'https://img.youtube.com/vi/4qD4Z4j4qD4/maxresdefault.jpg',
    lectures: [
      {
        title: 'Technical Analysis Fundamentals',
        videoId: '4qD4Z4j4qD4',
        description: 'Learn the basics of technical analysis in crypto trading',
      },
      {
        title: 'Risk Management',
        videoId: '5qD5Z5j5qD5',
        description:
          'Understanding and implementing risk management strategies',
      },
      {
        title: 'Advanced Trading Patterns',
        videoId: '6qD6Z6j6qD6',
        description: 'Identifying and trading complex chart patterns',
      },
    ],
  },
  'defi-masterclass': {
    title: 'DeFi Masterclass',
    description:
      'Comprehensive guide to Decentralized Finance and its applications.',
    instructor: 'Alex Thompson',
    thumbnail: 'https://img.youtube.com/vi/7qD7Z7j7qD7/maxresdefault.jpg',
    lectures: [
      {
        title: 'Introduction to DeFi',
        videoId: '7qD7Z7j7qD7',
        description: 'Understanding the basics of Decentralized Finance',
      },
      {
        title: 'Smart Contracts',
        videoId: '8qD8Z8j8qD8',
        description: 'Learning about smart contracts and their role in DeFi',
      },
      {
        title: 'DeFi Protocols',
        videoId: '9qD9Z9j9qD9',
        description: 'Exploring popular DeFi protocols and their use cases',
      },
    ],
  },
}