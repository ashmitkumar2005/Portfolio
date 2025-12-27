import { Interactive3DCard } from "@/components/ui/3d-card";

type Repo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    fork: boolean;
    archived: boolean;
    updated_at: string;
    homepage: string | null;
};

// Abstract tech/coding backgrounds from Unsplash
const PROJECT_IMAGES = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", // Coding code
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cyberpunk terminal
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", // Hardware/Chip
    "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2074&auto=format&fit=crop", // Abstract dark
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop", // Neon
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop", // Matrix-like
];

// Custom preview images for specific projects
const CUSTOM_IMAGES: Record<string, string> = {
    "rivone": "/github/rivone.png",
    "rivault": "/github/rivault.png",
    "portfolio": "/github/portfolio.png",
    "freqcast": "/github/freqcast.png",
};

// Custom preview URLs for specific projects (if they differ from GitHub homepage)
const CUSTOM_URLS: Record<string, string> = {
    "rivone": "https://rivone.pages.dev",
    "rivault": "https://rivault.pages.dev",
    "portfolio": "https://ashmit-kumar.vercel.app",
    "freqcast": "https://freqcast.vercel.app",
};

async function getRepos() {
    try {
        const res = await fetch(
            "https://api.github.com/users/ashmitkumar2005/repos?sort=updated&per_page=100",
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!res.ok) {
            throw new Error("Failed to fetch repositories");
        }

        const repos: Repo[] = await res.json();

        // Custom priority order (Case insensitive)
        const PRIORITY_ORDER = ["rivone", "rivault", "portfolio", "freqcast"];

        // Filter out forks, archived repos, and the special profile README repo
        return repos
            .filter((repo) => !repo.fork && !repo.archived && repo.name !== "ashmitkumar2005")
            .sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                const indexA = PRIORITY_ORDER.indexOf(nameA);
                const indexB = PRIORITY_ORDER.indexOf(nameB);

                // If both are in priority list, sort by index
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;

                // If only A is in priority list, it comes first
                if (indexA !== -1) return -1;

                // If only B is in priority list, it comes first
                if (indexB !== -1) return 1;

                // Fallback: Sort by stars (descending)
                return b.stargazers_count - a.stargazers_count;
            })
            .slice(0, 6);
    } catch (error) {
        console.error("Error fetching repos:", error);
        return [];
    }
}

import WorkGrid from "./WorkGrid";

export default async function WorkSection() {
    const repos = await getRepos();

    return (
        <section id="work" className="relative z-10 w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8">
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16 px-4">
                    <span className="text-sm font-medium text-blue-400 tracking-widest uppercase mb-3">
                        My Work
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Featured Projects
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        A selection of my open-source contributions and technical experiments.
                    </p>
                </div>

                <WorkGrid
                    repos={repos}
                    customImages={CUSTOM_IMAGES}
                    customUrls={CUSTOM_URLS}
                    projectImages={PROJECT_IMAGES}
                />
            </div>
        </section>
    );
}
