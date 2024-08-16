import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect } from 'chai';

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'siko',
        url: 'http://adb',
        likes: 10,
        user: {
            id: 'aaa'
        }
    }

    render(<Blog blog={blog} />);
    const title = screen.getByText(blog.title, { exact: false });
    const author = screen.getByText(blog.author, { exact: false });
    expect(title).toBeDefined();
    expect(author).toBeDefined();

    const url = screen.queryByText(blog.url);
    const likes = screen.queryByText(blog.likes);
    expect(url).toBeNull();
    expect(likes).toBeNull();
});

test('shows the URL and number of likes when the button is clicked', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'siko',
        url: 'http://adb',
        likes: 10,
        user: {
            id: 'aaa'
        }
    }

    const { container } = render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const url = container.querySelector('.blog-url');
    const likes = container.querySelector('.blog-likes');

    expect(url).toHaveTextContent(blog.url);
    expect(likes).toHaveTextContent(`likes ${blog.likes}`);
})