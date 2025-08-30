import { useEffect, useState } from "react";
import axios from "axios";
import Students from "./components/Students";
import Classes from "./components/Classes";
import Books from "./components/Books";
import BorrowBooks from "./components/BorrowBooks";
import ReturnBooks from "./components/ReturnBooks";
import Reports from "./components/Reports";
import "./App.css";

function App() {
  const [view, setView] = useState("classes");
  const [classes, setClasses] = useState([]);
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [students, setStudents] = useState([]);

  const refreshClasses = async () => {
    const res = await axios.get("http://127.0.0.1:8000/classes/all");
    setClasses(res.data);
  };

  const refreshAllBooks = async () => {
      const res = await axios.get("http://127.0.0.1:8000/books/all");
      setAllBooks(res.data);
    };

  const refreshBooks = async () => {
      const res = await axios.get("http://127.0.0.1:8000/books/availableBooks");
      setBooks(res.data);
    };

  const refreshStudents = async () => {
        const res = await axios.get(`http://127.0.0.1:8000/students/all`);
        setStudents(res.data);
      };

  useEffect(() => { refreshClasses(); refreshBooks(); refreshStudents(); refreshAllBooks();}, []);

  return (

    <div className="app-container">

          {/* Sidebar */}
          <div className="sidebar">
            <h2>Dashboard</h2>
                <button onClick={() => setView("classes")}>Classes</button>
                <button onClick={() => setView("students")}>Students</button>
                <button onClick={() => setView("books")}>Books</button>
                <button onClick={() => setView("borrowBooks")}>BorrowBooks</button>
                <button onClick={() => setView("returnBooks")}>ReturnBooks</button>
                <button onClick={() => setView("reports")}>Reports</button>
          </div>

          {/* Main View */}
          <div className="main-view">
            {view === "classes" && <Classes classes={classes} setClasses={setClasses} refreshClasses={refreshClasses} />}
            {view === "students" && <Students classes={classes} />}
            {view === "books" && <Books classes={classes} refreshBooks={refreshBooks}/>}
            {view === "borrowBooks" && <BorrowBooks classes={classes} books={books}
            refreshClasses={refreshClasses}
            refreshBooks={refreshBooks}/>}
            {view === "returnBooks" && <ReturnBooks classes={classes} books={books}
                        refreshClasses={refreshClasses}
                        refreshBooks={refreshBooks}/>}
            {view === "reports" && <Reports classes={classes} allBooks={allBooks}
                                    students={students}/>}
          </div>
        </div>
  );
}

export default App;
