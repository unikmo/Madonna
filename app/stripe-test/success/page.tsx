export default function StripeTestSuccessPage() {
  return (
    <main className="min-h-screen bg-[#FCF9F4] px-5 py-20 text-[#22323A] sm:px-8">
      <div className="mx-auto max-w-[720px] text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Stripe parallel test</p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight sm:text-[46px]">Test payment received.</h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[14px] leading-7 text-[#22323A]/65">
          Stripe returned successfully. The paid-order webhook now handles UNIKMO order creation, key generation and the existing key email.
        </p>
        <a href="/stripe-test" className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">
          Back to Stripe test
        </a>
      </div>
    </main>
  );
}
