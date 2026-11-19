export function BookingsPausedNotice(props: { title: string; description: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-default px-4">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-xl border border-subtle bg-default p-6 text-center">
        <h1 className="font-semibold text-emphasis text-xl">{props.title}</h1>
        <p className="text-default text-sm">{props.description}</p>
      </div>
    </main>
  );
}
