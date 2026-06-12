import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../Constant";
import { pauseImg, playImg, replayImg } from "../Utils";

const VideoCarousel = () => {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [videoId, setVideoId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [loadVideos, setLoadVideos] = useState(false);
  const [isLastVideo, setIsLastVideo] = useState(false);

  const playActiveVideo = useCallback(async () => {
    const activeVideo = videoRef.current[videoId];
    if (!activeVideo || !isInView) return;

    try {
      await activeVideo.play();
    } catch {
      // Mobile browsers can reject autoplay. The visible play button remains usable.
    }
  }, [isInView, videoId]);

  useEffect(() => {
    const activeSlide = sliderRef.current?.children[videoId];
    if (!activeSlide) return;

    gsap.to(sliderRef.current, {
      x: -activeSlide.offsetLeft,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [videoId]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideos(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "500px" },
    );

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 },
    );

    preloadObserver.observe(carousel);
    visibilityObserver.observe(carousel);

    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const activeVideo = videoRef.current[videoId];
    if (!activeVideo || !loadVideos) return;

    videoRef.current.forEach((videoEl, index) => {
      if (index !== videoId) videoEl?.pause();
    });

    if (isInView) {
      playActiveVideo();
    } else {
      activeVideo.pause();
    }
  }, [videoId, isInView, loadVideos, playActiveVideo]);

  useEffect(() => {
    const progressTrack = videoDivRef.current[videoId];
    const progressBar = videoSpanRef.current[videoId];
    const activeVideo = videoRef.current[videoId];
    if (!progressTrack || !progressBar || !activeVideo) return;

    const updateProgress = () => {
      const progress = activeVideo.duration
        ? (activeVideo.currentTime / activeVideo.duration) * 100
        : 0;

      gsap.set(progressTrack, {
        width: isPlaying ? (window.innerWidth < 1200 ? "10vw" : "4vw") : "12px",
      });
      gsap.set(progressBar, {
        width: `${progress}%`,
        backgroundColor: "#ffffff",
      });
    };

    activeVideo.addEventListener("timeupdate", updateProgress);
    return () => activeVideo.removeEventListener("timeupdate", updateProgress);
  }, [videoId, isPlaying, loadVideos]);

  const handleEnded = () => {
    if (videoId === hightlightsSlides.length - 1) {
      setIsLastVideo(true);
      setIsPlaying(false);
      return;
    }

    setVideoId((current) => current + 1);
  };

  const handleControl = () => {
    if (isLastVideo) {
      videoRef.current.forEach((videoEl) => {
        if (videoEl) videoEl.currentTime = 0;
      });
      setIsLastVideo(false);
      setVideoId(0);
      return;
    }

    const activeVideo = videoRef.current[videoId];
    if (!activeVideo) return;

    if (isPlaying) {
      activeVideo.pause();
      setIsPlaying(false);
    } else {
      playActiveVideo();
    }
  };

  return (
    <>
      <div id="video-carousel" ref={carouselRef} className="flex items-center">
        <div ref={sliderRef} className="carousel-track flex items-center">
          {hightlightsSlides.map((slide, index) => (
            <div key={slide.id} className="carousel-slide">
              <div className="video-carousel_container">
                <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black relative">
                  <video
                    playsInline
                    disablePictureInPicture
                    className="pointer-events-none w-full h-full object-cover"
                    preload={
                      index === videoId
                        ? "auto"
                        : index === videoId + 1
                          ? "metadata"
                          : "none"
                    }
                    muted
                    ref={(element) => (videoRef.current[index] = element)}
                    onCanPlay={() => {
                      if (index === videoId && isInView && !isPlaying) {
                        playActiveVideo();
                      }
                    }}
                    onEnded={handleEnded}
                    onPause={() => {
                      if (index === videoId) setIsPlaying(false);
                    }}
                    onPlay={() => {
                      if (index === videoId) setIsPlaying(true);
                    }}
                  >
                    {loadVideos && <source src={slide.video} type="video/mp4" />}
                  </video>
                </div>

                <div className="absolute top-12 left-[8%] z-10 pointer-events-none select-none">
                  {slide.textLists.map((text) => (
                    <p
                      key={text}
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
          {hightlightsSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show highlight ${index + 1}`}
              className="mx-2 w-2 h-2 bg-zinc-600 rounded-full relative cursor-pointer"
              ref={(element) => (videoDivRef.current[index] = element)}
              onClick={() => {
                setIsLastVideo(false);
                setVideoId(index);
              }}
            >
              <span
                className="absolute h-full w-full rounded-full left-0 top-0"
                ref={(element) => (videoSpanRef.current[index] = element)}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleControl}
          aria-label={isLastVideo ? "Replay" : isPlaying ? "Pause" : "Play"}
          className="p-4 rounded-full bg-zinc-800/30 backdrop-blur-md border border-white/5 flex items-center justify-center hover:bg-zinc-700/40 transition-all duration-300 active:scale-95 shadow-inner cursor-pointer"
        >
          <img
            src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg}
            alt=""
            className="w-4 h-4 object-contain"
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
