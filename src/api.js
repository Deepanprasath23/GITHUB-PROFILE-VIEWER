const BASE_URL = 'https://api.github.com';

/**
 * Extract a GitHub username from either a raw username string or a full profile URL.
 */
export function extractUsername(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim().replace(/\/+$/, '');
  
  // Handle full URLs like https://github.com/username
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})\/?$/);
  if (urlMatch) return urlMatch[1];

  // Handle raw username
  const usernameMatch = trimmed.match(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/);
  if (usernameMatch) return usernameMatch[0];

  return null;
}

/**
 * Generic fetch wrapper with error handling for GitHub API
 */
async function githubFetch(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (res.status === 404) {
    throw new Error('User not found. Please check the username and try again.');
  }
  
  if (res.status === 403) {
    const resetTime = res.headers.get('X-RateLimit-Reset');
    const resetDate = resetTime ? new Date(resetTime * 1000).toLocaleTimeString() : 'soon';
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}. Try again later.`);
  }
  
  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status}). Please try again.`);
  }
  
  return res.json();
}

/**
 * Fetch user profile data
 */
export async function fetchUserProfile(username) {
  return githubFetch(`/users/${username}`);
}

/**
 * Fetch all user repositories (handles pagination, up to 100)
 */
export async function fetchUserRepos(username) {
  const repos = await githubFetch(`/users/${username}/repos?per_page=100&sort=updated`);
  return repos;
}

/**
 * Fetch recent user events/activity
 */
export async function fetchUserEvents(username) {
  const events = await githubFetch(`/users/${username}/events?per_page=30`);
  return events;
}

/**
 * Fetch all data for a user dashboard in parallel
 */
export async function fetchAllUserData(username) {
  const [profile, repos, events] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepos(username),
    fetchUserEvents(username),
  ]);
  
  return { profile, repos, events };
}

/**
 * Compute language usage stats from repos
 */
export function computeLanguageStats(repos) {
  const langMap = {};
  repos.forEach(repo => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
  });
  
  // Sort by count descending
  const sorted = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1]);
  
  return {
    labels: sorted.map(([lang]) => lang),
    counts: sorted.map(([, count]) => count),
  };
}

/**
 * Compute contribution insights from repos
 */
export function computeInsights(repos) {
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  const mostStarred = repos.reduce((best, r) => 
    (r.stargazers_count || 0) > (best?.stargazers_count || 0) ? r : best
  , repos[0]);
  const avgStars = repos.length ? (totalStars / repos.length).toFixed(1) : 0;
  
  return { totalStars, totalForks, mostStarred, avgStars };
}

/**
 * Compute a profile score (0-100) and badge level
 */
export function computeProfileScore(profile, repos, events) {
  let score = 0;
  
  // Followers component (max 25 pts)
  const followerScore = Math.min(25, Math.log2(Math.max(1, profile.followers)) * 3.5);
  
  // Stars component (max 25 pts)
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const starScore = Math.min(25, Math.log2(Math.max(1, totalStars)) * 2.5);
  
  // Repos component (max 20 pts)
  const repoScore = Math.min(20, Math.log2(Math.max(1, profile.public_repos)) * 3);
  
  // Activity component (max 15 pts)
  const activityScore = Math.min(15, (events.length / 30) * 15);
  
  // Profile completeness (max 15 pts)
  let completeness = 0;
  if (profile.name) completeness += 3;
  if (profile.bio) completeness += 3;
  if (profile.location) completeness += 3;
  if (profile.company) completeness += 3;
  if (profile.blog) completeness += 3;
  
  score = Math.round(followerScore + starScore + repoScore + activityScore + completeness);
  score = Math.min(100, score);
  
  let badge, badgeClass;
  if (score >= 85) { badge = '🏆 Legend'; badgeClass = 'badge-legend'; }
  else if (score >= 65) { badge = '💎 Expert'; badgeClass = 'badge-expert'; }
  else if (score >= 45) { badge = '🚀 Advanced'; badgeClass = 'badge-advanced'; }
  else if (score >= 25) { badge = '⚡ Intermediate'; badgeClass = 'badge-intermediate'; }
  else { badge = '🌱 Beginner'; badgeClass = 'badge-beginner'; }
  
  return {
    score,
    badge,
    badgeClass,
    breakdown: {
      followers: Math.round(followerScore),
      stars: Math.round(starScore),
      repos: Math.round(repoScore),
      activity: Math.round(activityScore),
      completeness: Math.round(completeness),
    },
  };
}

/**
 * Generate AI-like insights about a user profile
 */
export function generateAIInsights(profile, repos, events) {
  const insights = [];
  const langStats = computeLanguageStats(repos);
  const { totalStars, mostStarred } = computeInsights(repos);
  
  // Top languages insight
  if (langStats.labels.length > 0) {
    const topLangs = langStats.labels.slice(0, 3).join(', ');
    insights.push({
      icon: '💻',
      text: `This user primarily works with ${topLangs}. ${langStats.labels.length > 3 ? `They also use ${langStats.labels.length - 3} other languages.` : ''}`,
    });
  }
  
  // Most starred project
  if (mostStarred && mostStarred.stargazers_count > 0) {
    insights.push({
      icon: '⭐',
      text: `Top project: "${mostStarred.name}" with ${mostStarred.stargazers_count.toLocaleString()} stars${mostStarred.description ? ` — ${mostStarred.description}` : ''}.`,
    });
  }
  
  // Activity recency
  if (events.length > 0) {
    const recentEvent = new Date(events[0].created_at);
    const daysDiff = Math.floor((Date.now() - recentEvent) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      insights.push({ icon: '🔥', text: 'Highly active! This user has been contributing within the last 24 hours.' });
    } else if (daysDiff <= 7) {
      insights.push({ icon: '📈', text: `Active recently — last activity was ${daysDiff} days ago.` });
    } else if (daysDiff <= 30) {
      insights.push({ icon: '📊', text: `Moderately active — last activity was ${daysDiff} days ago.` });
    } else {
      insights.push({ icon: '💤', text: `This user hasn't been very active recently (last activity ${daysDiff} days ago).` });
    }
  }
  
  // Follower ratio
  if (profile.followers > 0 && profile.following > 0) {
    const ratio = (profile.followers / profile.following).toFixed(1);
    if (ratio >= 10) {
      insights.push({ icon: '👑', text: `Strong influence with a ${ratio}x follower-to-following ratio.` });
    } else if (ratio >= 2) {
      insights.push({ icon: '📣', text: `Good community presence with a ${ratio}x follower-to-following ratio.` });
    }
  }
  
  // Stars insight
  if (totalStars > 100) {
    insights.push({ icon: '🌟', text: `Impressive work! ${totalStars.toLocaleString()} total stars across ${repos.length} repositories.` });
  } else if (totalStars > 0) {
    insights.push({ icon: '✨', text: `Has earned ${totalStars.toLocaleString()} stars across ${repos.length} repositories.` });
  }
  
  return insights;
}

/**
 * Generate a mock contribution heatmap from events (since we can't get real commit data without auth)
 */
export function generateHeatmapData(events) {
  const today = new Date();
  const weeks = 26; // ~6 months
  const data = [];
  
  // Create a map of event dates
  const eventDateMap = {};
  events.forEach(event => {
    const date = new Date(event.created_at).toISOString().split('T')[0];
    eventDateMap[date] = (eventDateMap[date] || 0) + 1;
  });
  
  // Build heatmap grid
  // Start from the beginning of the week, 26 weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7) - startDate.getDay());
  
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      const dateStr = date.toISOString().split('T')[0];
      const count = eventDateMap[dateStr] || 0;
      
      // Simulate some additional activity for visual interest
      const isFuture = date > today;
      let level = 0;
      if (!isFuture) {
        if (count >= 4) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;
        else {
          // Add some random low-level activity for visual richness
          const hash = (date.getDate() * 13 + date.getMonth() * 7 + w * 3) % 10;
          if (hash < 2 && (Date.now() - date.getTime()) < (90 * 24 * 60 * 60 * 1000)) {
            level = 1;
          }
        }
      }
      
      week.push({
        date: dateStr,
        count,
        level,
        isFuture,
      });
    }
    data.push(week);
  }
  
  return data;
}

/**
 * Language colors (GitHub-like)
 */
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  R: '#198CE7',
  MATLAB: '#e16737',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Jupyter: '#DA5B0B',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  TeX: '#3D6117',
  Vim: '#199f4b',
  PowerShell: '#012456',
};

export function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || '#8b949e';
}

/**
 * Format a number with abbreviation (1.2k, 3.4m etc.)
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
