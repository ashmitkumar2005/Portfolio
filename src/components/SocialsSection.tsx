"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const socials = [
    {
        id: "leetcode",
        name: "LeetCode",
        url: "https://leetcode.com/u/ashmitkumar2005/",
        color: "from-yellow-600/20 to-orange-600/20",
        glow: "group-hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]",
        border: "group-hover:border-yellow-500/50",
        icon: (
            <svg role="img" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>LeetCode</title><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.843 5.843 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-1.083-1.031-2.411-1.606-3.827-1.606-1.028 0-2.043.303-2.984.876zM4.764 12.358c.018-.002.037-.009.056-.013.067-.017.135-.032.203-.045.071-.013.143-.025.215-.034.08-.01.16-.017.241-.022.083-.005.166-.008.249-.008.082.001.165.006.248.014.085.009.169.021.253.037.081.016.162.035.242.057.078.022.155.047.232.075.076.028.151.059.225.093.076.035.15.074.223.116.069.04.137.083.204.128.068.046.134.095.199.146.062.049.123.101.182.155.06.054.118.111.175.169.055.057.108.116.16.177.051.06.1.122.147.185.045.061.088.124.13.189.041.063.08.128.116.194.035.064.068.13.099.197.03.065.058.131.084.199.024.066.047.133.067.201.02.066.038.134.053.202.015.067.028.134.038.202.01.067.017.135.022.203.005.067.008.135.008.203 0 .068-.003.135-.008.203-.005.067-.012.135-.022.202-.01.068-.023.135-.038.202-.015.068-.033.136-.053.202-.02.068-.043.135-.067.201-.026.068-.054.134-.084.199-.031.067-.064.133-.099.197-.036.065-.075.13-.116.194-.042.065-.085.128-.13.189-.047.063-.096.125-.147.185-.052.061-.105.12-.16.177-.057.058-.115.115-.175.169-.059.054-.12.106-.182.155-.065.051-.131.1-.199.146-.067.045-.135.088-.204.128-.073.042-.147.081-.223.116-.074.034-.149.065-.225.093-.077.028-.154.053-.232.075-.08.022-.161.041-.242.057-.084.016-.168.028-.253.037-.083.008-.166.013-.248.014-.083 0-.166-.003-.249-.008-.081-.005-.161-.012-.241-.022-.072-.009-.144-.021-.215-.034-.068-.013-.136-.028-.203-.045a1.38 1.38 0 0 0-.056-.013l-.006-.002a1.368 1.368 0 0 0-1.63 2.146c.211.16.438.301.678.42.253.125.52.23.797.312.288.085.588.145.896.178.318.034.643.043.97.027.338-.016.678-.058 1.013-.124.346-.069.686-.163 1.015-.281.336-.121.663-.267.978-.436.319-.172.626-.368.918-.587.294-.221.574-.465.837-.731.263-.266.509-.55.734-.848.224-.298.429-.613.612-.942.181-.328.341-.67.477-1.026.134-.354.245-.72.332-1.093.085-.371.146-.753.181-1.141.033-.386.041-.78.024-1.178-.017-.396-.059-.797-.125-1.194-.067-.395-.16-.785-.278-1.166-.117-.379-.259-.75-.423-1.112-.163-.36-.35-.71-.558-1.048-.207-.336-.437-.66-.688-.969-.25-.307-.521-.6-.811-.877-.289-.276-.598-.535-.924-.775-.325-.238-.667-.458-1.023-.658-.354-.199-.723-.378-1.106-.536-.381-.157-.775-.291-1.181-.402-.403-.11-.817-.196-1.24-.258-.421-.061-.851-.098-1.288-.111-.435-.013-.878.001-1.326.041-.446.04-.898.107-1.353.201a1.366 1.366 0 0 0-.964 1.625 1.383 1.383 0 0 0 1.629.96c.214-.044.427-.076.638-.095.207-.019.412-.026.615-.02.202.006.401.023.597.052.193.029.383.069.568.12.183.051.362.113.537.185.172.072.339.154.501.245.16.09.315.19.464.298.147.107.288.223.422.348.132.123.258.255.377.395.118.139.228.286.331.44.101.152.194.31.279.474.083.162.158.329.224.5.065.17.121.344.168.522.046.176.083.356.111.538.027.181.045.365.053.551.008.185.006.372-.006.559-.013.186-.036.373-.069.559-.034.185-.078.369-.132.551-.055.18-.12.358-.195.533-.076.174-.162.345-.258.512-.097.166-.203.328-.319.485-.117.156-.243.307-.378.453-.136.145-.281.284-.435.417-.155.132-.319.258-.492.377-.174.119-.357.231-.549.336-.193.104-.396.201-.607.29-.213.088-.435.169-.666.242-.232.072-.473.136-.722.192-.25.055-.509.101-.776.138-.268.036-.545.063-.831.08-.288.017-.584.024-.889.021-.306-.003-.62-.016-.943-.039-.324-.023-.657-.056-.999-.099a1.385 1.385 0 0 0-1.547 1.189 1.366 1.366 0 0 0 1.185 1.543z" /></svg>
        ),
    },
    {
        id: "codechef",
        name: "CodeChef",
        url: "https://www.codechef.com/users/ashmitkumar2005",
        color: "from-amber-700/20 to-yellow-900/20",
        glow: "group-hover:shadow-[0_0_40px_rgba(180,83,9,0.4)]",
        border: "group-hover:border-amber-600/50",
        icon: (
            <svg role="img" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>CodeChef</title><path d="M12.004 0C5.378 0 0 5.373 0 12c0 6.623 5.378 12 12.004 12 6.623 0 11.996-5.377 11.996-12 0-6.627-5.373-12-11.996-12zm6.273 17.584c-.452.418-.949.77-1.48 1.05-1.41.745-3.033.918-4.56.486-1.527-.432-2.822-1.46-3.638-2.887-.816-1.428-.99-3.16-.487-4.73.503-1.57 1.63-2.83 3.167-3.54 1.536-.71 3.29-.68 4.805.083.52.262 1.01.6 1.455 1.004l1.608-1.89c-.71-.645-1.503-1.173-2.358-1.568-2.28-1.053-4.94-.96-7.14.25-2.2 1.21-3.766 3.32-4.204 5.66-.438 2.34.25 4.77 1.847 6.52 1.597 1.75 3.935 2.58 6.275 2.23 1.17-.175 2.28-.62 3.25-1.303.97-.683 1.78-1.59 2.36-2.65l-1.99-1.34c-.28.62-.65 1.18-1.1 1.68z" /></svg>
        ),
    },
    {
        id: "gfg",
        name: "GeeksforGeeks",
        url: "https://auth.geeksforgeeks.org/user/ashmitkumar2005",
        color: "from-green-600/20 to-emerald-800/20",
        glow: "group-hover:shadow-[0_0_40px_rgba(21,128,61,0.4)]",
        border: "group-hover:border-green-500/50",
        icon: (
            <svg role="img" viewBox="0 0 48 48" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>GeeksforGeeks</title><path d="M29.035,24C29.014,23.671,29,23.339,29,23c0-6.08,2.86-10,7-10c3.411,0,6.33,2.662,7,7l2,0l0.001-9	L43,11c0,0-0.533,1.506-1,1.16c-1.899-1.066-3.723-1.132-6.024-1.132C30.176,11.028,25,16.26,25,22.92	c0,0.364,0.021,0.723,0.049,1.08h-2.099C22.979,23.643,23,23.284,23,22.92c0-6.66-5.176-11.892-10.976-11.892	c-2.301,0-4.125,0.065-6.024,1.132C5.533,12.506,5,11,5,11l-2.001,0L3,20l2,0c0.67-4.338,3.589-7,7-7c4.14,0,7,3.92,7,10	c0,0.339-0.014,0.671-0.035,1H0v2h1.009c1.083,0,1.977,0.861,1.999,1.943C3.046,29.789,3.224,32.006,4,33c1.269,1.625,3,3,8,3	c5.022,0,9.92-4.527,11-10h2c1.08,5.473,5.978,10,11,10c5,0,6.731-1.375,8-3c0.776-0.994,0.954-3.211,0.992-5.057	C45.014,26.861,45.909,26,46.991,26H48v-2H29.035z M11.477,33.73C9.872,33.73,7.322,33.724,7,32	c-0.109-0.583-0.091-2.527-0.057-4.046C6.968,26.867,7.855,26,8.943,26H19C18.206,30.781,15.015,33.73,11.477,33.73z M41,32	c-0.322,1.724-2.872,1.73-4.477,1.73c-3.537,0-6.729-2.949-7.523-7.73h10.057c1.088,0,1.975,0.867,2,1.954	C41.091,29.473,41.109,31.417,41,32z" /></svg>
        ),
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ashmitkumar2005",
        color: "from-blue-600/20 to-blue-900/20",
        glow: "group-hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]",
        border: "group-hover:border-blue-500/50",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        id: "github",
        name: "GitHub",
        url: "https://github.com/ashmitkumar2005",
        color: "from-gray-600/20 to-gray-900/20",
        glow: "group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
        border: "group-hover:border-white/50",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
        ),
    },
];

export default function SocialsSection() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <section id="arena" className="w-full py-24 px-4 flex flex-col items-center justify-center relative z-20">
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
                    return (
                        <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 ${social.border.replace("group-hover:", "")} ${social.glow.replace("group-hover:", "")} ${isLastAndOdd ? "col-span-2 aspect-[2/1]" : "aspect-square"
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
                                <span className="text-sm font-bold text-white text-center leading-tight">
                                    {social.name}
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Desktop View: Expanding Flex Row */}
            <div className="hidden md:flex w-full max-w-5xl h-[400px] gap-4">
                {socials.map((social) => (
                    <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative flex-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500 ease-out ${social.border} ${social.glow}`}
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
                                className="text-white/80 group-hover:text-white group-hover:scale-125 transition-all duration-500 mb-4"
                            >
                                {social.icon}
                            </motion.div>

                            {/* Text Label */}
                            <div className="relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {hovered === social.id ? (
                                        <motion.span
                                            key="expanded"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="text-2xl font-bold text-white whitespace-nowrap"
                                        >
                                            {social.name}
                                        </motion.span>
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

                            {/* Arrow Icon (Only visible on hover) */}
                            <motion.div
                                className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                                initial={{ x: -10 }}
                                animate={{ x: hovered === social.id ? 0 : -10 }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </motion.div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
