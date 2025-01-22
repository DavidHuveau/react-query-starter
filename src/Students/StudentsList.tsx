import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchStudents = async () => {
  const response = await fetch('http://localhost:3000/api/V1/students');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.result;
};

const updateStudent = async (id: number, name: string) => {
  const response = await fetch(`http://localhost:3000/api/V1/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return response.json();
};

const deleteStudent = async (id: number) => {
  const response = await fetch(`http://localhost:3000/api/V1/students/${id}`, {
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
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateStudent(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setEditingId(null);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Students List</h2>
      <button onClick={() => refetch()} style={{ marginBottom: '10px' }}>
        Refresh
      </button>
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
                <button
                  onClick={() =>
                    updateStudentMutation.mutate({ id: student.id, name: newName })
                  }
                >
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {student.name}{' '}
                <button onClick={() => setEditingId(student.id)}>Edit</button>
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
