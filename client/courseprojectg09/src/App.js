import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";

function App() {
  const navigate = useNavigate();
  return (
      <>
              <Navbar/>
              <Routes>
                  <Route exact path="/" element={<Homepage/>}/>
              </Routes>
      </>
  );
}

export default App;
