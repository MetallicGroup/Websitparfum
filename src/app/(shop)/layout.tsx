import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="layout-container">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
