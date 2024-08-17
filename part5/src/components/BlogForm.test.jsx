import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<Blog /> updates parent state and calls onSubmit', async () => {
     const createBlog = vi.fn();
     const user = userEvent.setup();

     render(<BlogForm createBlog={createBlog} />);

     const titleInput = screen.getByPlaceholderText('Write the title');
     const authorInput = screen.getByPlaceholderText('Write the author');
     const url = screen.getByPlaceholderText('Write the url');
     const sendButton = screen.getByText('create');

     await user.type(titleInput, 'title');
     await user.type(authorInput, 'author');
     await user.type(url, 'url');
     await user.click(sendButton);

     expect(createBlog.mock.calls).toHaveLength(1);
     expect(createBlog.mock.calls[0][0].title).toBe('title');
     expect(createBlog.mock.calls[0][0].author).toBe('author');
     expect(createBlog.mock.calls[0][0].url).toBe('url');
});