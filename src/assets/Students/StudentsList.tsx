interface StudentsListProps {
  students: string[];
}

const StudentsList = ({ students }: StudentsListProps) => {
  return (
    <ul>
      {students.map((student, index) => (
        <li key={index}>{student}</li>
      ))}
    </ul>
  );
};

export default StudentsList;
