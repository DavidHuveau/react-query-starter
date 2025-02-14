import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Student = {
  id: number;
  name: string;
};

const fetchStudents = async () => {
  console.log('Fetching data from server...');
  const response = await fetch(import.meta.env.VITE_STUDENTS_API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.result;
};

const updateStudent = async (id: number, name: string) => {
  const response = await fetch(`${import.meta.env.VITE_STUDENTS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  const data = await response.json();
  return data.result;
};

const deleteStudent = async (id: number) => {
  const response = await fetch(`${import.meta.env.VITE_STUDENTS_API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete student');
  }
  return response.json();
};

const StudentsList = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, name }: Student) =>
      updateStudent(id, name),
    onSuccess: (updatedStudent) => {
      // console.log('Mutation success: Invalidating queries and refetching data');
      // queryClient.invalidateQueries({ queryKey: ['students'] });

      queryClient.setQueryData(['students'], (oldStudents: Student[]) => {
        const tmp = oldStudents.map((student: Student) => 
          student.id === updatedStudent.id ? updatedStudent : student
        )
        return tmp;
      });
      setEditingId(null);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: (_, id) => {
      // console.log('Mutation success: Invalidating queries and refetching data');
      // queryClient.invalidateQueries({ queryKey: ['students'] });

      queryClient.setQueryData(['students'], (oldStudents: Student[]) =>
        oldStudents.filter((student: Student) => student.id !== id)
      );
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleEditClick = (student: Student) => {
    setNewName(student.name);
    setEditingId(student.id);
  };

  return (
    <div>
      <h2>Students List</h2>
      <button onClick={() => refetch()} style={{ marginBottom: '10px' }}>Refresh</button>
      <ul>
        {data.map((student: { id: number; name: string }) => (
          <li key={student.id}>
            {editingId === student.id ? (
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button onClick={() => updateStudentMutation.mutate({ id: student.id, name: newName })}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {student.name}{' '}
                <button onClick={() => handleEditClick(student)}>Edit</button>
                <button
                  onClick={() => deleteStudentMutation.mutate(student.id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsList;
