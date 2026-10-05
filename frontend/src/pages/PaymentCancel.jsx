import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function PaymentCancel() {
  return (
    <>
      <SEO title="Checkout cancelled" description="Your HoneyPot Studio checkout was cancelled." path="/payment/cancel" noIndex />
      <Navbar />
      <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center px-6 py-32" data-testid="payment-cancel-page">
        <section className="w-full border border-white/10 bg-white/[0.02] p-8 sm:p-12">
          <h1 className="font-display text-3xl font-bold" data-testid="payment-cancel-heading">Checkout cancelled</h1>
          <p className="mt-4 text-zinc-400">Nothing was charged. A quick conversation is still the best way to make sure the package fits.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/#buy-website" className="inline-flex items-center gap-2 text-cyan-300" data-testid="payment-return-packages-link"><ArrowLeft className="h-4 w-4" /> Return to packages</Link>
            <a href="/#contact" className="inline-flex items-center gap-2 text-fuchsia-300" data-testid="payment-cancel-contact-link"><MessageCircle className="h-4 w-4" /> Contact us first</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}