


// src/components/Classes.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReturnBooks({ classes, books, refreshClasses }) {
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const pageSize = 10;
  const [borrowTransactions, setBorrowTransactions] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [classId, setClassId] = useState("");

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

  const updateBorrowTransactions = async (id, returnDate) => {
    const res = await axios.post("http://127.0.0.1:8000/transactions/return", { id, returnDate  });
    fetchBorrowTransactions(classId, page, pageSize);
    refreshClasses();
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
           };

  useEffect(() => { });

  return (
    <div>
      <h1>Return Books </h1>
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
            <th>ReturnDate</th>
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
              <input
                              type="date"
                              value={bt.returnDate || ""}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                setBorrowTransactions(prev =>
                                  prev.map(x => x.id === bt.id ? { ...x, returnDate: newVal } : x)
                                );
                              }}
                            />
              </td>
              <td>
                 <button onClick={() => updateBorrowTransactions(bt.id, bt.returnDate)}
                                >Update</button>
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
        </div>
  );
}

