import React, { useEffect } from 'react';

const DIALOGUE_KEY = 'hasVisitedHelperDialogue';

export default function HelperDialogue({ open, setOpen }) {
  useEffect(() => {
    const hasVisited = localStorage.getItem(DIALOGUE_KEY);
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem(DIALOGUE_KEY, 'true');
    }
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '24px',
        animation: 'fadeIn 0.7s',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #fff 80%, #e3f2fd 100%)',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.25)',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          fontFamily: 'Segoe UI, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '12px', textAlign: 'center' }}>🌐⚔️</div>
        <h2 style={{
          color: '#1976d2',
          marginBottom: '16px',
          fontWeight: 800,
          fontSize: '1.9rem',
          textAlign: 'center',
        }}
        >
          Welcome to
          {' '}
          <span style={{ color: '#1565c0' }}>Spatial Wars!</span>
        </h2>

        <p style={{
          marginBottom: '20px', color: '#222', fontSize: '1rem', fontWeight: 500, textAlign: 'center',
        }}
        >
          <span style={{ color: '#1565c0', fontWeight: 700 }}>Ready for battle?</span>
          <br />
          Outsmart your rival, conquer nations, and win glory in this thrilling turn-based quiz war.
        </p>

        {/* Sections */}
        {[{
          title: '🚀 How to Join the Battle',
          items: [
            'Player One: Sign up with a unique commander name.',
            'Player Two: Enter the same or a different name to join the war room.',
            <li key="self-play" style={{ fontWeight: 'bold', color: '#d32f2f' }}>
              🔥 No second player?
              {' '}
              <u>You can play against yourself</u>
              {' '}
              by entering your name as both player and opponent!
            </li>,
            'AI Opponents coming soon!',
          ],
        }, {
          title: '🎯 Game Rules',
          items: [
            'Attack! Send a brain-busting question to your opponent.',
            'Defend! Answer correctly before time runs out.',
            'Victory: Conquer a nation for each correct answer.',
            'Defeat: Lose a nation for incorrect answers.',
          ],
        }, {
          title: '🏆 Win Big!',
          items: [
            'First to 10 nations wins the game and earns ultimate bragging rights.',
          ],
        }].map((section) => (
          <div
            key={section.title}
            style={{
              background: '#f5faff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ color: '#1976d2', marginBottom: '10px', fontWeight: 700 }}>
              {section.title}
            </h3>
            <ul style={{
              marginLeft: '20px',
              color: '#444',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              paddingLeft: '0',
            }}
            >
              {section.items.map((item, i) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 28px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(25,118,210,0.15)',
              marginTop: '10px',
            }}
          >
            ⚡ Start the Showdown!
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* Optional scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #e3f2fd;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #90caf9;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}
