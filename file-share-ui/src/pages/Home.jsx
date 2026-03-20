import { useEffect, useState } from "react";
import FileItem from "../components/FileItem";
import axios from "axios";
import CartItem from "../components/CartItem";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [filesCart, setFilesCart] = useState([]);
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
    const ws = new WebSocket("ws://localhost:3000");

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
            <span className="text-sm text-gray-400">{files.length}</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {files.map((file) => (
            <FileItem key={file.name} file={file} onClick={handleItemClick} />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3 bg-white rounded-2xl p-4 shadow-md md:ml-4 mt-4 md:mt-0 flex flex-col">
        <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
            File Cart
            <span className="text-sm text-gray-400">{filesCart.length}</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 max-h-content">
          {filesCart.length > 0 ? (
            filesCart.map((file) => <CartItem key={file.path} file={file} />)
          ) : (
            <p className="text-sm text-gray-400 text-center mt-10 animate-pulse">
              No files selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
