import { useState } from "react";
import ConnectScreen from "../components/ConnectScreen";

export default function Client() {
  const [files, setFiles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [waiting, setWaiting] = useState(false);

  const connect = (address, username) => {
    const socket = new WebSocket(`ws://${address}`);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "JOIN_REQUEST",
          data: { clientName: username },
        }),
      );
      setConnected(true);
      setWaiting(true);
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

      if (msg.type === "JOIN_RESPONSE") {
        if (!msg.data.accepted) {
          setConnected(false);
          setErrorMsg(msg.data.message || "Could not join session");
        }
        setWaiting(false);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setWaiting(false);
      console.log("Disconnected from server");
    };
  };

  return !connected ? (
    <ConnectScreen
      onConnect={connect}
      address={address}
      setAddress={setAddress}
      username={username}
      setUsername={setUsername}
      errorMsg={errorMsg}
    />
  ) : (
    <div className="bg-white rounded-xl shadow h-full flex flex-col overflow-hidden">
      {returnContent(waiting, files, address)}
    </div>
  );
}

function returnContent(isWaiting, files, address) {
  if (isWaiting) {
    return (
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mb-4"></div>
        <span className="text-gray-700">Waiting for host response...</span>
      </div>
    );
  }
  return (
    <>
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
    </>
  );
}
