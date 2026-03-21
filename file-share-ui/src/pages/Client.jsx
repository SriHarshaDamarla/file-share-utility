import { useState } from "react";
import ConnectScreen from "../components/ConnectScreen";

export default function Client() {
  const [files, setFiles] = useState([]);
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  const connect = (address) => {
    const socket = new WebSocket(`ws://${address}`);

    socket.onopen = () => {
      setConnected(true);
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "FULLSNAP") {
        setFiles(msg.data);
      }

      if (msg.type === "ADDFILE") {
        setFiles((prev) => [...prev, msg.data]);
      }

      if (msg.type === "REMOVEFILE") {
        setFiles((prev) => prev.filter((item) => item.path !== msg.data.path));
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("Disconnected from server");
    };

    setWs(socket);
  };

  return !connected ? (
    <ConnectScreen
      onConnect={connect}
      address={address}
      setAddress={setAddress}
    />
  ) : (
    <div className="bg-white rounded-xl shadow h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b font-semibold flex items-center justify-between">
        <span>Available Files ({files.length})</span>
        <span className="hidden md:block">
          Connected to <span className="text-green-700">{address}</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {files.map((file) => (
          <a
            key={file.path}
            href={`http://${address}/download?path=${encodeURIComponent(file.path)}`}
            className="block p-3 rounded-lg hover:bg-gray-100"
          >
            {file.name}
          </a>
        ))}
      </div>
    </div>
  );
}
