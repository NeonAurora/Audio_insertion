// src/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tracks, setTracks] = useState([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tracks`);
    setTracks(response.data);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('file', file);

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tracks`, formData);
    setTitle('');
    setArtist('');
    setFile(null);
    fetchTracks();
  };

  return (
    <div className="App">
      <h1>Music App</h1>
      <form onSubmit={submitForm}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <ul>
        {tracks.map((track) => (
          <li key={track._id}>
            {track.title} - {track.artist}
            <audio src={`${process.env.REACT_APP_API_BASE_URL}/${track.file}`} controls />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
