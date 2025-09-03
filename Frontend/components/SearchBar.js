import React from 'react';

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search albums or singles..."
        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
      />
    </div>
  );
}

export default SearchBar;
