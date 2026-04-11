import { useEffect, useState } from "react";
import { hideModal, setGlobalModalFunctions } from "../modal/modal";

export default function ModalWindow() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allowText, setAllowText] = useState("");
  const [closeText, setCloseText] = useState("");
  useEffect(() => {
    setGlobalModalFunctions(
      setShowModal,
      setTitle,
      setContent,
      setCloseText,
      setAllowText,
    );
    return () => {
      setGlobalModalFunctions(null, null, null, null, null);
    };
  }, []);

  return (
    <div
      className={`h-full w-full fixed inset-0 bg-black/20 z-150 ${showModal ? "flex" : "hidden"} justify-center items-center`}
    >
      <div className="w-full max-w-lg flex justify-center items-center h-full">
        <div className="bg-white rounded-lg p-6 shadow-lg w-full">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <p className="text-sm text-gray-600">{content}</p>
          <div className="mt-4 flex justify-end gap-2">
            {allowText && (
              <button
                onClick={() => hideModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
              >
                {allowText}
              </button>
            )}
            <button
              onClick={() => hideModal()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              {closeText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
