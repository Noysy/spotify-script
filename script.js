// !TODO change to env
const clientId = '331182ac255942188599e988b805a0cf';
const clientSecret = '258028d2b2294cffb542d52bf6e395aa';
const redirectUri = process.env.REDIRECT_URI;

async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  });

  return await response.json();
}

const getPlaylist = async (accessToken) => {
  const response = await fetch(
    'https://api.spotify.com/v1/playlists/5V7JVuvEXXTWUkLC3DBwf5?fields=tracks.items(track(name,artists.name))',
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );
  const formattedResponse = await response.json();

  const myResponse = formattedResponse.tracks.items.map(({ track }) => {
    if (!track) return null;
    const { name, artists } = track;
    const allArtists = artists.map(({ name }) => `${name}`);
    return `${name} ${allArtists.join(' ')}`;
  });

  return myResponse;
};

const { access_token: accessToken } = await getToken();
const playlist = await getPlaylist(accessToken);

console.log(playlist);
