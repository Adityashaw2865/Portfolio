// Public GitHub data, fetched in the browser (no token). Cached for 10 minutes per tab to stay inside the API rate limit.
async function cached(key, fn, ttl = 600000) {
    try { const raw = sessionStorage.getItem(key); if (raw) { const { t, v } = JSON.parse(raw); if (Date.now() - t < ttl) return v } } catch (e) {}
    const v = await fn()
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })) } catch (e) {}
    return v
  }
  const json = r => { if (!r.ok) throw new Error(String(r.status)); return r.json() }
  
  export const getProfile = user => cached(`gh-profile-${user}`, async () => {
    const [u, repos] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`).then(json),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100`).then(json),
    ])
    const own = repos.filter(r => !r.fork)
    const counts = {}
    own.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1 })
    return {
      repos: u.public_repos, followers: u.followers, following: u.following, since: new Date(u.created_at).getFullYear(),
      stars: own.reduce((a, r) => a + r.stargazers_count, 0),
      langs: Object.entries(counts).sort((a, b) => b[1] - a[1]),
    }
  })
  
  export const getContributions = user => cached(`gh-contrib-${user}`, async () => {
    const d = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then(json)
    const out = {}
    ;(d.contributions || []).forEach(c => { out[c.date] = c.count })
    return out
  })