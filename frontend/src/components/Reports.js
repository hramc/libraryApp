// src/components/Books.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports({ classes, allBooks, students }) {
  const [transactionsList, setTransactionsList] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [classId, setClassId] = useState("");
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");


  const fetchTransactionReport = async (classId, studentId, bookId, page, pageSize) => {

   try {
        const res = await axios.get(
        `http://127.0.0.1:8000/transactions/generateReports/?classId=${classId}&bookId=${bookId}&studentId=${studentId}&skip=${page * pageSize}&limit=${pageSize}`
        );
        setTransactionsList(res.data);
      } catch (err) {
        console.error(err);
      }
  };

useEffect(() => {

},);


  return (
    <div>
      <h1>Reports</h1>
      <div>
      <table>
        <thead>
            <tr>
                <th> Nilai </th>
                <th> Book </th>
                <th> Student </th>
            </tr>
        </thead>
            <tr>
            <td>
             <select value={classId} onChange={e => setClassId(e.target.value)} required>
                           <option value="">Select Class</option>
                           {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                         </select>
            </td>
            <td>
                       <select value={bookId} onChange={e => setBookId(e.target.value)} required>
                                     <option value="">Select Book</option>
                                     {allBooks.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                   </select>
           </td>
           <td>
                       <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                                     <option value="">Select Student</option>
                                     {students.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                   </select>
           </td>
           </tr>
           <tr>
           <td>
          <button
                                     onClick={() => fetchTransactionReport(classId, studentId, bookId, page, pageSize)}
                                   >
                                     Search
                                   </button>
           </td>
           </tr>
           </table>

      </div>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>ClassName</th>
            <th>BookName</th>
            <th>StudentName</th>
            <th>BorrowDate</th>
            <th>ReturnDate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactionsList.map((bt, index) => {
            const cls = classes.find(c => c.id === bt.classId);
            const bks= allBooks.find(b => b.id === bt.bookId);
            const stds = students.find(s => s.id === bt.studentId);
            return (
            <tr key={bt.id}>
              <td>{(page * pageSize)+(index + 1)}</td>
              <td>{bt.id}</td>
              <td>{cls ? cls.name : bt.classId}</td>
              <td>{bks ? bks.name : bt.classId}</td>
              <td>{stds ? stds.name : bt.classId}</td>
              <td>{bt.borrowDate}</td>
              <td>{bt.returnDate}</td>
              <td>{bt.status}</td>
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
                disabled={transactionsList.length < pageSize}
              >
                Next
              </button>
            </div>

    </div>
  );
}
