import { useState, useMemo } from 'react';
import { Search, Copy, Check, ExternalLink, Download, ArrowUpDown, Users, Calendar } from 'lucide-react';

export default function UserList({ 
  lists, 
  activeTab, 
  onTabChange 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-newest'); // 'alpha-asc', 'alpha-desc', 'date-newest', 'date-oldest'
  const [visibleCount, setVisibleCount] = useState(50);
  const [copiedId, setCopiedId] = useState(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  // Get active list from lists props
  const activeList = useMemo(() => {
    return lists[activeTab] || [];
  }, [lists, activeTab]);

  // Filter & Sort list
  const processedList = useMemo(() => {
    let result = [...activeList];
    
    // 1. Apply Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => u.username.toLowerCase().includes(q));
    }
    
    // 2. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'alpha-asc') {
        return a.username.localeCompare(b.username);
      }
      if (sortBy === 'alpha-desc') {
        return b.username.localeCompare(a.username);
      }
      if (sortBy === 'date-newest') {
        const tA = a.timestamp || 0;
        const tB = b.timestamp || 0;
        return tB - tA;
      }
      if (sortBy === 'date-oldest') {
        const tA = a.timestamp || 0;
        const tB = b.timestamp || 0;
        return tA - tB;
      }
      return 0;
    });
    
    return result;
  }, [activeList, searchQuery, sortBy]);

  // Format timestamp nicely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Copy single username
  const handleCopyUsername = (username, idx) => {
    navigator.clipboard.writeText(username);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Copy all filtered usernames
  const handleCopyAll = () => {
    if (processedList.length === 0) return;
    const usernames = processedList.map(u => u.username).join('\n');
    navigator.clipboard.writeText(usernames);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  // Export CSV file
  const handleExportCSV = () => {
    if (processedList.length === 0) return;
    
    const headers = ['Username', 'Profile Link', 'Date Followed'];
    const rows = processedList.map(u => [
      u.username,
      u.href,
      u.timestamp ? new Date(u.timestamp).toISOString() : 'Unknown'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `instagram_${activeTab}_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Switch tabs (resets pagination and search query)
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setVisibleCount(50);
    setSearchQuery('');
  };

  const tabs = [
    { id: 'notFollowingBack', label: 'Not Following Back', badge: lists.notFollowingBack.length, badgeClass: 'badge-danger' },
    { id: 'dontFollowBack', label: 'Fans', badge: lists.dontFollowBack.length, badgeClass: 'badge-success' },
    { id: 'mutuals', label: 'Mutuals', badge: lists.mutuals.length, badgeClass: 'badge-primary' },
    { id: 'following', label: 'All Following', badge: lists.following.length, badgeClass: '' },
    { id: 'followers', label: 'All Followers', badge: lists.followers.length, badgeClass: '' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Dynamic Tab Switchers */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        overflowX: 'auto',
        gap: '0.5rem',
        paddingBottom: '0.25rem',
        scrollbarWidth: 'none'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-pink)' : '2px solid transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '8px 8px 0 0',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if(!isActive) e.target.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                if(!isActive) e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className={`badge ${tab.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters and Search Bar Container */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.5rem'
            }}
          />
        </div>

        {/* Sort & Bulk Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '160px',
                padding: '0.6rem 0.8rem',
                fontSize: '0.85rem'
              }}
            >
              <option value="date-newest">Follow Date: Newest</option>
              <option value="date-oldest">Follow Date: Oldest</option>
              <option value="alpha-asc">Alphabetical: A-Z</option>
              <option value="alpha-desc">Alphabetical: Z-A</option>
            </select>
          </div>

          {/* Bulk Copy */}
          <button
            onClick={handleCopyAll}
            disabled={processedList.length === 0}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: processedList.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: processedList.length === 0 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            {bulkCopied ? <Check size={14} style={{ color: 'var(--success-color)' }} /> : <Copy size={14} />}
            {bulkCopied ? 'Copied List!' : 'Copy All Usernames'}
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            disabled={processedList.length === 0}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: processedList.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: processedList.length === 0 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* User Table / List View */}
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        {processedList.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No profiles found</h4>
            <p style={{ fontSize: '0.85rem' }}>Try modifying your search query or upload different files.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1.2fr 1fr', 
                padding: '1rem 1.5rem', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)'
              }}>
                <span>Username</span>
                <span>Follow Date</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>

              {/* Rows */}
              {processedList.slice(0, visibleCount).map((user, idx) => (
                <div 
                  key={idx}
                  className="table-row"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.5fr 1.2fr 1fr', 
                    padding: '0.9rem 1.5rem', 
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center',
                    fontSize: '0.925rem',
                    transition: 'background var(--transition-speed)'
                  }}
                >
                  {/* Column 1: Username & Profile Link */}
                  <span style={{ fontWeight: 500, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.username}
                  </span>

                  {/* Column 2: Followed Date */}
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    {formatDate(user.timestamp)}
                  </span>

                  {/* Column 3: Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {/* Copy Username button */}
                    <button
                      onClick={() => handleCopyUsername(user.username, idx)}
                      style={{
                        padding: '0.4rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'none'; }}
                      title="Copy username"
                    >
                      {copiedId === idx ? <Check size={14} style={{ color: 'var(--success-color)' }} /> : <Copy size={14} />}
                    </button>

                    {/* Instagram Link button */}
                    <a
                      href={user.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.4rem',
                        color: 'var(--text-secondary)',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--text-main)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'none'; }}
                      title="Open Instagram Profile"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show More */}
            {processedList.length > visibleCount && (
              <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Load More ({processedList.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .table-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }
        .table-row:last-child {
          border-bottom: none;
        }
      `}</style>

    </div>
  );
}
