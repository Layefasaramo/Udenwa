import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ModelView from "./ModelView";
import { useEffect, useRef, useState } from "react";
import { yellowImg } from "../Utils";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "../Constant";
import { animateWithGsapTimeline } from "../Utils/animations";

const Model = () => {
  const dragState = useRef({ pointerId: null, x: 0 });
  const [size, setSize] = useState("small");
  const [model, setModel] = useState({
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
    img: yellowImg,
  });

  // camera control for the model view
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  // model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // rotation
  const smallRotation = useRef(0);
  const largeRotation = useRef(0);

  const tlRef = useRef(gsap.timeline());

  useEffect(() => {
    const timeline = tlRef.current;

    if (size === "large") {
      animateWithGsapTimeline(
        timeline,
        small,
        smallRotation.current,
        "#view1",
        "#view2",
        {
          transform: "translateX(-100%)",
          duration: 2,
        },
      );
    }

    if (size === "small") {
      animateWithGsapTimeline(
        timeline,
        large,
        largeRotation.current,
        "#view2",
        "#view1",
        {
          transform: "translateX(0)",
          duration: 2,
        },
      );
    }
  }, [size]);

  useGSAP(() => {
    gsap.to("#heading", { y: 0, opacity: 1 });
  }, []);

  const getActiveControl = () =>
    size === "small" ? cameraControlSmall.current : cameraControlLarge.current;

  const handlePointerDown = (event) => {
    dragState.current = { pointerId: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (dragState.current.pointerId !== event.pointerId) return;

    const control = getActiveControl();
    const deltaX = event.clientX - dragState.current.x;
    dragState.current.x = event.clientX;

    if (!control || deltaX === 0) return;

    control.setAzimuthalAngle(control.getAzimuthalAngle() - deltaX * 0.01);
    control.update();
  };

  const handlePointerEnd = (event) => {
    if (dragState.current.pointerId !== event.pointerId) return;

    const control = getActiveControl();
    const rotationRef = size === "small" ? smallRotation : largeRotation;
    if (control) rotationRef.current = control.getAzimuthalAngle();

    dragState.current.pointerId = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="standard-section content-section bg-black">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center">
          <div className="model-stage">
            <div
              className="model-drag-zone"
              aria-label="Drag horizontally to rotate the iPhone"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            />
            <ModelView
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={(angle) => {
                smallRotation.current = angle;
              }}
              item={model}
              size={size}
            />

            <ModelView
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={(angle) => {
                largeRotation.current = angle;
              }}
              item={model}
              size={size}
            />

            <Canvas
              className="w-full h-full absolute inset-0"
              dpr={[1, 1.5]}
              frameloop="demand"
              style={{
                overflow: "hidden",
              }}
            >
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container flex gap-3">
                {models.map((item, i) => (
                  <li
                    key={i}
                    className="w-6 h-6 rounded-full cursor-pointer"
                    style={{ backgroundColor: item.color[0] }}
                    onClick={() => setModel(item)}
                  />
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className="size-btn"
                    style={{
                      backgroundColor: size === value ? "white" : "transparent",
                      color: size === value ? "black" : "white",
                    }}
                    onClick={() => setSize(value)}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
