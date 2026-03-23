import { File, Folder, Trash2 } from "lucide-react";

export default function CartItem({ onClick, file, handleRemove }) {
  return (
    <div
      onClick={() => onClick(file)}
      className="group flex items-center justify-between p-3 cursor-pointer rounded-xl bg-green-50 border border-green-200 transition hover:bg-green-100 hover:border-green-300 animate-fade-in"
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-9 h-9 flex items-center justify-center rounded-xl
          ${file.type === "folder" ? "bg-green-100" : "bg-gray-100"}
        `}
        >
          {file.type === "folder" ? (
            <Folder className="text-green-600 w-5 h-5" />
          ) : (
            <File className="text-gray-500 w-5 h-5" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-800 truncate">
          {file.name.length > 25 ? file.name.slice(0, 25) + "..." : file.name}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove(file.path);
        }}
        className="p-2 rounded-lg md:opacity-0 md:group-hover:opacity-100 hover:bg-red-100 transition cursor-pointer"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}
