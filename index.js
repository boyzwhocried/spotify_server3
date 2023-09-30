const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const onRepeatPlaylistId = process.env.ON_REPEAT_PLAYLIST_ID;

// Define a function to fetch the access token
async function getAccessToken() {
  try {
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });
    return authResponse.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.message);
    throw new Error('Error obtaining access token');
  }
}

// Define an async function to get the playlist data
async function getPlaylistData(accessToken) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${onRepeatPlaylistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist data:', error.message);
    throw new Error('Error fetching playlist data');
  }
}

// Define the route to get the playlist data
app.get('/get-playlist', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const playlistData = await getPlaylistData(accessToken);
    res.json(playlistData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
