import React from 'react';

const blogPosts = [
  {
    date: '10',
    month: 'Oct',
    year: '2025',
    comments: 6,
    type: 'video',
    image: 'https://partenopedallas.com/wp-content/uploads/2024/04/sweet-marshmallow-Partenope-Ristorante-2.jpg',
    title: "The Art of Wine Pairing: Our Sommelier's Secrets",
    excerpt: 'Learn the essential rules for matching our seasonal tasting menu with the perfect glass of wine to elevate your dining experience.',
  },
  {
    date: '25',
    month: 'Sep',
    year: '2025',
    comments: 0,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1523475496153-3b643e568c9e?crop=entropy&cs=tinysrgb&fit=max&w=500&q=80',
    title: 'Meet the Maker: A Deep Dive into Our Local Farm',
    excerpt: 'We travel to the source of our freshest produce to introduce you to the dedicated growers and sustainable practices behind our core ingredients.',
  },
];

const BlogCard: React.FC<typeof blogPosts[0]> = ({ date, month, year, comments, type, image, title, excerpt }) => (
  <div className="flex flex-col lg:flex-row bg-[#f8f3ef] border border-[#e8ded5] shadow-md rounded-lg overflow-hidden">
    <img src={image} alt={title} className="w-full lg:w-1/3 h-48 object-cover" />
    <div className="p-6 flex-1">
      <div className="text-[#5c3a21] text-sm mb-2">{date} {month} {year} | {comments} comments</div>
      <h3 className="text-2xl font-bold mb-2 text-[#8b5e34]">{title}</h3>
      <p className="text-[#8a6f57]">{excerpt}</p>
      <button className="mt-4 px-4 py-2 bg-[#c9a589] text-[#5c3a21] rounded-sm hover:bg-[#e8ded5] transition-colors">Read More</button>
    </div>
  </div>
);

const RecentBlog: React.FC = () => (
  <section className="py-16 bg-[#e8ded5]">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-cursive text-center mb-12 text-[#5c3a21]">Recent Blog</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} {...post} />
        ))}
      </div>
    </div>
  </section>
);

export default RecentBlog;
