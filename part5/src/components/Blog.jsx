import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [viewDetails, setViewDetails] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const addLikes = () => {
    const blogObject = { 
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    
    updateLikes (blog.id, blogObject);
  }

  const handleDeleteBlog = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  }

  console.log('user', user)
  console.log('blog', blog)
  
  return(
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setViewDetails(!viewDetails)}>
          {viewDetails ? "hide" : "view"}
        </button>
      </div>
      {
        viewDetails &&
        <>
          <div className='blog-url'>
            {blog?.url}
          </div>
          <div className='blog-likes'>
            likes {blog.likes !== undefined ? blog.likes : 0}{" "}
            <button onClick={addLikes} className='like-button'>likes</button>
          </div>
          <div>
            {blog.user && blog.user.username}
          </div>
          {
            user.id === blog.user.id &&
            <button onClick={handleDeleteBlog} className='delete-button'>delete</button>
          }
        </>
      }
    </div>
  )  
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog;