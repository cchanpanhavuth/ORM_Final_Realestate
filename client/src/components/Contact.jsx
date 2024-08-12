import { useEffect, useState } from 'react';

export default function Contact({ property }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Added state for error

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      if (!property.userId) {
        setError('User ID is not available');
        return;
      }

      setIsLoading(true);
      setError(''); // Reset error state

      try {
        const res = await fetch(`/api/user/${property.userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch landlord data');
        }
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.error('Error fetching landlord data:', error);
        setError('Error fetching landlord data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandlord();
  }, [property.userId]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : landlord ? (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span> for{' '}
            <span className="font-semibold">{property.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          />

          <a
            href={`mailto:${landlord.email}?subject=Regarding ${property.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </a>
        </div>
      ) : (
        <p>Landlord data not available.</p> // Changed message to be more specific
      )}
    </>
  );
}
