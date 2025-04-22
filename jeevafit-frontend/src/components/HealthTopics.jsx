import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthTopics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = '/api';
  const DB = 'healthTopics';

  useEffect(() => {
    // Lock scroll when modal is open
    if (selectedTopic) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTopic]);

  const fetchHealthTopics = async (term) => {
    setLoading(true);
    setError(null);
    setSelectedTopic(null);
    try {
      const response = await axios.get(API_URL, {
        params: {
          db: DB,
          term: term,
          rettype: 'brief',
          retmax: 10,
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');

      const topicElements = xmlDoc.getElementsByTagName('document');

      const topicsData = Array.from(topicElements).map((node) => {
        const titleNode = Array.from(node.getElementsByTagName('content')).find(
          (el) => el.getAttribute('name') === 'title'
        );
        const summaryNode = Array.from(node.getElementsByTagName('content')).find(
          (el) => el.getAttribute('name') === 'FullSummary'
        );
        const url = node.getAttribute('url');
        return {
          title: titleNode ? titleNode.textContent.replace(/<[^>]*>/g, '') : 'No title',
          summary: summaryNode ? summaryNode.textContent.replace(/<[^>]*>/g, '') : 'No summary',
          url,
        };
      });

      setTopics(topicsData);
    } catch (err) {
      console.error(err);
      setError('Error fetching health topics');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchHealthTopics(searchTerm.trim());
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search Health Topics</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Enter disease or health topic"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '1rem' }}>
        {topics.map((topic, index) => (
          <li
            key={index}
            style={{ marginBottom: '0.5rem', cursor: 'pointer', color: 'blue' }}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic.title}
          </li>
        ))}
      </ul>

      {selectedTopic && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            overflowY: 'auto',
            maxHeight: '80vh',
          }}
        >
          <h3>{selectedTopic.title}</h3>
          <p>{selectedTopic.summary}</p>
          <a href={selectedTopic.url} target="_blank" rel="noopener noreferrer">Read more</a>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setSelectedTopic(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTopics;
