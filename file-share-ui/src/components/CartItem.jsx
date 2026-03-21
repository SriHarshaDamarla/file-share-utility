export default function CartItem({ onClick, file, handleRemove }) {
  return (
    <div
      onClick={() => onClick(file)}
      className="group flex items-center justify-between p-3 cursor-pointer rounded-xl bg-green-50 border border-green-200 transition hover:bg-green-100 hover:border-green-300"
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
        <span className="text-sm font-medium text-gray-800 truncate">
          {file.name.length > 25 ? file.name.slice(0, 25) + "..." : file.name}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove(file.path);
        }}
        className="md:opacity-0 md:group-hover:opacity-100 text-red-500 hover:text-red-600 transition cursor-pointer"
      >
        🗑
      </button>
    </div>
  );
}
