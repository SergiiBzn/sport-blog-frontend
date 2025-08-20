import { useParams } from 'react-router-dom';

export default function PostDetails() {
  const { id } = useParams();
  return (
    <div>
      <h1 className='text-xl font-semibold mb-4'>Post Details</h1>
      <p>
        ID Post <b>{id}</b> loading
      </p>
    </div>
  );
}
