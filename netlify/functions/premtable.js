exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
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

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: `API error: ${res.status} ${res.statusText}` })
      };
    }

    const data = await res.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: data.errors })
      };
    }

    const table = data?.response?.[0]?.league?.standings?.[0] || [];

    const standings = table.map(team => ({
      rank: team.rank,
      team: team.team.name,
      played: team.all.played,
      win: team.all.win,
      draw: team.all.draw,
      lose: team.all.lose,
      gf: team.all.goals.for,
      ga: team.all.goals.against,
      gd: team.goalsDiff,
      points: team.points,
      form: team.form || ""
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
