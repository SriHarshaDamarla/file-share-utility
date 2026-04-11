import { ShoppingCart } from "lucide-react";
import CartItem from "./CartItem";
import FileItem from "./FileItem";

export default function Host({
  files,
  filesCart,
  setShowCart,
  showCart,
  handleItemClick,
  handleCartRemove,
  handleLogout,
  loading,
}) {
  return (
    <div className="flex flex-col md:flex-row h-full items-start">
      <div className="w-full md:w-2/3 bg-white rounded-2xl p-4 shadow-sm h-full flex flex-col border border-gray-200">
        <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
            Files
            <div className="text-sm text-gray-400 hidden md:flex gap-2 items-center">
              <p>{files.length}</p>
              <div className="h-7 w-1 bg-gray-300 rounded-full ml-2" />
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-100 px-2 py-1 rounded transition cursor-pointer"
              >
                Logout
              </button>
            </div>
            <div className="md:hidden flex gap-1 items-center justify-center">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-white shadow rounded-full p-2"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {filesCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
                    {filesCart.length}
                  </span>
                )}
              </button>
              <div className="h-7 w-1 bg-gray-300 rounded-full ml-2" />
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-100 px-2 py-1 rounded transition cursor-pointer"
              >
                Logout
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
      <div className="w-full md:w-1/3 bg-white rounded-2xl p-4 shadow-sm md:ml-4 mt-4 md:mt-0 md:flex flex-col hidden border border-gray-200 transition">
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
          shadow-lg transform transition-transform duration-300 md:hidden ease-out
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
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
