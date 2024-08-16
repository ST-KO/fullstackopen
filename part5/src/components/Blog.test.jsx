import { render, screen } from '@testing-library/react';
import Blog from './Blog';

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

    const { container } = render(<Blog blog={blog} />);

    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )
});