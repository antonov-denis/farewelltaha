import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Envelope from "./components/Envelope";
import CardSlides from "./components/CardSlides";

function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#fcd0b1] overflow-hidden">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Envelope onOpened={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0, scale: 1.02, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <CardSlides />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
