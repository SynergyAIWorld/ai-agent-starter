import Image from "next/image";

import Roadmap from "~/app/_components/Roadmap";

const listCard = [
  {
    title: "Character A",
  },
  {
    title: "Character B",
  },
  {
    title: "Character C",
  },
  {
    title: "Character D",
  },
  {
    title: "Character F",
  },
];

export default function HeroContent() {
  return (
    <section className="relative bg-[#07130C]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[580px] items-center justify-center rounded-xl border border-white/20 bg-[#16542D]/45 backdrop-blur-lg">
          <video width="1024" height="960" controls autoPlay loop muted>
            <source src="/v/121_1738403699.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex flex-col items-center justify-center pt-60">
          <div className="text-7xl">Roadmap</div>
          {/*<div className="text-2xl mt-7">*/}
          {/*  One liner - call to action Our product is - xxxxx*/}
          {/*</div>*/}
          <div className="mt-12 flex items-center gap-14">
            <Roadmap />
          </div>
          {/*<div className="mt-32">*/}
          {/*  <svg*/}
          {/*    xmlns="http://www.w3.org/2000/svg"*/}
          {/*    width="135"*/}
          {/*    height="25"*/}
          {/*    viewBox="0 0 135 25"*/}
          {/*    fill="none"*/}
          {/*  >*/}
          {/*    <Link href="/">*/}
          {/*      <g>*/}
          {/*        <path*/}
          {/*          d="M64.4027 19.1281L64.7522 13.8469L74.3604 5.20707C74.7856 4.81998 74.2734 4.63357 73.7106 4.9699L61.8509 12.4492L56.7215 10.8255C55.6215 10.5145 55.6086 9.75145 56.9727 9.20174L76.9501 1.51224C77.864 1.10055 78.7393 1.73672 78.389 3.13517L74.9861 19.1281C74.7485 20.2632 74.06 20.5385 73.1098 20.0142L67.9305 16.194L65.4423 18.6038C65.154 18.8902 64.9157 19.1281 64.4035 19.1281H64.4027Z"*/}
          {/*          fill="white"*/}
          {/*        />*/}
          {/*      </g>*/}
          {/*    </Link>*/}
          {/*    <Link href="/">*/}
          {/*      <g>*/}
          {/*        <path*/}
          {/*          d="M20.0842 1.61475H23.4464L16.1018 9.44528L24.7415 20.1012H17.9763L12.677 13.6386L6.61495 20.1012H3.2496L11.1063 11.7253L2.81738 1.61475H9.75479L14.5436 7.52116L20.0842 1.61475ZM18.9034 18.2248H20.767L8.74159 3.39252H6.74336L18.9034 18.2248Z"*/}
          {/*          fill="white"*/}
          {/*        />*/}
          {/*      </g>*/}
          {/*    </Link>*/}
          {/*    <Link href="/">*/}
          {/*      <g>*/}
          {/*        <path*/}
          {/*          d="M116.41 11.637C115.215 11.637 114.24 10.5638 114.24 9.25102C114.24 7.93711 115.191 6.86395 116.411 6.86395C117.618 6.86395 118.606 7.93711 118.582 9.25102C118.582 10.5638 117.618 11.6358 116.41 11.6358V11.637ZM124.425 11.637C123.23 11.637 122.253 10.5638 122.253 9.25102C122.253 7.93711 123.206 6.86395 124.425 6.86395C125.632 6.86395 126.621 7.93711 126.598 9.25102C126.598 10.5638 125.645 11.6358 124.425 11.6358V11.637ZM118.255 0.822459L117.901 0.183105L117.172 0.303481C115.521 0.575558 113.913 1.06441 112.393 1.75707L112.131 1.87631L111.968 2.11479C108.965 6.49033 108.141 10.8 108.549 15.0325L108.593 15.4946L108.973 15.7672C110.739 17.048 112.713 18.0244 114.809 18.6551L115.717 18.9299L116.996 15.8433C119.191 16.3793 121.628 16.3793 123.822 15.8433L125.094 18.9288L126.002 18.6539C128.1 18.0247 130.074 17.0473 131.841 15.7638L132.217 15.4935L132.263 15.037C132.764 10.1311 131.461 5.85779 128.863 2.10911L128.7 1.87291L128.438 1.7548C126.918 1.06529 125.312 0.57656 123.663 0.30121L122.953 0.184241L122.592 0.799746C122.491 0.970089 122.389 1.16314 122.29 1.35961C121.043 1.23235 119.786 1.23235 118.54 1.35961C118.442 1.16655 118.344 0.981445 118.255 0.821323V0.822459ZM114.335 14.7758C114.562 14.9053 114.801 15.0325 115.036 15.1483L114.52 16.3929C113.125 15.8902 111.8 15.2116 110.581 14.3738C110.322 10.8102 111.055 7.21372 113.527 3.50593C114.571 3.05192 115.658 2.7045 116.773 2.46911C116.842 2.61106 116.906 2.75074 116.959 2.87339L117.273 3.60359L118.068 3.48889C119.627 3.26328 121.211 3.26328 122.769 3.48889L123.562 3.60245L123.875 2.87339C123.929 2.7462 123.992 2.60765 124.059 2.46911C125.182 2.70759 126.269 3.05963 127.309 3.5082C129.464 6.71064 130.551 10.2833 130.235 14.3727C129.015 15.2123 127.69 15.8914 126.293 16.3929L125.782 15.1494C126.018 15.0336 126.257 14.9064 126.486 14.7758C127.049 14.4556 127.655 14.0558 128.041 13.6743L126.57 12.2207C126.383 12.4069 125.969 12.6976 125.447 12.9952C124.937 13.2859 124.43 13.5209 124.106 13.6266C121.804 14.3795 119.017 14.3795 116.713 13.6266C116.39 13.5209 115.884 13.2859 115.373 12.9952C114.851 12.6988 114.438 12.4069 114.249 12.2207L112.778 13.6743C113.165 14.0558 113.771 14.4556 114.334 14.7758H114.335Z"*/}
          {/*          fill="white"*/}
          {/*        />*/}
          {/*      </g>*/}
          {/*    </Link>*/}
          {/*  </svg>*/}
          {/*</div>*/}
          <div className="mt-40 flex w-full justify-between">
            <div>
              Made by Synergy Team
              <br />
              2025
            </div>
            <div className="flex">
              <div>Threads</div>
              {/*<div className="ml-24">*/}
              {/*  Privacy Policy*/}
              {/*  <br />*/}
              {/*  Terms of Service*/}
              {/*</div>*/}
              {/*<div className="ml-9 ">xxx xxx</div>*/}
            </div>
          </div>
          <div className="mt-24 pb-28">
            <div className="text-center text-7xl">Explore your characters!</div>
            <div className="mx-auto mt-24 max-w-6xl overflow-hidden">
              {" "}
              {/* 设置外部容器的高度 */}
              <div className="w-full overflow-auto">
                {" "}
                {/* 使用 h-full 让内部容器填满外部容器 */}
                <div className="animate-scroll flex gap-3">
                  {listCard.map((item, index) => (
                    <div
                      key={index}
                      className="h-[288px] w-[260px] flex-shrink-0 rounded-xl border border-white/20 bg-[#16542D]/45 backdrop-blur-lg"
                    >
                      <Image
                        src={`/c/${index + 1}/4-1.png`}
                        alt={item.title}
                        width={260}
                        height={288}
                      ></Image>
                    </div>
                  ))}
                  {listCard.reverse().map((item, index) => (
                    <div
                      key={index}
                      className="h-[288px] w-[260px] flex-shrink-0 rounded-xl border border-white/20 bg-[#16542D]/45 backdrop-blur-lg"
                    >
                      <Image
                        src={`/c/${index + 1}/4-1.png`}
                        alt={item.title}
                        width={260}
                        height={288}
                      ></Image>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
