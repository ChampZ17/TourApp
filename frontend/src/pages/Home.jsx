import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:1234/api/v1/tours');
        const data = await response.json();
        if (data.status === 'success' && data.data && data.data.result.length > 0) {
          setDestinations(data.data.result);
          setLoading(false);
        } else {
          setError('Failed to fetch destination data');
          setLoading(false);
        }
      } catch (error) {
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <h1 className="home-heading">Destinations</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="destination-grid">
        {destinations.map((destination) => (
          <div key={destination._id} className="destination-card">
            <img className="destination-image" src={destination.imageCover} alt={destination.name} />
            <div className="destination-info">
              <h3 className="destination-name">{destination.name}</h3>
              <p className="destination-price">Price: ${destination.price}</p>
              <p className="destination-duration">Duration: {destination.duration} days</p>
              <p className="destination-rating">Rating: {destination.rating}</p>
              <Link to={`/destination/${destination.slug}`} className="details-button">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
