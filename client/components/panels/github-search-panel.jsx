"use client";

import { useState, useEffect } from "react";
import { X, Star, GitFork, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GitHubSearchPanel({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search repositories when query changes (with debounce effect)
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setRepositories([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRepositories(data.items || []);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Failed to fetch repositories. Please try again.");
      setRepositories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="text-xl font-semibold">GitHub Search</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Search input */}
      <div className="p-4 border-b border-border bg-card">
        <form onSubmit={handleSubmit}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full"
          />
        </form>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {error && (
          <div className="text-center text-destructive p-4">
            {error}
          </div>
        )}

        {!isLoading && repositories.length === 0 && searchQuery && (
          <div className="text-center text-muted-foreground p-8">
            No repositories found. Try a different search query.
          </div>
        )}

        {!isLoading && repositories.length === 0 && !searchQuery && (
          <div className="text-center text-muted-foreground p-8">
            Enter a search query to find GitHub repositories.
          </div>
        )}

        {!isLoading && repositories.length > 0 && (
          repositories.map((repo) => (
            <Card key={repo.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-start justify-between gap-2">
                  <span className="flex-1">{repo.name}</span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardTitle>
                <CardDescription className="text-sm">
                  {repo.full_name}
                </CardDescription>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {repo.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  {repo.forks_count > 0 && (
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{formatNumber(repo.forks_count)}</span>
                    </div>
                  )}
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div>
                    Updated: {formatDate(repo.updated_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
