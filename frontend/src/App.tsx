import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "../src/styles/index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Vacancies from "./components/Vacancies";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/catalog" element={<Catalog />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
