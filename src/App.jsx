import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreatePost from "./Pages/CreatePost";
import PostDetail from "./Pages/PostDetail";
import "./App.css";
import EditPage from "./Pages/EditPage";
import { Toaster } from "react-hot-toast";
import SignUp from "./login/SignUp";
import SignIn from "./login/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPage />} />
          {/* <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
