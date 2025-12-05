import ProjectMarquee from "./ProjectMarquee";

type Repo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    fork: boolean;
    updated_at: string;
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
        // Filter out forks and sort by stars (descending) then updated_at
        return repos
            .filter((repo) => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
    } catch (error) {
        console.error("Error fetching repos:", error);
        return [];
    }
}

export default async function WorkSection() {
    const repos = await getRepos();

    return (
        <section id="work" className="relative z-10 w-full py-24 sm:py-32 overflow-hidden">
            <div className="w-full">
                <div className="flex flex-col items-center text-center mb-16 px-4">
                    <span className="text-sm font-medium text-blue-400 tracking-widest uppercase mb-3">
                        My Work
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Featured Projects
                    </h2>
                </div>

                <ProjectMarquee repos={repos} />
            </div>
        </section>
    );
}
