import React, { useState, useEffect, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import InstructionGuide from './components/InstructionGuide';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import { ShieldCheck, Moon, Sun, RotateCcw, BarChart3, ListFilter } from 'lucide-react';

const InstagramIcon = ({ size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function App() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [view, setView] = useState('upload'); // 'upload' or 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'notFollowingBack', 'dontFollowBack', 'mutuals', 'following', 'followers'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Effect to apply theme configuration to document node
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Math/Set Operations
  const lists = useMemo(() => {
    // Defensive filtering: ignore items that do not have a valid username
    const validFollowers = followers.filter(f => f && typeof f.username === 'string');
    const validFollowing = following.filter(f => f && typeof f.username === 'string');

    const followersSet = new Set(validFollowers.map(f => f.username.toLowerCase()));
    const followingSet = new Set(validFollowing.map(f => f.username.toLowerCase()));

    const notFollowingBack = validFollowing.filter(
      user => !followersSet.has(user.username.toLowerCase())
    );

    const dontFollowBack = validFollowers.filter(
      user => !followingSet.has(user.username.toLowerCase())
    );

    const mutuals = validFollowing.filter(
      user => followersSet.has(user.username.toLowerCase())
    );

    return {
      followers: validFollowers,
      following: validFollowing,
      notFollowingBack,
      dontFollowBack,
      mutuals
    };
  }, [followers, following]);

  const stats = useMemo(() => {
    const totalFollowers = followers.length;
    const totalFollowing = following.length;
    const notFollowingBackCount = lists.notFollowingBack.length;
    const dontFollowBackCount = lists.dontFollowBack.length;
    const mutualCount = lists.mutuals.length;

    const followBackRatio = totalFollowing > 0 
      ? Math.round((mutualCount / totalFollowing) * 100) 
      : 0;

    return {
      totalFollowers,
      totalFollowing,
      notFollowingBackCount,
      dontFollowBackCount,
      mutualCount,
      followBackRatio
    };
  }, [followers, following, lists]);

  const handleDataLoaded = (data) => {
    setFollowers(data.followers);
    setFollowing(data.following);
    setView('dashboard');
    setActiveTab('dashboard');
  };

  const handleReset = () => {
    setFollowers([]);
    setFollowing([]);
    setView('upload');
    setActiveTab('dashboard');
  };

  const handleLoadSampleData = () => {
    // Generate synthetic, realistic sample accounts for demonstration
    const baseUsernames = [
      'jack_explorer', 'creative_emma', 'travel_guru', 'pixel_artist', 'fitness_sophie',
      'tech_insider', 'foodie_carl', 'music_vibes', 'wanderlust_lucy', 'nature_clicks',
      'photo_pro', 'daily_motivation', 'skater_boy_99', 'retro_gamer', 'coffee_lover',
      'design_daily', 'urban_scanner', 'chef_mariana', 'yoga_flow', 'indie_author',
      'gadget_geek', 'guitar_strum', 'hiker_dan', 'fashion_forward', 'movie_buff'
    ];

    const extraUsernames = Array.from({ length: 180 }, (_, i) => `user_net_${i + 100}`);

    const allPool = [...baseUsernames, ...extraUsernames];

    // Generate followers (130 accounts)
    const mockFollowers = [];
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    // 90 mutuals
    for (let i = 0; i < 90; i++) {
      mockFollowers.push({
        username: allPool[i],
        href: `https://www.instagram.com/${allPool[i]}`,
        timestamp: oneMonthAgo + i * 2 * 3600 * 1000
      });
    }
    
    // 40 fans (only follow you)
    for (let i = 90; i < 130; i++) {
      mockFollowers.push({
        username: allPool[i],
        href: `https://www.instagram.com/${allPool[i]}`,
        timestamp: oneMonthAgo + i * 4 * 3600 * 1000
      });
    }

    // Generate following (150 accounts)
    const mockFollowing = [];
    
    // 90 mutuals
    for (let i = 0; i < 90; i++) {
      mockFollowing.push({
        username: allPool[i],
        href: `https://www.instagram.com/${allPool[i]}`,
        timestamp: oneMonthAgo + i * 2 * 3600 * 1000
      });
    }
    
    // 60 unfollowers (you follow, they don't follow back)
    for (let i = 130; i < 190; i++) {
      mockFollowing.push({
        username: allPool[i],
        href: `https://www.instagram.com/${allPool[i]}`,
        timestamp: oneMonthAgo + i * 3 * 3600 * 1000
      });
    }

    handleDataLoaded({
      followers: mockFollowers,
      following: mockFollowing
    });
  };

  return (
    <div className="app-container">
      
      {/* Header Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--instagram-gradient)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 14px rgba(193, 53, 132, 0.3)'
          }}>
            <InstagramIcon size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              InstaPulse
              <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                v1.0
              </span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instagram Follower Analyzer</p>
          </div>
        </div>

        {/* Global Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {view === 'dashboard' && (
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.04)';
                e.target.style.borderColor = 'var(--border-color)';
              }}
            >
              <RotateCcw size={14} />
              Reset App
            </button>
          )}

          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.04)';
              e.target.style.borderColor = 'var(--border-color)';
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main View Manager */}
      <main className="animate-fade-in">
        {view === 'upload' ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                Analyze your follower network.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
                Find who unfollowed you or who isn't following back. 100% private, client-side browser analysis.
              </p>
            </div>
            
            <InstructionGuide />
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              onLoadSampleData={handleLoadSampleData}
            />
          </div>
        ) : (
          <div>
            {/* View Sub-navigation */}
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginBottom: '2rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              padding: '0.4rem',
              borderRadius: '12px',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                  background: activeTab === 'dashboard' ? 'var(--instagram-gradient)' : 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'transform 0.2s',
                  color: 'white'
                }}
              >
                <BarChart3 size={15} />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('notFollowingBack')}
                style={{
                  background: activeTab !== 'dashboard' ? 'var(--instagram-gradient)' : 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'transform 0.2s',
                  color: 'white'
                }}
              >
                <ListFilter size={15} />
                Detailed Lists
              </button>
            </div>

            {/* Render Dashboard vs Detailed Lists tab */}
            {activeTab === 'dashboard' ? (
              <Dashboard 
                stats={stats} 
                onTabChange={(tabId) => {
                  setActiveTab(tabId);
                }} 
              />
            ) : (
              <UserList 
                lists={lists} 
                activeTab={activeTab} 
                onTabChange={(tabId) => setActiveTab(tabId)} 
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '6rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} style={{ color: 'var(--success-color)' }} />
          <span>Local client-side execution. No account passwords required.</span>
        </div>
        <div>
          <span>Created by Dnyaneshwar Kokate • Miracle Developers</span>
        </div>
      </footer>
      
    </div>
  );
}
