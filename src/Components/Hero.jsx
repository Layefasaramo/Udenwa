import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../Utils";
import { useRef } from "react";

const Hero = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 1.5 });
    gsap.to("#cta", { opacity: 1, y: 0, delay: 1.5 });
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-media">
        <p id="hero" className="hero-title">
          iPhone 15 Pro
        </p>
        <div className="hero-video-wrap">
          <video
            ref={videoRef}
            className="hero-video pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="metadata"
            onLoadedData={() => {
              videoRef.current?.classList.add("is-ready");
            }}
          >
            <source
              src={smallHeroVideo}
              type="video/mp4"
              media="(max-width: 992px)"
            />
            <source
              src={heroVideo}
              type="video/mp4"
              media="(min-width: 993px)"
            />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="buy-btn">
          Buy
        </a>
        <p className="hero-price">From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;
