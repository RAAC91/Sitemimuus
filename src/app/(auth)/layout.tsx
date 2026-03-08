import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="fixed top-0 w-full z-10">
        <Header />
      </div>
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
