import "./globals.css";

export const metadata = {
  title: "URL Shortener",
  description: "Shorten your long URLs instantly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
