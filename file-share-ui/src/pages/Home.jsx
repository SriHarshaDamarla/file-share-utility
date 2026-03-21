import { useEffect, useState } from "react";
import FileItem from "../components/FileItem";
import axios from "axios";
import CartItem from "../components/CartItem";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [filesCart, setFilesCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const handleItemClick = (file) => {
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    if (file.type === "folder") {
      file.name === "<- Back"
        ? setCurrentPath(currentPath.split("/").slice(0, -1).join("/"))
        : setCurrentPath(filePath);
    } else {
      handleCartAdd({ ...file, path: filePath });
    }
  };
  const handleCartAdd = (file) => {
    axios.post("http://192.168.1.194:3000/cart/add", file).then((response) => {
      const data = response.data;
      if (!data.added) {
        alert("File already in cart");
      }
    });
  };

  const handleCartRemove = (filePath) => {
    axios
      .post("http://192.168.1.194:3000/cart/remove", { path: filePath })
      .then((response) => {
        const data = response.data;
        if (!data.removed) {
          alert("Failed to remove file from cart");
        }
      });
  };

  useEffect(() => {
    axios
      .get("http://192.168.1.194:3000/files", {
        params: { path: currentPath },
      })
      .then((response) => {
        const data = response.data;
        currentPath !== "" && data.unshift({ name: "<- Back", type: "folder" });
        setFiles(response.data);
      });
  }, [currentPath]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.194:3000");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "FULLSNAP") {
        setFilesCart(msg.data);
      }

      if (msg.type === "ADDFILE") {
        setFilesCart((prev) => [...prev, msg.data]);
      }

      if (msg.type === "REMOVEFILE") {
        setFilesCart((prev) =>
          prev.filter((item) => item.path !== msg.data.path),
        );
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full items-start">
      <div className="w-full md:w-2/3 bg-white rounded-2xl p-4 shadow-md h-full flex flex-col">
        <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
            Files
            <span className="text-sm text-gray-400 hidden md:block">
              {files.length}
            </span>
            <div className="md:hidden">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-white shadow rounded-full p-2"
              >
                🛒
                {filesCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                    {filesCart.length}
                  </span>
                )}
              </button>
            </div>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {files.map((file) => (
            <FileItem key={file.name} file={file} onClick={handleItemClick} />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3 bg-white rounded-2xl p-4 shadow-md md:ml-4 mt-4 md:mt-0 md:flex flex-col hidden">
        <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
            File Cart
            <span className="text-sm text-gray-400">{filesCart.length}</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 max-h-content space-y-2">
          {filesCart.length > 0 ? (
            filesCart.map((file) => (
              <CartItem
                key={file.path}
                file={file}
                handleRemove={handleCartRemove}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center mt-10 animate-pulse">
              No files selected
            </p>
          )}
        </div>
      </div>
      <div
        className={`
          fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50
          shadow-lg transform transition-transform duration-300 md:hidden
          ${showCart ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-800">File Cart</span>
          <button onClick={() => setShowCart(false)}>✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-3 space-y-2">
          {filesCart.length > 0 ? (
            filesCart.map((file) => (
              <CartItem
                key={file.path}
                file={file}
                handleRemove={handleCartRemove}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center mt-10 animate-pulse">
              No files selected
            </p>
          )}
        </div>
      </div>
      {showCart && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </div>
  );
}
