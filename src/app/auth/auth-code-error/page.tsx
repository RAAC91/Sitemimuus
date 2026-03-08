import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">Erro de Autenticação</h1>
        <p className="text-gray-400 mb-8">
          Houve um problema ao conectar com o Google. Isso pode acontecer se você cancelou o login ou se a sessão expirou.
        </p>

        <Link 
          href="/login"
          className="block w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Tentar Novamente
        </Link>
      </div>
    </div>
  );
}
