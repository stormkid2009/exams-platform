import Header from "src/components/header";
import Footer from "src/components/footer";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-300 text-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
