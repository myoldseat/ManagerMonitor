exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API_FOOTBALL_KEY" })
    };
  }

  const teamId = 49;
  const season = 2025;
  const competitions = [39, 2, 45, 48];

  try {
    const playersMap = new Map();

    for (const leagueId of competitions) {
      const res = await fetch(
        `https://v3.football.api-sports.io/players?league=${leagueId}&season=${season}&team=${teamId}`,
        {
          headers: {
            "x-apisports-key": apiKey
          }
        }
      );

      const data = await res.json();
      const players = data.response || [];

      for (const entry of players) {
        const name = entry.player?.name;
        const stats = entry.statistics?.[0];

        if (!name || !stats) continue;

        const goals = stats.goals?.total || 0;
        const assists = stats.goals?.assists || 0;

        if (!playersMap.has(name)) {
          playersMap.set(name, {
            name,
            goals: 0,
            assists: 0
          });
        }

        const player = playersMap.get(name);
        player.goals += goals;
        player.assists += assists;
      }
    }

    const players = Array.from(playersMap.values());

    const top = players
      .map(p => ({
        ...p,
        ga: p.goals + p.assists
      }))
      .sort((a, b) => b.ga - a.ga)[0];

    return {
      statusCode: 200,
      body: JSON.stringify({ top })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
