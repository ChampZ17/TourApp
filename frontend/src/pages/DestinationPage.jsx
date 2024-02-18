import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './DestinationPage.css';

const DestinationPage = (props) => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestination() {
      try {
        const response = await fetch(`http://localhost:1234/api/v1/tours/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setDestination(data.data);
          console.log("Destination Data:", data);
        } else {
          console.error('Failed to fetch destination');
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchDestination();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="destination-page">
      {loading && <div>Loading...</div>}
      {!loading && !destination && <div>Destination not found</div>}
      {destination && (
        <div>
          <h1 className="destination-name">{destination.name}</h1>
          <img src={destination.imageCover} alt={destination.name} className="destination-cover" />
          <p className="destination-summary">{destination.summary}</p>
          <div className="highlight-section">
            <h2>Highlights</h2>
            <ul className="highlight-list">
              {destination.highlights && destination.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div className="details-section">
            <div>
              <h2>Destinations</h2>
              <ul>
                {destination.destinations && destination.destinations.map((dest, index) => (
                  <li key={index}>{dest}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Travel Style</h2>
              <ul>
                {destination.travelStyle && destination.travelStyle.map((style, index) => (
                  <li key={index}>{style}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Price</h2>
              <p>{destination.price}</p>
            </div>
            <div>
              <h2>Rating</h2>
              <p>{destination.rating}</p>
            </div>
            <div>
              <h2>Reviews Quantity</h2>
              <p>{destination.reviewsQuantity}</p>
            </div>
            <div>
              <h2>Duration</h2>
              <p>{destination.duration}</p>
            </div>
          </div>
          <div className="image-section">
            <h2>Images</h2>
            <div className="image-gallery">
              {destination.images && destination.images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} className="gallery-image" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationPage;
