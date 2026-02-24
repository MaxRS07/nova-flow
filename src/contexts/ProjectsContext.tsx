'use client';

import { Repository } from '@/types/gh_user';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ProjectsContextType {
    projects: Record<string, Repository>;
    addProject: (project: Repository) => void;
    removeProject: (id: number) => void;
    getProject: (id: number) => Repository | undefined;
    loading: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'nova-projects';

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Record<string, Repository>>({});
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProjects(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Failed to load projects from localStorage:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save to localStorage whenever projects change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
    }, [projects, loading]);

    const addProject = useCallback((project: Repository) => {
        setProjects((prev) => {
            const newProjects = { ...prev };
            newProjects[project.id.toString()] = project;
            return newProjects;
        });
    }, []);

    const removeProject = useCallback((id: number) => {
        setProjects((prev) => {
            const newProjects = { ...prev };
            for (const [key, project] of Object.entries(newProjects)) {
                if (project.id === id) {
                    delete newProjects[key];
                    break;
                }
            }
            return newProjects;
        });
    }, []);

    const getProject = useCallback((id: number) => {
        for (const project of Object.values(projects)) {
            if (project.id === id) {
                return project;
            }
        }
    }, [projects]);

    return (
        <ProjectsContext.Provider value={{ projects, addProject, removeProject, getProject, loading }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
}
