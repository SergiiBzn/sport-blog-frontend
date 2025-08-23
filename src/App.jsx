import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostDetails from './pages/PostDetails.jsx';

const App = () => {
  return (
    <div className='max-w-4xl mx-auto p-4'>
      <header className='sticky top-0 z-10 mb-6 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='max-w-4xl mx-auto flex items-center justify-between px-4 py-3'>
          <Link to='/' className='text-2xl font-bold cursor-pointer'>
            Sport Blog
          </Link>
          <nav className='flex gap-4'>
            <Link to='/' className='px-3 py-1 border rounded'>
              Home
            </Link>
            <Link to='/create' className='px-3 py-1 border rounded'>
              Create Post
            </Link>
          </nav>
        </div>
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
