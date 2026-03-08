export default function AdminPlaceholderPage() {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-gray-100 min-h-[400px]">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <span className="text-4xl">👥</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Clientes</h2>
        <p className="text-gray-500 max-w-md">
          Gestão de clientes e histórico de compras em breve.
        </p>
      </div>
    );
  }
