import './globals.css';

export const metadata = {
  title: 'Vendi',
  description: 'An AI coworker in your Slack, with full context on your company.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
