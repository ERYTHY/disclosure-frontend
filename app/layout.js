// Polyfill for Promise.withResolvers (Node 20+ fallback)
if (!Promise.withResolvers) {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

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
