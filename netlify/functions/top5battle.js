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
      "https://v3.football.api-sports.io/leagues?season=2025&team=49",
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await res.json();

    const competitions = (data.response || []).map(item => ({
      id: item.league.id,
      name: item.league.name
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ competitions })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
