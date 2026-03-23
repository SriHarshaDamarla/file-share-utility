import { ArrowLeft, File, Folder } from "lucide-react";

export default function FileItem({ onClick, file }) {
  return (
    <div
      onClick={() => onClick(file)}
      className={`
        flex items-center justify-between p-3 rounded-xl cursor-pointer 
        border border-transparent 
        hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm
        active:scale-[0.98]
        transition-all duration-150 ease-out
        animate-fade-in
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-9 h-9 flex items-center justify-center rounded-xl
          ${file.type === "folder" ? "bg-green-100" : "bg-gray-100"}
        `}
        >
          {file.type === "folder" ? (
            folderOrBackIcon(file)
          ) : (
            <File className="text-gray-500 w-5 h-5" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-800 truncate line-clamp-1">
          {file.name}
        </span>
      </div>
    </div>
  );
}

function folderOrBackIcon(file) {
  return file.name === "-- Back" ? (
    <ArrowLeft className="text-gray-500 w-5 h-5" />
  ) : (
    <Folder className="text-green-600 w-5 h-5" />
  );
}
