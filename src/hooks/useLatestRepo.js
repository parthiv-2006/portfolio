import { useState, useEffect } from 'react';

export default function useLatestRepo(username = 'parthiv-2006') {
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`)
            .then((r) => r.json())
            .then((repos) => {
                // Skip forked repos to show only own work
                const own = repos.find((r) => !r.fork);
                if (own) setRepo({ name: own.name, url: own.html_url });
            })
            .catch(() => {});
    }, [username]);

    return repo;
}
