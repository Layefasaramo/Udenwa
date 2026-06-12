import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Model = lazy(() => import("./Model"));

const DeferredModel = () => {
  const placeholderRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px" },
    );

    if (placeholderRef.current) observer.observe(placeholderRef.current);
    return () => observer.disconnect();
  }, []);

  if (shouldRender) {
    return (
      <Suspense fallback={<div className="model-section-placeholder" />}>
        <Model />
      </Suspense>
    );
  }

  return <div ref={placeholderRef} className="model-section-placeholder" />;
};

export default DeferredModel;
