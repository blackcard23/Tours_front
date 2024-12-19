import React, { useState } from 'react'; 
import { useTranslation } from 'react-i18next'; 
 
 
 
const SearchPage = ({ tours, setFilteredTours, resetPage }) => { 
  const { t } = useTranslation(); 
  const [searchQuery, setSearchQuery] = useState(''); 
 
  const handleSearch = (e) => { 
    setSearchQuery(e.target.value); 
    resetPage();  
    if (e.target.value === '') { 
      setFilteredTours(tours); 
    } else { 
      const filtered = tours.filter((tour) => 
        tour.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
        tour.country_name.toLowerCase().includes(e.target.value.toLowerCase()) 
      ); 
      setFilteredTours(filtered); 
    } 
  }; 
 
  return ( 
    <div className="mb-8"> 
      <input 
        type="text" 
        value={searchQuery} 
        onChange={handleSearch} 
        placeholder={t('main.searchTours')} 
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600" 
      /> 
    </div> 
  ); 
}; 
 
 
export default SearchPage;