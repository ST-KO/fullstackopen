import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect } from 'chai';

describe('<Blog />', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'siko',
        url: 'http://adb',
        likes: 10,
        user: {
            id: 'aaa'
        }
    };
    
    test('renders content', () => {
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
        const { container } = render(<Blog blog={blog} />);
    
        const user = userEvent.setup();
        const button = screen.getByText('view');
        await user.click(button);
    
        const url = container.querySelector('.blog-url');
        const likes = container.querySelector('.blog-likes');
    
        expect(url).toHaveTextContent(blog.url);
        expect(likes).toHaveTextContent(`likes ${blog.likes}`);
    });

    test('clicking the likes button twice calls event handler twice', async () => {
        const mockHandler = vi.fn();

        render(<Blog blog={blog} updateLikes={mockHandler} />);

        const user = userEvent.setup();
        const viewButton = screen.getByText('view');
        await user.click(viewButton);

        const likesButton = screen.getByText('likes');
        await user.click(likesButton);
        await user.click(likesButton);

        expect(mockHandler.mock.calls).toHaveLength(2);
    })
});