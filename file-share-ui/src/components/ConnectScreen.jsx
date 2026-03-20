function ConnectScreen({ address, setAddress, onConnect }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Connect to Server
        </h2>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="192.168.1.10:3000"
          className="w-full border rounded-lg p-2 mb-4"
        />

        <button
          onClick={() => onConnect(address)}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

export default ConnectScreen;
