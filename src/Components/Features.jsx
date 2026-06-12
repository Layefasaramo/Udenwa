import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { animateWithGsap } from "../Utils/animations";
import { explore1Img, explore2Img, exploreVideo } from "../Utils";
import gsap from "gsap";

const Features = () => {
  const videoRef = useRef();
  const videoContainerRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (videoContainerRef.current) observer.observe(videoContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loadVideo) videoRef.current?.load();
  }, [loadVideo]);

  useGSAP(() => {
    gsap.to("#exploreVideo", {
      scrollTrigger: {
        trigger: "#exploreVideo",
        toggleActions: "play pause reverse restart",
        start: "-10% bottom",
      },
      onComplete: () => {
        videoRef.current.play();
      },
    });

    animateWithGsap("#features_title", { y: 0, opacity: 1 });
    animateWithGsap(
      ".g_grow",
      { scale: 1, opacity: 1, ease: "power1" },
      { scrub: 5.5 },
    );
    animateWithGsap(".g_text", {
      y: 0,
      opacity: 1,
      ease: "power2.inOut",
      duration: 1,
    });
  }, []);

  return (
    <section className="story-section content-section bg-zinc-900 relative overflow-hidden">
      <div className="screen-max-width">
        <div className="w-full">
          <h1 id="features_title" className="section-heading">
            Explore the full story.
          </h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="story-title">
            <h2>iPhone.</h2>
            <h2>Forged in titanium.</h2>
          </div>

          <div className="flex-center flex-col w-full">
            <div className="story-video" ref={videoContainerRef}>
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload={loadVideo ? "metadata" : "none"}
                muted
                autoPlay
                loop
                poster={explore1Img}
                ref={videoRef}
              >
                {loadVideo && <source src={exploreVideo} type="video/mp4" />}
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="feature-video-container">
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore1Img}
                    alt="titanium"
                    loading="lazy"
                    className="feature-video g_grow"
                  />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img
                    src={explore2Img}
                    alt="titanium 2"
                    loading="lazy"
                    className="feature-video g_grow"
                  />
                </div>
              </div>

              <div className="feature-text-container">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    iPhone 15 Pro is{" "}
                    <span className="text-white">
                      the first iPhone to feature an aerospace-grade titanium
                      design
                    </span>
                    , using the same alloy that spacecrafts use for missions to
                    Mars.
                  </p>
                </div>

                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Titanium has one of the best strength-to-weight ratios of
                    any metal, making these our{" "}
                    <span className="text-white">
                      lightest Pro models ever.
                    </span>
                    You'll notice the difference the moment you pick one up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
