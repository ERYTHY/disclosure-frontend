export const metadata = {
  title: "Disclosure Signer",
  description: "Live document signing for real estate disclosures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Geist, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
