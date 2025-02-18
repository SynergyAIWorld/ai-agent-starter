import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex w-full justify-between rounded-full px-4 py-2 transition duration-200">
          <div>
            <Link
              target="_blank"
              href="https://dexscreener.com/solana/h44fhytcrdq1cjcju3xsrbgzuqjjgns8vm3fpgdrpump"
            >
              Chart
            </Link>
            <Link
              target="_blank"
              href="https://x.com/0xSynergy_AI/status/1886818435839222255"
              className="ml-20"
            >
              Threads
            </Link>
          </div>
          <div className="ml-auto inline-flex items-center gap-9">
            <Link href={"https://x.com/0xSynergy_AI"} target="_blank">
              Twitter
            </Link>
            <Link href={"https://t.me/+hNKXrbEdSUtlNTc0"}>Telegram</Link>
            <Link href={"/"}>Waitlist</Link>
            <Link
              href="/"
              style={{ boxShadow: "0px 4px 2px 0px rgba(0, 0, 0, 0.25)" }}
              className="flex h-11 w-40 items-center justify-center rounded-full bg-[#16542D]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
