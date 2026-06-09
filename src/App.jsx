import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Highlights from "./Components/Highlights";
import Features from "./Components/Features";
import Model from "./Components/Model";
import Footer from "./Components/Footer";
import HowItWorks from "./Components/HowItWorks";

import "./App.css";

function App() {
  return (
    <main className="bg-black min-h-screen w-full relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Model />
      <Highlights />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}

export default App;
