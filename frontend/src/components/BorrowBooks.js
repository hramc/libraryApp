


// src/components/Classes.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function BorrowBooks({ classes, books, refreshClasses, refreshBooks }) {
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const pageSize = 10;
  const [borrowTransactions, setBorrowTransactions] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [bookId, setBookId] = useState("");
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [borrowDate, setBorrowDate] = useState("");

  const fetchBorrowTransactionsByClass = async (classId, page, pageSize) => {
    fetchBorrowTransactions(classId, page, pageSize);
    getStudentsByClass(classId);
  }
  const fetchBorrowTransactions = async (classId, page, pageSize) => {
    try {
        const res = await axios.get(
          `http://127.0.0.1:8000/transactions/${classId}/borrow?skip=${page * pageSize}&limit=${pageSize}`
        );
        setBorrowTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
  };

  const addBorrowTransactions = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/transactions/borrow", { classId, bookId, studentId, borrowDate  });
    setBookId("");
    setStudentId("");
    setBorrowDate("");
    fetchBorrowTransactions(classId, page, pageSize);
    refreshClasses();
    refreshBooks();
  };

  const deleteTransaction = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/transactions/${id}`);
        fetchBorrowTransactions(classId, page, pageSize);
        refreshClasses();
        refreshBooks();
      };

  const getStudentsByClass = async (classId) => {
        try {
                const res = await axios.get(
                  `http://127.0.0.1:8000/students/${classId}/all`
                );
                setStudentsList(res.data);
              } catch (err) {
                console.error(err);
              }
           refreshClasses();
           refreshBooks();
         };

  useEffect(() => { });

  return (
    <div>
      <h1>Borrow Books </h1>
      <div>
        <h3> Nilai </h3>
           <select value={classId} onChange={e => setClassId(e.target.value)} required>
                         <option value="">Select Class</option>
                         {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
           <button
                           onClick={() => fetchBorrowTransactionsByClass(classId, page, pageSize)}
                         >
                           Search
                         </button>
        </div>

      <table>
        <thead>
          <tr>
            <th>Index </th>
            <th>ID</th>
            <th>ClassName</th>
            <th>StudentName</th>
            <th>BookName</th>
            <th>BorrowDate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowTransactions.map((bt, index) => {
          const cls = classes.find(c => c.id === bt.classId);
          const bks= books.find(b => b.id === bt.bookId);
          const stds = studentsList.find(s => s.id === bt.studentId);
          return (
            <tr key={bt.id}>
              <td>{(page * pageSize)+(index + 1)}</td>
              <td>{bt.id}</td>
              <td>{cls ? cls.name : bt.classId}</td>
              <td>{stds ? stds.name : bt.classId}</td>
              <td>{bks ? bks.name : bt.classId}</td>
              <td>{bt.borrowDate}</td>
              <td>
                 <button onClick={() => deleteTransaction(bt.id)}>❌ Remove</button>
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
                disabled={borrowTransactions.length < pageSize}
              >
                Next
              </button>
            </div>

      <h2>Add Borrow Transaction</h2>
      <form onSubmit={addBorrowTransactions} className="form">
        <input type="text" value={classId} placeholder="Class Name" required disabled />
        <select value={bookId} onChange={e => setBookId(e.target.value)} required>
                  <option value="">Select Book</option>
                  {books.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
        <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                          <option value="">Select Student</option>
                          {studentsList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
        <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}  // 👈 Captures date in YYYY-MM-DD
                required
              />
        <button type="submit" className="btn">Add Borrow Transcation</button>
      </form>
    </div>
  );
}

