import React from 'react';
import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: ''
    });
    
    const addBlog = (e) => {
        e.preventDefault();
        
        createBlog ({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url
        });

        setNewBlog(prev => ({
            title: '',
            author: '',
            url: ''
        }));
    }

    const handleBlogChange = (event) => {
        console.log(event.target.value);
        const { value, name } = event.target;
        setNewBlog(prev => ({
          ...prev,
          [name]: value
        }));
    }

    return (
        <div>
            <h2>create new</h2>

            <form onSubmit={addBlog}>
            <div>
                title: 
                <input 
                    type="text" 
                    value={newBlog.title} 
                    name="title" 
                    onChange={handleBlogChange} 
                />
            </div>
            <div>
                author: 
                <input 
                    type="text" 
                    value={newBlog.author} 
                    name="author" 
                    onChange={handleBlogChange} 
                />
            </div>
            <div>
                url: 
                <input 
                    type="text" 
                    value={newBlog.url} 
                    name="url" 
                    onChange={handleBlogChange} 
                />
            </div>

            <button type="submit">create</button>
            </form>
        </div>
    );
};

export default BlogForm;