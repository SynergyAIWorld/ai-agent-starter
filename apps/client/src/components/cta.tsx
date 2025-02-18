export default function Cta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center"
          data-aos="zoom-y-out"
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-56 w-[480px] rounded-full border-blue-500 blur-3xl" />
          </div>
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-200 md:text-4xl">
              Our product is - Game AI Agent
            </h2>
            <h3 className="mb-6 text-2xl font-bold text-gray-200 md:mb-12 md:text-2xl">
              One liner - call to action Our product is - Game AI Agent
            </h3>
            <div className="flex items-center justify-center gap-4">
              <a
                className="btn group mb-4 h-10 w-full rounded-full border border-white bg-gradient-to-t from-gray-600 to-gray-500 pl-6 pr-6 sm:mb-0 sm:w-auto"
                href="/agent"
              >
                <span className="relative inline-flex items-center">
                  play demo?
                </span>
              </a>
              <a
                className="btn group mb-4 h-10 w-full rounded-full border border-white bg-gradient-to-t from-gray-600 to-gray-500 pl-6 pr-6 sm:mb-0 sm:w-auto"
                href="/agent"
              >
                <span className="relative inline-flex items-center">
                  Buy on
                  <br />
                  Jupiter
                </span>
              </a>
              <a
                className="btn group mb-4 h-10 w-full rounded-full border border-white bg-gradient-to-t from-gray-600 to-gray-500 pl-6 pr-6 sm:mb-0 sm:w-auto"
                href="/agent"
              >
                <span className="relative inline-flex items-center">
                  Buy on
                  <br />
                  xx
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
