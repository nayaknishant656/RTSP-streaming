import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Body from "./components/body/body"
import Footer from "./components/footer/footer"
import Header from "./components/header/header"
import VideoPlayer from "./components/body/videoplayer"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/player/:id" element={<VideoPlayer />} />
      </Routes>
      <Footer />
    </Router>
  );
}


export default App;
