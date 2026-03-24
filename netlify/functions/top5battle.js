exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API_FOOTBALL_KEY" })
    };
  }

  const teamId = 49;

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await res.json();
    const players = data.response?.[0]?.players || [];

    // TEMP FAKE stats just to confirm pipeline
    const top5 = players.slice(0, 5).map(p => ({
      name: p.name,
      goals: 0,
      assists: 0,
      ga: 0
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ top5 })
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
