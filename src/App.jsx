import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Flashcards from "./Flashcards"; // estrai il contenuto attuale in un nuovo componente
import About from "./About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router basename="/jlpt-flashcard/">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Flashcards />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
