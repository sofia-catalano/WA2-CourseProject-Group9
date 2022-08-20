import { Routes, BrowserRouter, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import RegistrationPage from "./components/Registration/RegistrationPage";

function App() {
  const navigate = useNavigate();
  return (
      <>
              <Navbar/>
              <Routes>
                  <Route exact path="/" element={<Homepage/>}/>
                  <Route exact path="/user/register" element={<RegistrationPage/>}/>
              </Routes>
      </>
  );
}

export default App;
