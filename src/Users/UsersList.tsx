import { useQuery } from '@tanstack/react-query';
import { User } from './types';

const UsersList = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => 
      fetch(import.meta.env.VITE_USERS_API_URL).then((response) =>
        response.json()
      ),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
