import React, { useState } from 'react';
import axios from 'axios';

function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('/search', { keyword });
      setResults(response.data.result);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{/* Display search result */}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchForm;
