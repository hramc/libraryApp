// src/components/Classes.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Classes({ classes, setClasses, refreshClasses }) {
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const pageSize = 5;
  const [classList, setClassList] = useState([]);
  const [name, setName] = useState("");
  const [teacherName, setTeacherName] = useState("");

  const fetchClasses = async (page, pageSize) => {
    const res = await axios.get(`http://127.0.0.1:8000/classes/?skip=${page * pageSize}&limit=${pageSize}`)
    .then(res => setClassList(res.data))
    .catch(err => console.error(err));
  };

  const addClass = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/classes/add", { name, teacherName });
    setName("");
    setTeacherName("");
    fetchClasses(page, pageSize);
    refreshClasses();
  };

  const deleteClass = async (id) => {
      await axios.delete(`http://127.0.0.1:8000/classes/${id}`);
      fetchClasses(page, pageSize);
      refreshClasses();
    };

  useEffect(() => { fetchClasses(page, pageSize); }, [page, pageSize]);

  return (
    <div>
      <h1>Classes</h1>
      <table>
        <thead>
          <tr>
            <th>Index </th>
            <th>ID</th>
            <th>Name</th>
            <th>TeacherName</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classList.map((c, index) => (
            <tr key={c.id}>
              <td>{(page * pageSize)+(index + 1)}</td>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.teacherName}</td>
              <td>
                  <button onClick={() => deleteClass(c.id)}>❌ Remove</button>
              </td>
            </tr>
          ))}
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
                disabled={classList.length < pageSize}
              >
                Next
              </button>
            </div>

      <h2>Add Class</h2>
      <form onSubmit={addClass} className="form">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Class Name" required />
        <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Teacher Name" required />

        <button type="submit" className="btn">Add Class</button>
      </form>
    </div>
  );
}
