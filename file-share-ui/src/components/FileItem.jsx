export default function FileItem({ onClick, file }) {
  return (
    <div
      onClick={() => onClick(file)}
      className={`
        flex items-center justify-between p-3 rounded-xl cursor-pointer 
        border border-transparent 
        hover:border-gray-200 hover:bg-gray-100 
        active:scale-[0.98]
        transition-all duration-150
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-8 h-8 flex items-center justify-center rounded-lg
          ${file.type === "folder" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}
        `}
        >
          {file.type === "folder" ? "📁" : "📄"}
        </div>
        <span className="text-sm font-medium text-gray-800 truncate line-clamp-1">
          {file.name}
        </span>
      </div>
    </div>
  );
}
