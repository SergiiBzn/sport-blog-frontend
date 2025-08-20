import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostDetails from './pages/PostDetails.jsx';

const App = () => {
  return (
    <div className='max-w-4xl mx-auto p-4'>
      <header className='flex items-center justify-between mb-6'>
        <Link to='/' className='text-2xl font-bold'>
          Sport Blog
        </Link>
        <nav className='flex gap-4'>
          <Link to='/'>Home</Link>
          <Link to='/create' className='px-3 py-1 border rounded'>
            Create Post
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/posts/:id' element={<PostDetails />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
};

export default App;
