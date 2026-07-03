import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/components/AppContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "SmartPaws Kibble - Máy Cho Thú Cưng Ăn Thông Minh",
  description: "Giải pháp chăm sóc thú cưng tự động, khoa học với camera giám sát AI và cảm biến cân định lượng.",
  openGraph: {
    title: "SmartPaws Kibble - Máy Cho Thú Cưng Ăn Thông Minh",
    description: "Giải pháp chăm sóc thú cưng tự động, khoa học với camera giám sát AI và cảm biến cân định lượng.",
    type: "website",
    locale: "vi_VN",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable}`} data-theme="light">
      <body className={inter.className}>
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
