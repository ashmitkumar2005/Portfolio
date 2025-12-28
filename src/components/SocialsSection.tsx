
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const socials = [
    {
        id: "github",
        name: "GitHub",
        url: "https://github.com/ashmitkumar2005",
        color: "from-gray-600/5 to-gray-900/5",
        glow: "shadow-[0_0_40px_rgba(255,255,255,0.2)]",

        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
        ),
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ashmitkumar2005",
        color: "from-blue-600/5 to-blue-900/5",
        glow: "shadow-[0_0_40px_rgba(37,99,235,0.4)]",

        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        id: "leetcode",
        name: "LeetCode",
        url: "https://leetcode.com/u/ashmitkumar2005/",
        color: "from-yellow-600/5 to-orange-600/5",
        glow: "shadow-[0_0_40px_rgba(234,179,8,0.4)]",

        icon: (
            <svg role="img" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>LeetCode</title>
                <path fill="currentColor" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z" />
                <path fill="currentColor" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 00-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z" />
                <path fill="currentColor" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z" />
            </svg>
        ),
    },
    {
        id: "gfg",
        name: "GeeksforGeeks",
        url: "https://auth.geeksforgeeks.org/user/ashmitkumar2005",
        color: "from-green-600/5 to-emerald-800/5",
        glow: "shadow-[0_0_40px_rgba(21,128,61,0.4)]",

        icon: (
            <svg role="img" viewBox="0 0 48 48" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>GeeksforGeeks</title><path d="M29.035,24C29.014,23.671,29,23.339,29,23c0-6.08,2.86-10,7-10c3.411,0,6.33,2.662,7,7l2,0l0.001-9	L43,11c0,0-0.533,1.506-1,1.16c-1.899-1.066-3.723-1.132-6.024-1.132C30.176,11.028,25,16.26,25,22.92	c0,0.364,0.021,0.723,0.049,1.08h-2.099C22.979,23.643,23,23.284,23,22.92c0-6.66-5.176-11.892-10.976-11.892	c-2.301,0-4.125,0.065-6.024,1.132C5.533,12.506,5,11,5,11l-2.001,0L3,20l2,0c0.67-4.338,3.589-7,7-7c4.14,0,7,3.92,7,10	c0,0.339-0.014,0.671-0.035,1H0v2h1.009c1.083,0,1.977,0.861,1.999,1.943C3.046,29.789,3.224,32.006,4,33c1.269,1.625,3,3,8,3	c5.022,0,9.92-4.527,11-10h2c1.080,5.473,5.978,10,11,10c5,0,6.731-1.375,8-3c0.776-0.994,0.954-3.211,0.992-5.057	C45.014,26.861,45.909,26,46.991,26H48v-2H29.035z M11.477,33.73C9.872,33.73,7.322,33.724,7,32	c-0.109-0.583-0.091-2.527-0.057-4.046C6.968,26.867,7.855,26,8.943,26H19C18.206,30.781,15.015,33.73,11.477,33.73z M41,32	c-0.322,1.724-2.872,1.73-4.477,1.73c-3.537,0-6.729-2.949-7.523-7.73h10.057c1.088,0,1.975,0.867,2,1.954	C41.091,29.473,41.109,31.417,41,32z" /></svg>
        ),
    },
    {
        id: "codechef",
        name: "CodeChef",
        url: "https://www.codechef.com/users/ashmitkumar2005",
        color: "from-amber-700/5 to-yellow-900/5",
        glow: "shadow-[0_0_40px_rgba(180,83,9,0.4)]",

        icon: (
            <svg role="img" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>CodeChef</title>
                <path d="M11.007 0c-.787.031-1.515.37-2.222.685a12.27 12.27 0 01-1.864.703c-.635.176-1.3.354-1.814.788-.222.18-.356.439-.529.662-.309.486-.448 1.067-.457 1.638.036.61.216 1.2.376 1.786.368 1.262.807 2.503 1.197 3.759.366 1.161.703 2.344 1.294 3.416.197.394.35.808.535 1.206.027.067.052.158.142.149.136-.012.243-.115.368-.164.828-.414 1.74-.642 2.655-.749.708-.074 1.43-.078 2.131.054.72.163 1.417.426 2.092.724.36.172.719.348 1.088.498.048.04.135.058.16-.016.219-.327.469-.635.667-.976.495-1.061.522-2.279 1.038-3.331.358-.721.892-1.337 1.266-2.048.175-.266.431-.467.588-.747.437-.669.78-1.398 1.05-2.15.102-.293.172-.612.09-.919-.06-.299-.202-.57-.318-.848a2.481 2.481 0 00-.278-.66c-.407-.676-1.07-1.149-1.743-1.536-1.045-.59-2.196-.969-3.351-1.28A20.733 20.733 0 0011.426.01a5.005 5.005 0 00-.42-.01zm-.889.606c-.261.223-.363.569-.468.883-.168.568-.263 1.163-.207 1.756.064 1.062.197 2.12.33 3.175.18 1.352.387 2.7.677 4.034.026.165.064.347.05.51-.115-.175-.182-.383-.258-.58-.25-.765-.432-1.549-.604-2.334a26.008 26.008 0 01-.562-4.317c-.025-.843-.004-1.726.37-2.501.118-.226.259-.46.48-.597a.411.411 0 01.218-.049l-.026.02zM6.516 1.77c.128 0 .139.159.168.252.266.798.422 1.628.679 2.428.174.649.238 1.323.308 1.991.097 1.039.108 2.085.246 3.12.026.199.082.393.119.59.01.067-.059.049-.083.014-.148-.161-.183-.391-.246-.592-.16-.645-.242-1.305-.334-1.962-.174-1.316-.287-2.64-.529-3.945-.158-.612-.356-1.215-.46-1.838.006-.051.093-.048.132-.058zM4.589 3.607c.229.056.365.268.512.434.4.535.54 1.204.695 1.843.283 1.265.446 2.553.725 3.82.131.666.293 1.326.507 1.971.014.051.035.133.038.17-.233-.43-.393-.896-.565-1.353-.598-1.698-.823-3.496-1.3-5.228-.133-.478-.308-.95-.596-1.358-.047-.088-.08-.204-.037-.297.006-.004.014-.003.02-.002zm12.646 13.196c-.136.007-.31.11-.276.267.094.218.334.308.526.416.441.216.938.29 1.358.546.092.06.149.197.064.287-.18.266-.47.44-.723.634-.372.266-.777.51-1.057.879-.066.107-.041.267.082.32.109.079.243.018.338-.051.518-.294.995-.654 1.478-1.002.32-.239.644-.477.926-.76.085-.135-.03-.274-.118-.371-.273-.285-.62-.487-.965-.67a4.959 4.959 0 00-1.458-.495 1.251 1.251 0 00-.175 0zM5.96 16.83c-.527.134-.997.42-1.474.673-.425.243-.854.496-1.205.841a.699.699 0 00-.172.488c.065.108.2.14.301.206.852.442 1.735.822 2.63 1.168.132.042.265.113.406.107.158-.02.309-.204.213-.356-.146-.243-.42-.361-.65-.506-.547-.303-1.154-.512-1.636-.918-.046-.09.094-.128.142-.18.549-.395 1.229-.593 1.713-1.077.089-.09.164-.259.048-.358-.086-.073-.206-.087-.316-.088zm8.115.793c-.43.027-.835.431-.774.876.032.259.089.525.228.749.12.18.33.286.546.287.273.031.59-.059.726-.318.137-.237.212-.514.205-.787-.038-.46-.466-.845-.93-.807zm-4.49.01c-.464.028-.807.505-.77.953.011.444.315.902.765.994.352.06.71-.19.803-.53.125-.35.132-.761-.044-1.095-.157-.25-.478-.327-.754-.322zm.112.653c.241.064.294.47.045.558-.141.034-.239-.12-.234-.244-.008-.127.05-.287.189-.314zm4.437.143c.097 0 .226.071.19.187-.013.171-.215.333-.377.226-.132-.07-.172-.296-.02-.368a.418.418 0 01.207-.045zm-3.518 2.977c-.553.051-1.044.335-1.542.559-.304.156-.662.312-1.005.187-.377-.12-.707-.35-1.059-.52-.075-.013-.061.077-.047.122.081.53.129 1.102.454 1.55.338.437.902.618 1.433.667.797.072 1.642-.118 2.271-.629.309-.262.571-.631.585-1.049-.006-.324-.244-.596-.524-.734a1.085 1.085 0 00-.566-.153zm2.58.008c-.396.052-.815.262-.972.65-.129.358.034.748.272 1.02.426.509 1.07.793 1.718.884.577.078 1.186.014 1.714-.24.438-.225.767-.655.85-1.142.064-.291.081-.59.124-.884-.066-.078-.148.038-.218.052-.337.142-.647.367-1.01.435-.363.024-.687-.172-1.015-.293-.43-.178-.851-.403-1.315-.478a1.21 1.21 0 00-.147-.004zm-2.881-5.091c-.07 0-.143.014-.216.03a2.93 2.93 0 00-.454.152c-.15.061-.292.127-.407.18a4.07 4.07 0 01-.218.092.277.277 0 01-.182-.034c-.062-.037-.12-.101-.141-.255l-.27.038c.031.218.14.37.27.45.13.079.268.09.378.067.085-.018.16-.058.276-.111.116-.053.255-.118.397-.176.143-.058.288-.11.41-.138a.52.52 0 01.252-.009c.14.06.19.13.215.179.025.05.03.067.03.067l.263-.06s.002-.024-.05-.128a.678.678 0 00-.35-.307.482.482 0 00-.204-.037z" />
            </svg>
        ),
    },
];

export default function SocialsSection() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [githubStats, setGithubStats] = useState<{ total: number; currentYear: number; contributions: { date: string; level: number }[] } | null>(null);

    // LeetCode Terminal State
    const [leetCodeLine, setLeetCodeLine] = useState(0);
    const leetCodeLines = [
        "> Connecting to LeetCode API...",
        "> Authenticating user...",
        "> Fetching problem sets...",
        "> Calculating efficiency...",
        "> User found: ashmitkumar...",
        "> Stats coming soon_"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLeetCodeLine(prev => (prev + 1) % leetCodeLines.length);
        }, 1500); // Change line every 1.5s
        return () => clearInterval(interval);
    }, [leetCodeLines.length]);

    useEffect(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/ashmitkumar2005?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data?.total) {
                    const currentYear = new Date().getFullYear();
                    const total = (Object.values(data.total) as number[]).reduce((a: number, b: number) => a + b, 0);
                    const currentYearCount = data.total[currentYear] || 0;

                    // Get last ~126 days (18 weeks) for the heatmap
                    const contributions = data.contributions?.slice(-126) || [];

                    setGithubStats({ total, currentYear: currentYearCount, contributions });
                }
            })
            .catch(err => console.error("Failed to fetch GitHub stats", err));
    }, []);

    return (
        <section id="arena" className="w-full py-24 px-4 flex flex-col items-center justify-center relative z-20">
            {/* ... (header code remains same) */}
            <div className="mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Arena</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    My digital footprint across various platforms.
                </p>
            </div>

            {/* Mobile View: 2-Column Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md md:hidden">
                {socials.map((social, index) => {
                    const isLastAndOdd = index === socials.length - 1 && socials.length % 2 !== 0;
                    const isNonClickable = ["leetcode", "codechef", "gfg"].includes(social.id);
                    const Container = isNonClickable ? "div" : "a";
                    const containerProps = isNonClickable ? {} : {
                        href: social.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        "aria-label": `Visit my ${social.name} profile`
                    };

                    return (
                        <Container
                            key={social.id}
                            {...containerProps}
                            className={`group relative rounded-3xl bg-transparent backdrop-blur-sm overflow-hidden ${!isNonClickable ? "cursor-pointer" : ""} transition-all duration-300 ${social.glow.replace("group-hover:", "")} ${isLastAndOdd ? "col-span-2 aspect-[2/1]" : "aspect-square"
                                }`}
                        >
                            {/* Background Gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-b ${social.color} opacity-100 transition-opacity duration-500`}
                            />

                            {/* Content Container */}
                            <div className="relative h-full w-full flex flex-col items-center justify-center p-4 gap-3">
                                {/* Icon */}
                                <div className="text-white scale-110 transition-all duration-300">
                                    {social.icon}
                                </div>

                                {/* Text Label */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-bold text-white text-center leading-tight">
                                        {social.name}
                                    </span>
                                    {social.id === "github" && githubStats && (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gray-300 text-center leading-tight opacity-80">
                                                {githubStats.currentYear} Contributions made this year
                                                <br />
                                                {githubStats.total} Total contributions made
                                            </span>

                                            {/* Contribution Graph (Mobile - Last 5 weeks) */}
                                            <div className="flex gap-[2px] mt-1">
                                                {githubStats.contributions.slice(-35).map((day, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 h-1 rounded-[1px] bg-white transition-opacity duration-300"
                                                        style={{ opacity: day.level === 0 ? 0.1 : 0.2 + (day.level * 0.2) }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {social.id === "linkedin" && (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gray-300 text-center leading-tight opacity-80">
                                                1,247 Followers
                                                <br />
                                                245 Profile views
                                            </span>
                                            {/* Mobile Sparkline */}
                                            <svg width="60" height="20" viewBox="0 0 60 20" className="opacity-50">
                                                <path
                                                    d="M0 15 Q10 18 20 12 T40 8 T60 2"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    {social.id === "leetcode" && (
                                        <div className="flex flex-col items-center gap-1 w-full px-2">
                                            <div className="font-mono text-[10px] text-green-400/80 text-left w-full overflow-hidden whitespace-nowrap">
                                                {leetCodeLines[leetCodeLine]}
                                                <span className="animate-pulse">_</span>
                                            </div>
                                        </div>
                                    )}
                                    {social.id === "gfg" && (
                                        <span className="text-[10px] text-gray-300 text-center leading-tight opacity-80">
                                            Compiling success stories...
                                            <br />
                                            Dashboard in progress ⚡
                                        </span>
                                    )}
                                    {social.id === "codechef" && (
                                        <span className="text-[10px] text-gray-300 text-center leading-tight opacity-80">
                                            Cooking up top-tier code...
                                            <br />
                                            Kitchen opening soon 👨‍🍳
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Container>
                    );
                })}
            </div>

            {/* Desktop View: Expanding Flex Row */}
            <div className="hidden md:flex w-full max-w-5xl h-[400px] gap-4">
                {socials.map((social) => {
                    const isNonClickable = ["leetcode", "codechef", "gfg"].includes(social.id);
                    const Container = isNonClickable ? motion.div : motion.a;
                    const containerProps = isNonClickable ? {} : {
                        href: social.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        "aria-label": `Visit my ${social.name} profile`
                    };

                    return (
                        <Container
                            key={social.id}
                            {...containerProps}
                            className={`group relative flex-1 rounded-3xl bg-transparent backdrop-blur-sm overflow-hidden ${!isNonClickable ? "cursor-pointer" : "cursor-default"} transition-all duration-500 ease-out ${social.glow}`}
                            onMouseEnter={() => setHovered(social.id)}
                            onMouseLeave={() => setHovered(null)}
                            layout
                            style={{
                                flexGrow: hovered === social.id ? 3 : 1,
                            }}
                        >
                            {/* Background Gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-b ${social.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            {/* Content Container */}
                            <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
                                {/* Icon */}
                                <motion.div
                                    layout="position"
                                    className={`group-hover:text-white group-hover:scale-125 transition-all duration-500 mb-4 ${hovered === "github" && social.id === "github" ? "text-white scale-125 -translate-y-8" : "text-white/80"
                                        }`}
                                >
                                    {social.icon}
                                </motion.div>

                                {/* Text Label & Expanded Content */}
                                <div className="relative overflow-hidden w-full flex justify-center">
                                    <AnimatePresence mode="wait">
                                        {hovered === social.id ? (
                                            <motion.div
                                                key="expanded"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="flex flex-col items-center gap-1"
                                            >
                                                <span className="text-2xl font-bold text-white whitespace-nowrap">
                                                    {social.name}
                                                </span>
                                                {social.id === "github" && githubStats && (
                                                    <div className="flex flex-col items-center gap-4 mt-2">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm text-gray-300 whitespace-nowrap">
                                                                {githubStats.currentYear} Contributions made this year
                                                            </span>
                                                            <span className="text-sm text-gray-300 whitespace-nowrap">
                                                                {githubStats.total} Total contributions made
                                                            </span>
                                                        </div>

                                                        {/* Contribution Graph (Desktop - Last 18 weeks) */}
                                                        <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                                                            {githubStats.contributions.map((day, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ opacity: 0, scale: 0 }}
                                                                    animate={{ opacity: day.level === 0 ? 0.1 : 0.2 + (day.level * 0.2), scale: 1 }}
                                                                    transition={{ delay: i * 0.005 }}
                                                                    className="w-2.5 h-2.5 rounded-[2px] bg-white"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {social.id === "linkedin" && (
                                                    <div className="flex flex-col items-center gap-1 mt-2">
                                                        <span className="text-sm text-gray-300 whitespace-nowrap">
                                                            1,247 Followers
                                                        </span>
                                                        <span className="text-sm text-gray-300 whitespace-nowrap">
                                                            245 Profile views (90d)
                                                        </span>
                                                        {/* Desktop Sparkline */}
                                                        <div className="mt-2 opacity-60">
                                                            <svg width="100" height="30" viewBox="0 0 100 30">
                                                                <defs>
                                                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                                                                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                                                                    </linearGradient>
                                                                </defs>
                                                                <path
                                                                    d="M0 25 Q20 28 35 15 T70 12 T100 2"
                                                                    fill="none"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                                <path
                                                                    d="M0 25 Q20 28 35 15 T70 12 T100 2 V30 H0 Z"
                                                                    fill="url(#growthGradient)"
                                                                    stroke="none"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {social.id === "leetcode" && (
                                                    <div className="flex flex-col items-center gap-2 mt-4 px-4 py-2 bg-black/40 rounded-lg border border-white/10 w-full max-w-[200px]">
                                                        <div className="font-mono text-xs text-green-400 w-full text-left">
                                                            <span className="text-gray-500 mr-2">$</span>
                                                            {leetCodeLines[leetCodeLine]}
                                                            <span className="animate-pulse">_</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {social.id === "gfg" && (
                                                    <div className="flex flex-col items-center gap-1 mt-2">
                                                        <span className="text-sm text-gray-300 whitespace-nowrap italic">
                                                            Compiling success stories...
                                                        </span>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            Dashboard in progress ⚡
                                                        </span>
                                                        {/* Pulse Animation */}
                                                        <div className="flex gap-1 mt-2">
                                                            {[0, 1, 2].map((i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    className="w-1.5 h-1.5 rounded-full bg-green-500/50"
                                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {social.id === "codechef" && (
                                                    <div className="flex flex-col items-center gap-1 mt-2">
                                                        <span className="text-sm text-gray-300 whitespace-nowrap italic">
                                                            Cooking up top-tier code...
                                                        </span>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            Kitchen opening soon 👨‍🍳
                                                        </span>
                                                        {/* Bounce Animation */}
                                                        <div className="flex gap-1 mt-2">
                                                            <motion.div
                                                                className="w-2 h-2 rounded-full bg-amber-600/50"
                                                                animate={{ y: [0, -5, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.span
                                                key="collapsed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm font-medium text-gray-400 writing-vertical-rl rotate-180 absolute left-1/2 -translate-x-1/2 top-12"
                                            >
                                                {social.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>


                            </div>
                        </Container>
                    );
                })}
            </div>
        </section>
    );
}
