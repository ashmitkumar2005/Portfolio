"use client";

import dynamic from "next/dynamic";

const BackgroundParallax = dynamic(() => import("@/components/BackgroundParallax"), {
    ssr: false,
});
const GalaxyBackground = dynamic(() => import("@/components/GalaxyBackground"), {
    ssr: false,
});

export default function BackgroundWrapper() {
    return (
        <>
            <BackgroundParallax />
            <GalaxyBackground />
        </>
    );
}
