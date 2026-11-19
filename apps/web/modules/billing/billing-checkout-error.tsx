import { Button } from "@rondevu/ui/components/button";

export function BillingCheckoutError(props: {
  title: string;
  description: string;
  retryLabel: string;
  retryHref: string;
  contactLabel: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-default px-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-subtle bg-default p-6">
        <h1 className="font-semibold text-emphasis text-xl">{props.title}</h1>
        <p className="text-default text-sm">{props.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={props.retryHref} color="primary">
            {props.retryLabel}
          </Button>
          <Button href="/plan-bilgi" color="secondary">
            {props.contactLabel}
          </Button>
        </div>
      </div>
    </main>
  );
}
