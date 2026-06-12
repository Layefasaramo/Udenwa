import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../Constant";
import { pauseImg, playImg, replayImg } from "../Utils";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const carouselRef = useRef(null);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const [loadVideos, setLoadVideos] = useState(false);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    const slides = gsap.utils.toArray("#slider > div");
    const activeSlide = slides[videoId];

    if (activeSlide) {
      gsap.to("#slider", {
        x: -activeSlide.offsetLeft,
        duration: 2,
        ease: "power2.inOut",
      });
    }

    gsap.to("#video-carousel", {
      scrollTrigger: {
        trigger: "#video-carousel",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    let animUpdate;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                    ? "10vw"
                    : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "#ffffff",
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#424245",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      animUpdate = () => {
        if (videoRef.current[videoId]) {
          anim.progress(
            videoRef.current[videoId].currentTime /
              hightlightsSlides[videoId].videoDuration,
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }

    return () => {
      if (animUpdate) {
        gsap.ticker.remove(animUpdate);
      }
    };
  }, [videoId, startPlay, isPlaying]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        startPlay && videoRef.current[videoId]?.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideos(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loadVideos) {
      videoRef.current.forEach((videoEl) => videoEl?.load());
    }
  }, [loadVideos]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div id="video-carousel" ref={carouselRef} className="flex items-center">
        <div id="slider" className="carousel-track flex items-center">
          {hightlightsSlides.map((list, i) => (
            <div key={list.id} className="carousel-slide">
              <div className="video-carousel_container">
                <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-zinc-900 relative">
                  <video
                    playsInline={true}
                    className="pointer-events-none w-full h-full object-cover"
                    preload={
                      loadVideos
                        ? i === videoId
                          ? "auto"
                          : "metadata"
                        : "none"
                    }
                    muted
                    ref={(el) => (videoRef.current[i] = el)}
                    onEnded={() =>
                      i !== 3
                        ? handleProcess("video-end", i)
                        : handleProcess("video-last")
                    }
                    onPlay={() =>
                      setVideo((pre) => ({ ...pre, isPlaying: true }))
                    }
                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  >
                    {loadVideos && <source src={list.video} type="video/mp4" />}
                  </video>
                </div>

                <div className="absolute top-12 left-[8%] z-10 pointer-events-none select-none">
                  {list.textLists.map((text, i) => (
                    <p
                      key={i}
                      className="md:text-2xl text-xl font-medium tracking-tight leading-normal text-zinc-200"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center w-full mt-12 gap-5">
        <div className="flex items-center py-4 px-6 bg-zinc-800/30 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
          {hightlightsSlides.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-2 h-2 bg-zinc-600 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full left-0 top-0"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button
          onClick={
            isLastVideo
              ? () => handleProcess("video-reset")
              : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
          }
          className="p-4 rounded-full bg-zinc-800/30 backdrop-blur-md border border-white/5 flex items-center justify-center hover:bg-zinc-700/40 transition-all duration-300 active:scale-95 shadow-inner cursor-pointer"
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            className="w-4 h-4 object-contain"
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
