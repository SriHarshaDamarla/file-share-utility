import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, WS_URL } from "../constants/constants";
import HostScreen from "../components/HostScreen";
import LoginScreen from "../components/LoginScreen";
import { hideModalWithoutCallback, showModal } from "../modal/modal";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [filesCart, setFilesCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const wsRef = useRef(null);

  const handleLogout = () => {
    axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${sessionId}` },
      },
    );
    wsRef.current?.close();
    setSessionId(null);
  };

  const handleItemClick = (file) => {
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    if (file.type === "folder") {
      file.name === "-- Back"
        ? setCurrentPath(currentPath.split("/").slice(0, -1).join("/"))
        : setCurrentPath(filePath);
    } else {
      handleCartAdd({ ...file, path: filePath });
    }
  };

  const handleCartAdd = (file) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/cart/add`, file, {
        headers: { Authorization: `Bearer ${sessionId}` },
      })
      .then((response) => {
        const data = response.data;
        if (!data.added) {
          showModal("Cart Alert", "File is already in the cart", "OK");
        }
        setLoading(false);
      });
  };

  const handleCartRemove = (filePath) => {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/cart/remove`,
        { path: filePath },
        {
          headers: { Authorization: `Bearer ${sessionId}` },
        },
      )
      .then((response) => {
        const data = response.data;
        if (!data.removed) {
          showModal("Cart Error", "Failed to remove file from cart", "OK");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    setLoading(true);
    axios
      .get(`${BASE_URL}/files`, {
        params: { path: currentPath },
        headers: { Authorization: `Bearer ${sessionId}` },
      })
      .then((response) => {
        const data = response.data;
        currentPath !== "" && data.unshift({ name: "-- Back", type: "folder" });
        setFiles(response.data);
        setLoading(false);
      });
  }, [currentPath, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const ws = new WebSocket(WS_URL);

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "AUTH_REQUEST", data: { sessionId } }));
    };

    ws.onclose = () => {
      setSessionId(null);
    };

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

      if (msg.type === "JOIN_REQUEST") {
        const clientName = msg.data.clientName;
        const clientSessionId = msg.data.clientSessionId;
        showModal(
          "Client Join Request",
          `${clientName}, wants to join your session. Allow?`,
          "Deny",
          "Allow",
          () => {
            ws.send(
              JSON.stringify({
                type: "JOIN_RESPONSE",
                data: {
                  accepted: true,
                  clientSessionId,
                  serverSessionId: sessionId,
                },
              }),
            );
          },
          () => {
            ws.send(
              JSON.stringify({
                type: "JOIN_RESPONSE",
                data: {
                  accepted: false,
                  clientSessionId,
                  serverSessionId: sessionId,
                },
              }),
            );
          },
        );
      }

      if (msg.type === "JOIN_RESPONSE") {
        hideModalWithoutCallback();
      }
    };

    return () => ws.close();
  }, [sessionId]);

  return sessionId != null ? (
    <HostScreen
      files={files}
      filesCart={filesCart}
      setShowCart={setShowCart}
      showCart={showCart}
      handleItemClick={handleItemClick}
      handleCartRemove={handleCartRemove}
      handleLogout={handleLogout}
      loading={loading}
    />
  ) : (
    <LoginScreen onLogin={setSessionId} />
  );
}
