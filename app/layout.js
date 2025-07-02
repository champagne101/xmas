import { Open_Sans } from "next/font/google";
import "./globals.css";
import { TransactionsProvider } from "./context/TransactionContext";

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
      <body className="font-sans antialiased">
        <TransactionsProvider>
          {children}
        </TransactionsProvider>
      </body>
    </html>
  );
}
