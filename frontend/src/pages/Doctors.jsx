import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ];

  useEffect(() => {
    const applyFilter = () => {
      let result = doctors;

      if (speciality) {
        result = result.filter(doc => doc.speciality === speciality);
      }

      if (searchQuery.trim() !== '') {
        result = result.filter(doc =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setCurrentPage(1); // Reset to first page
      setFilterDoc(result);
    };

    applyFilter();
  }, [doctors, speciality, searchQuery]);

  const handleSpecialityClick = (spec) => {
    navigate(`/doctors/${spec}`);
  };

  const handleClearFilter = () => {
    navigate('/doctors');
  };

  // Pagination Logic
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filterDoc.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filterDoc.length / doctorsPerPage);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-screen-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Browse Doctors</h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by doctor name..."
          className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Speciality Filters */}
      <div className="flex flex-wrap sm:justify-center gap-3 overflow-x-auto scrollbar-hide mb-10 pb-2">
        {specialities.map((spec, index) => (
          <button
            key={index}
            onClick={() => handleSpecialityClick(spec)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              speciality === spec
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
            }`}
          >
            {spec}
          </button>
        ))}
        <button
          onClick={handleClearFilter}
          className="px-4 py-2 rounded-full text-sm font-medium border bg-red-100 text-red-700 hover:bg-red-200"
        >
          Clear Filter
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentDoctors.length > 0 ? (
          currentDoctors.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-106 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No doctors found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full text-sm font-medium border ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
