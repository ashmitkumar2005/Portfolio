"use client";

import { useState } from "react";
import { Interactive3DCard } from "@/components/ui/3d-card";
import ProjectGlance from "./ProjectGlance";

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

interface WorkGridProps {
    repos: Repo[];
    customImages: Record<string, string>;
    customUrls: Record<string, string>;
    techStacks: Record<string, string[]>;
    projectImages: string[];
}

export default function WorkGrid({ repos, customImages, customUrls, techStacks, projectImages }: WorkGridProps) {
    const [activeProject, setActiveProject] = useState<{ url: string; title: string } | null>(null);

    const handleCardClick = (repo: Repo) => {
        const repoNameLower = repo.name.toLowerCase();
        // Prioritize custom URL, then homepage, then github link
        const previewUrl = customUrls[repoNameLower] || repo.homepage || repo.html_url;
        setActiveProject({ url: previewUrl, title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20 place-items-center">
                {repos.map((repo, index) => {
                    const repoNameLower = repo.name.toLowerCase();
                    return (
                        <Interactive3DCard
                            key={repo.id}
                            title={repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            subtitle={repo.description || "No description available."}
                            imageUrl={customImages[repoNameLower] || projectImages[index % projectImages.length]}
                            techStack={techStacks[repoNameLower] || [repo.language || "code"]}
                            href={repo.html_url}
                            onClick={() => handleCardClick(repo)}
                        />
                    );
                })}
            </div>

            <ProjectGlance
                isOpen={!!activeProject}
                onClose={() => setActiveProject(null)}
                url={activeProject?.url || null}
                title={activeProject?.title || ""}
            />
        </>
    );
}
