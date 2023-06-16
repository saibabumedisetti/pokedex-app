

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Search</Link>
            </li>
            <li>
              <Link to="/bookmarks">Bookmarks</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/details/:name" element={<DetailsPage />} />
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
  );
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      setPokemonList([response.data]);
      setError('');
    } catch (error) {
      setError('Error fetching Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div>{error}</div>}
          {pokemonList.map((pokemon) => (
            <Link key={pokemon.id} to={`/details/${pokemon.name}`}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <div>{pokemon.name}</div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

const DetailsPage = () => {
  const { name } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemonDetails(response.data);
        setError('');
      } catch (error) {
        setError('Error fetching Pokémon details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  const handleBookmark = () => {
    setBookmarked((prevBookmark) => !prevBookmark);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div>{error}</div>}
          {pokemonDetails && (
            <div>
              <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
              <div>{pokemonDetails.name}</div>
              <button onClick={handleBookmark}>{bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const BookmarksPage = () => {
  const [bookmarkedPokemon, setBookmarkedPokemon] = useState([]);

  const removeBookmark = (pokemonName) => {
    setBookmarkedPokemon((prevBookmarks) => prevBookmarks.filter((pokemon) => pokemon.name !== pokemonName));
  };

  useEffect(() => {
    
  }, []);

  return (
    <div>
      {bookmarkedPokemon.length === 0 ? (
        <div>No bookmarked Pokémon.</div>
      ) : (
        bookmarkedPokemon.map((pokemon) => (
          <div key={pokemon.name}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <div>{pokemon.name}</div>
            <button onClick={() => removeBookmark(pokemon.name)}>Remove Bookmark</button>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
