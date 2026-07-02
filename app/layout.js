import { Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/components/AppContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "SmartPaws PawsFeed AI - Máy Cho Thú Cưng Ăn Thông Minh",
  description: "Giải pháp chăm sóc thú cưng tự động, khoa học với camera giám sát AI và cảm biến cân định lượng.",
  openGraph: {
    title: "SmartPaws PawsFeed AI - Máy Cho Thú Cưng Ăn Thông Minh",
    description: "Giải pháp chăm sóc thú cưng tự động, khoa học với camera giám sát AI và cảm biến cân định lượng.",
    type: "website",
    locale: "vi_VN",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${outfit.variable}`} data-theme="light">
      <body>
        <AppProvider>
          <Header />
          <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
