import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { signOutUser } = useAuth();

  //const navLinks = ["Home", "Create New Post", "Projects", "Calendar"];
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Create New Post", path: "/create" },
    { label: "Projects", path: "/projects" },
    { label: "Calendar", path: "/calendar" },
  ];

  useEffect(() => {
    setSearchInput("");
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/signup");
  };
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <MdOutlineArticle className="w-6 h-6" />

          {/* form for searching  */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim() !== "") {
                navigate(`/?search=${encodeURIComponent(searchInput)}`);
              } else {
                navigate("/", { replace: true });
              }
            }}
            className="hidden md:block w-1/3"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <ul className="hidden md:flex space-x-6 text-sm">
            {navLinks.map((tab, index) => (
              <li
                key={index}
                className="pb-1 transition hover:border-b-2 hover:border-white/70"
              >
                <Link to={tab.path} className="cursor-pointer">
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Avatar */}
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/vector-1744772732383-4ee38c5b81e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGZhY2UlMjBpc2xhbXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Avatar"
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            {avatarOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                  Your Profile
                </a>
                <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                  Settings
                </a>
                <a
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign out
                </a>
              </div>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/*to make it responsive for smaller screen*/}
        {menuOpen && (
          <div className="md:hidden bg-blue-400 px-4 pb-4">
            <ul className="space-y-2 text-sm pt-2">
              {navLinks.map((tab, idx) => (
                <li key={idx} className="border-b border-white/30 py-1">
                  <Link to={tab.path} className="block">
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-white/30 pt-3 text-sm">
              <a className="block py-2" href="#">
                Your Profile
              </a>
              <a className="block py-2" href="#">
                Settings
              </a>
              <a className="block py-2" href="#" onClick={handleSignOut}>
                Sign out
              </a>
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
}
