exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API_FOOTBALL_KEY" })
    };
  }

  try {
    const res = await fetch(
      "https://v3.football.api-sports.io/standings?league=39&season=2025",
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await res.json();

    const table = data?.response?.[0]?.league?.standings?.[0] || [];

    const top7 = table.slice(0, 7).map(team => ({
      rank: team.rank,
      team: team.team.name,
      played: team.all.played,
      win: team.all.win,
      draw: team.all.draw,
      lose: team.all.lose,
      gd: team.goalsDiff,
      points: team.points,
      form: team.form || ""
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ top7 })
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
