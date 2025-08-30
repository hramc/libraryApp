// src/components/Students.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Students({ classes }) {
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const pageSize = 5;
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");

  const fetchStudents = async (page, pageSize) => {
    const res = await axios.get(`http://127.0.0.1:8000/students/?skip=${page * pageSize}&limit=${pageSize}`).then(res => setStudents(res.data))
                                                                        .catch(err => console.error(err));
  };

  const addStudent = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/students/add", {
      name,
      classId
    });
    setName(""); setClassId("");
    fetchStudents(page, pageSize);
  };

  const deleteStudent = async (id) => {
      await axios.delete(`http://127.0.0.1:8000/students/${id}`);
      fetchStudents(page, pageSize);
    };

  useEffect(() => { fetchStudents(page, pageSize); }, [page, pageSize]);

  return (
    <div>
      <h1>Students</h1>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => {
            const cls = classes.find(c => c.id === s.classId);
            return (
              <tr key={s.id}>
                <td>{(page * pageSize)+(index + 1)}</td>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{cls ? cls.name : s.classId}</td>
                <td>
                   <button onClick={() => deleteStudent(s.id)}>❌ Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </button>
              <span className="self-center">Page {page + 1}</span>
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={students.length < pageSize}
              >
                Next
              </button>
            </div>

      <h2>Add Student</h2>
      <form onSubmit={addStudent} className="form">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <select value={classId} onChange={e => setClassId(e.target.value)} required>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" className="btn">Add Student</button>
      </form>
    </div>
  );
}
