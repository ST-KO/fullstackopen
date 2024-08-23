import React from 'react';
import { useState } from 'react';
import PorpTypes from 'prop-types';

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
                    id='title'
                    onChange={handleBlogChange} 
                    placeholder='Write the title'
                />
            </div>
            <div>
                author: 
                <input 
                    type="text" 
                    value={newBlog.author} 
                    name="author" 
                    id='author'
                    onChange={handleBlogChange} 
                    placeholder='Write the author'
                />
            </div>
            <div>
                url: 
                <input 
                    type="text" 
                    value={newBlog.url} 
                    name="url" 
                    id='url'
                    onChange={handleBlogChange} 
                    placeholder='Write the url'
                />
            </div>

            <button type="submit" id="create-button">create</button>
            </form>
        </div>
    );
};

BlogForm.propTypes = {
    createBlog: PorpTypes.func.isRequired
}

export default BlogForm;