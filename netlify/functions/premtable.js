exports.handler = async function () {
  const apiKey = process.env.FOOTBALL_DATA_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing FOOTBALL_DATA_KEY" })
    };
  }

  try {
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/PL/standings",
      {
        headers: {
          "X-Auth-Token": apiKey
        }
      }
    );

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: `API error: ${res.status} ${res.statusText}` })
      };
    }

    const data = await res.json();
    const table = data?.standings?.[0]?.table || [];

    const standings = table.map(entry => ({
      rank: entry.position,
      team: entry.team.name,
      played: entry.playedGames,
      win: entry.won,
      draw: entry.draw,
      lose: entry.lost,
      gf: entry.goalsFor,
      ga: entry.goalsAgainst,
      gd: entry.goalDifference,
      points: entry.points,
      form: entry.form || ""
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ standings })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
