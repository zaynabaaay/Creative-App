export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-paper px-5 py-10">
      <div className="w-full max-w-[400px]">{children}</div>
    </main>
  );
}
