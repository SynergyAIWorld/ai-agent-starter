"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const phases = [
  {
    title: "Phase 1",
    content:
      "Chat to win tokens with in-game AI agents. All agents will carry token rewards that can be earned by users. The release of these token rewards will be triggered based on chat content randomly. This gamified airdropping system will incentivize users to play the game actively.",
    color: "#EF4444", // Red
  },
  {
    title: "Phase 2",
    content:
      "AI-controlled events system where users interact with the AI. Players are incentivized to resolve disputes, solve puzzles, and earn rewards as part of the gameplay.",
    color: "#F59E0B", // Yellow
  },
  {
    title: "Phase 3",
    content:
      "Inspired by the Freysa AI ($FAI) team, players will persuade AI agents to hand over their carried tokens. The end goal is to trick the agent into surrendering its tokens to the player.",
    color: "#10B981", // Green
  },
  {
    title: "Phase 4",
    content:
      "Inspired by RimWorld, users will generate and customize parameters for their own AI-driven Western World simulations and operate them independently. We will also be rolling out node code world creator, speaking agent earns you points and influence.",
    color: "#3B82F6", // Blue
  },
];

export default function Roadmap() {
  const [activePhases, setActivePhases] = useState<number[]>([0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhases((prev) => {
        const nextPhase = ((prev[prev.length - 1] ?? 0) + 1) % phases.length;
        return [...prev, nextPhase];
      });
    }, 2000); // Change phase every ~3.3 seconds (1/3 of original 10 seconds)

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="mx-auto max-w-6xl rounded-3xl bg-gray-800 bg-opacity-10 p-8 shadow-2xl backdrop-blur-sm">
        <div className="relative">
          <svg
            className="absolute left-1/2 top-0 h-full w-40 -translate-x-1/2"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
          >
            <path
              d="M50,0 Q75,200 25,400 T50,800"
              fill="none"
              stroke="#4B5563"
              strokeWidth="2"
            />
          </svg>
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              className={`mb-32 flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                <div className="mb-2 flex items-center">
                  <div
                    className={`relative z-10 mr-4 h-8 w-8 rounded-full`}
                    style={{ backgroundColor: phase.color }}
                  >
                    {activePhases.includes(index) && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        style={{ backgroundColor: phase.color, opacity: 0.5 }}
                      />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold">{phase.title}</h2>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    activePhases.includes(index)
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <p>{phase.content}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        className="fixed bottom-8 right-8 cursor-pointer rounded-full bg-blue-500 p-4 text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() =>
          setActivePhases((prev) => {
            const nextPhase =
              ((prev[prev.length - 1] ?? 0) + 1) % phases.length;
            return [...prev, nextPhase];
          })
        }
      >
        <ChevronDown size={24} />
      </motion.div>
    </>
  );
}
