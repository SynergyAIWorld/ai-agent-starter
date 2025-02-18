import Link from "next/link";

export default function HeroHomeNew() {
  return (
    <div className="relative h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg-home.png')" }}
      ></div>

      <div
        style={{
          background: `linear-gradient(180deg, rgba(45, 121, 76, 0.00) 0%, #07130C 100%),rgba(7, 19, 12, 0.60)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh", // 你可以根据需要调整高度
        }}
        className="gap-11] absolute inset-0 flex flex-col items-center justify-center"
      >
        <strong className="text-center text-7xl">
          Creating On-chain Digital States
          <br />
          Starting with an AI Westworld Game
        </strong>
        <div className="text-2xl leading-10">
          SynergyAI is an ai native sim game.
        </div>
        <div>
          <Link
            target="_blank"
            href="https://form.typeform.com/to/phB2xzL7"
            style={{ boxShadow: "0px 4px 2px 0px rgba(0, 0, 0, 0.25)" }}
            className="regular flex h-11 w-40 items-center justify-center rounded-full bg-[#16542D] text-[17px]"
          >
            Get started
          </Link>
        </div>
        {/*  */}
        <div className="flex items-center gap-2">
          <span>Coming soon...</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M11.4252 2.80596V2.52654H11.1458H9.4242V0.79126V0.511844H9.14478H1.14062H0.861209V0.79126V8.85006V9.12947H1.14062H2.86225V10.8648V11.1442H3.14166H11.1458H11.4252V10.8648V2.80596ZM9.14478 9.12947H9.4242V8.85006V3.75694H10.1994V9.91377H4.08809V9.12947H9.14478ZM2.08705 7.89907V1.74224H8.19835V7.89907H2.08705Z"
              fill="white"
              stroke="white"
              strokeWidth="0.558832"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
