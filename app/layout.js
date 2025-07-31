import { Open_Sans } from "next/font/google";
import "./globals.css";
import { TransactionsProvider } from "./context/TransactionContext";
import { Navbar } from "./components";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: "OffConnectX",
  description: "offconnectx web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="font-sans antialiased bg-[#d8dede] text-[#346f8f] dark:bg-[#244f6b] dark:text-[#fafcfe]">
        <TransactionsProvider>
          <Navbar />
          {children}
        </TransactionsProvider>
      </body>
    </html>
  );
}
