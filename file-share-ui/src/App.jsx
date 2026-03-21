import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Client from "./pages/Client";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname === "/client" ? "client" : "server";

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-center pt-6">
        <div className="bg-gray-100 rounded-full py-1 px-2 max-w-xs w-full">
          <div className="relative flex rounded-full p-1">
            {/* Sliding indicator */}
            <div
              className={`
              absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow
              transition-all duration-300
              ${active === "server" ? "left-0" : "left-1/2"}
            `}
            />

            {/* Server Tab */}
            <button
              onClick={() => navigate("/")}
              className={`relative z-10 flex-1 text-sm font-medium py-2 text-center
              ${active === "server" ? "text-gray-900" : "text-gray-500"}
            `}
            >
              Server
            </button>

            {/* Client Tab */}
            <button
              onClick={() => navigate("/client")}
              className={`relative z-10 flex-1 text-sm font-medium py-2 text-center
              ${active === "client" ? "text-gray-900" : "text-gray-500"}
            `}
            >
              Client
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="mt-1 md:mt-6 max-w-6xl w-screen mx-auto p-4 flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client" element={<Client />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
