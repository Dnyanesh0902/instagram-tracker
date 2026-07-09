import React from 'react';
import { Users, UserX, UserCheck, Heart, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function Dashboard({ 
  stats, 
  onTabChange 
}) {
  const {
    totalFollowers,
    totalFollowing,
    notFollowingBackCount,
    dontFollowBackCount,
    mutualCount,
    followBackRatio
  } = stats;

  // Visual text based on the follow back ratio
  const getRatioStatus = (ratio) => {
    if (ratio >= 80) return { label: 'Loyal Community', color: 'var(--success-color)', desc: 'Excellent! Most accounts you follow follow you back.' };
    if (ratio >= 50) return { label: 'Balanced Network', color: 'var(--accent-blue)', desc: 'Healthy follow back rate. Standard social network balance.' };
    if (ratio >= 30) return { label: 'Creator Profile', color: 'var(--accent-purple)', desc: 'You follow more accounts than follow you back. Normal for brands.' };
    return { label: 'Unbalanced', color: 'var(--danger-color)', desc: 'Your network is heavily one-sided. Perfect time to clean up!' };
  };

  const statusInfo = getRatioStatus(followBackRatio);

  // SVG Circle configuration for circular progress meter
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (followBackRatio / 100) * circumference;

  const cardData = [
    {
      id: 'notFollowingBack',
      title: 'Not Following Back',
      value: notFollowingBackCount,
      desc: 'People you follow, but they do not follow you back.',
      icon: <UserX size={26} style={{ color: 'var(--danger-color)' }} />,
      colorClass: 'danger',
      actionText: 'View Unfollowers'
    },
    {
      id: 'dontFollowBack',
      title: "Fans (You Don't Follow)",
      value: dontFollowBackCount,
      desc: 'People who follow you, but you do not follow them back.',
      icon: <Heart size={26} style={{ color: 'var(--accent-pink)' }} />,
      colorClass: 'success',
      actionText: 'View Fans'
    },
    {
      id: 'mutuals',
      title: 'Mutual Followers',
      value: mutualCount,
      desc: 'People you follow and who follow you back.',
      icon: <UserCheck size={26} style={{ color: 'var(--success-color)' }} />,
      colorClass: 'primary',
      actionText: 'View Mutuals'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Upper Grid: Quick Stats & Circle Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Core Stats overview */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Connection Overview
            </h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Instagram Metrics</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <Users size={14} /> Followers
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalFollowers}</div>
            </div>
            
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <Users size={14} /> Following
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalFollowing}</div>
            </div>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="glass-panel" style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(131, 58, 180, 0.03) 0%, rgba(253, 29, 29, 0.01) 100%)'
        }}>
          {/* Circular SVG */}
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg height="120" width="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                stroke="rgba(255, 255, 255, 0.04)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="60"
                cy="60"
              />
              <circle
                stroke="url(#instaGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                r={normalizedRadius}
                cx="60"
                cy="60"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c13584" />
                  <stop offset="50%" stopColor="#f77737" />
                  <stop offset="100%" stopColor="#fcaf45" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {followBackRatio}%
              </span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
              <TrendingUp size={14} style={{ color: 'var(--accent-pink)' }} /> Follow Back Rate
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: statusInfo.color, marginBottom: '0.5rem' }}>
              {statusInfo.label}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {statusInfo.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {cardData.map((card) => (
          <div 
            key={card.id} 
            className="glass-panel card-hover" 
            style={{ 
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ 
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px'
                }}>
                  {card.icon}
                </span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  {card.value}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {card.desc}
              </p>
            </div>

            <button
              onClick={() => onTabChange(card.id)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                e.target.style.borderColor = 'var(--border-color)';
              }}
            >
              {card.actionText}
              <ArrowUpRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Network Distribution Visualizer */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Network Distribution Visualizer
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Following breakdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Following Breakdown ({totalFollowing} accounts)</span>
              <span>{followBackRatio}% Mutual / {100 - followBackRatio}% Unfollowers</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${followBackRatio}%`, height: '100%', background: 'var(--instagram-gradient)' }} title={`Mutuals: ${mutualCount}`} />
              <div style={{ width: `${100 - followBackRatio}%`, height: '100%', background: 'var(--danger-color)' }} title={`Not Following Back: ${notFollowingBackCount}`} />
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--instagram-gradient)' }} />
              Mutual (You follow each other)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--danger-color)' }} />
              Unfollowers (You follow, they don't follow back)
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover);
          box-shadow: 0 15px 35px 0 rgba(0, 0, 0, 0.45);
        }
      `}</style>

    </div>
  );
}
