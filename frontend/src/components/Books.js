// src/components/Books.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Books({ books, setBooks, refreshBooks }) {
  const [booksList, setBooksList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const pageSize = 5;
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [available, setAvailable] = useState(true); // <-- new state


  const fetchBooks = async (page, pageSize) => {
    const res = await axios.get(`http://127.0.0.1:8000/books/?skip=${page * pageSize}&limit=${pageSize}`)
    .then(res => setBooksList(res.data))
    .catch(err => console.error(err));
  };

  const addBook = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/books/add", { name, author, available });
    setName("");
    setAuthor("");
    setAvailable(true);
    fetchBooks(page, pageSize);
    refreshBooks();
  };

  const deleteBook = async (id) => {
      await axios.delete(`http://127.0.0.1:8000/books/${id}`);
      fetchBooks(page, pageSize);
      refreshBooks();
    };

  useEffect(() => { fetchBooks(page, pageSize); }, [page, pageSize]);

  return (
    <div>
      <h1>Books</h1>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Name</th>
            <th>Author</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {booksList.map((b, index) => (
            <tr key={b.id}>
              <td>{(page * pageSize)+(index + 1)}</td>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td>{b.author}</td>
              <td>
                <input type="checkbox" checked={b.available} readOnly />
              </td>
              <td>
                  <button onClick={() => deleteBook(b.id)}>❌ Remove</button>
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
                disabled={booksList.length < pageSize}
              >
                Next
              </button>
            </div>

      <h2>Add Book</h2>
      <form onSubmit={addBook} className="form">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Book Name" required />
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name" required />
        {/* Available Checkbox */}
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
          <span>Available</span>
        </label>
        <button type="submit" className="btn">Add Book</button>
      </form>
    </div>
  );
}
