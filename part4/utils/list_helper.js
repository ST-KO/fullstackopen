const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  let likes = 0;
  let mostLikedBlog;

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > likes) {
      likes = blogs[i].likes;
      mostLikedBlog = blogs[i];
    }
  }

  return mostLikedBlog;
};

const mostBlogs = (blogs) => {
  const authorCounts = blogs.reduce((counts, blog) => {
    const author = blog.author;
    if (counts[author]) {
      counts[author]++;
    } else {
      counts[author] = 1;
    }
    return counts;
  }, {});

  const topAuthor = Object.entries(authorCounts).reduce(
    (max, [author, blogs]) => {
      return blogs > max.blogs ? { author, blogs } : max;
    },
    { author: null, blogs: 0 }
  );
  return topAuthor;
};

const mostLikes = (blogs) => {
  let mostLikedBlog = {
    author: "",
    likes: 0,
  };

  for (const blog of blogs) {
    if (blog.likes > mostLikedBlog.likes) {
      mostLikedBlog.author = blog.author;
      mostLikedBlog.likes = blog.likes;
    }
  }

  return mostLikedBlog;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
