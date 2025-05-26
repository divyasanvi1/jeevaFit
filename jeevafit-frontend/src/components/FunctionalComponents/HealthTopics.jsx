import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const HealthTopics = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  const isProd = window.location.origin === FRONTEND_URL.replace(/\/$/, '');

// If on Vercel (production), call the real URL directly
// If in dev (localhost), use Vite proxy `/api`
const API_URL = isProd
  ? 'https://wsearch.nlm.nih.gov/ws/query'
  : '/api';
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
      console.log("error",err);
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
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: 'auto',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#03045E' }}>
        🔍 {t('healthTopics.title')}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchTerm}
          placeholder={t('healthTopics.searchPlaceholder')}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            width: '100%',
            borderRadius: '10px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FF6D00',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {t('healthTopics.searchButton')}
        </button>
      </form>

      {loading && <p style={{ color: '#555' }}>{t('healthTopics.loading')}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {topics.map((topic, index) => (
          <li
            key={index}
            style={{
              backgroundColor: '#CAF0F8',
              padding: '1rem',
              marginBottom: '0.75rem',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onClick={() => setSelectedTopic(topic)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <strong style={{ color: '#03045E' }}>{topic.title}</strong>
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
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '650px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 1000,
            overflowY: 'auto',
            maxHeight: '80vh',
            fontSize: '1rem',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#03045E' }}>
            📘 {selectedTopic.title}
          </h3>
          <p style={{ marginBottom: '1rem', color: '#333' }}>{selectedTopic.summary}</p>
          <a
            href={selectedTopic.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FF6D00', textDecoration: 'underline', fontWeight: 'bold' }}
          >
            {t('healthTopics.readMore')} →
          </a>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button
              onClick={() => setSelectedTopic(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {t('healthTopics.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTopics;
