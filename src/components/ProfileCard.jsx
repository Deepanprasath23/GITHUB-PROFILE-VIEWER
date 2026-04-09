import { FiMapPin, FiBriefcase, FiLink, FiTwitter, FiMail } from 'react-icons/fi';
import { FaUsers, FaUserFriends } from 'react-icons/fa';
import { formatNumber } from '../api';

export default function ProfileCard({ profile }) {
  if (!profile) return null;
  
  return (
    <div className="profile-section">
      <div className="glass-card profile-card">
        <div className="profile-avatar-wrapper">
          <img 
            className="profile-avatar" 
            src={profile.avatar_url} 
            alt={`${profile.login}'s avatar`} 
          />
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">{profile.name || profile.login}</h2>
          <div className="profile-username">@{profile.login}</div>
          
          {profile.bio && (
            <p className="profile-bio">{profile.bio}</p>
          )}
          
          <div className="profile-meta">
            {profile.location && (
              <span className="profile-meta-item">
                <FiMapPin /> {profile.location}
              </span>
            )}
            {profile.company && (
              <span className="profile-meta-item">
                <FiBriefcase /> {profile.company}
              </span>
            )}
            {profile.blog && (
              <span className="profile-meta-item">
                <FiLink /> 
                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} 
                   target="_blank" rel="noopener noreferrer">
                  {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
            {profile.twitter_username && (
              <span className="profile-meta-item">
                <FiTwitter /> @{profile.twitter_username}
              </span>
            )}
            {profile.email && (
              <span className="profile-meta-item">
                <FiMail /> {profile.email}
              </span>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{formatNumber(profile.followers)}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{formatNumber(profile.following)}</div>
              <div className="profile-stat-label">Following</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{formatNumber(profile.public_repos)}</div>
              <div className="profile-stat-label">Repos</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{formatNumber(profile.public_gists || 0)}</div>
              <div className="profile-stat-label">Gists</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
