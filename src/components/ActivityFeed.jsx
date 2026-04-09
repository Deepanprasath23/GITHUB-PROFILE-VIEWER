import { formatDistanceToNow } from 'date-fns';

function getEventInfo(event) {
  const repo = event.repo?.name || '';
  const repoShort = repo.split('/').pop();
  
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits?.length || 0;
      return {
        type: 'push',
        label: 'Push',
        description: (
          <>Pushed <strong>{commits} commit{commits !== 1 ? 's' : ''}</strong> to <strong>{repoShort}</strong></>
        ),
      };
    }
    case 'CreateEvent': {
      const refType = event.payload?.ref_type || 'repository';
      return {
        type: 'create',
        label: 'Create',
        description: (
          <>Created {refType} {event.payload?.ref ? <strong>{event.payload.ref}</strong> : ''} in <strong>{repoShort}</strong></>
        ),
      };
    }
    case 'WatchEvent':
      return {
        type: 'star',
        label: 'Star',
        description: (<>Starred <strong>{repoShort}</strong></>),
      };
    case 'ForkEvent':
      return {
        type: 'fork',
        label: 'Fork',
        description: (<>Forked <strong>{repoShort}</strong></>),
      };
    case 'IssuesEvent': {
      const action = event.payload?.action || 'updated';
      return {
        type: 'issue',
        label: 'Issue',
        description: (<>{action.charAt(0).toUpperCase() + action.slice(1)} an issue in <strong>{repoShort}</strong></>),
      };
    }
    case 'IssueCommentEvent':
      return {
        type: 'issue',
        label: 'Comment',
        description: (<>Commented on an issue in <strong>{repoShort}</strong></>),
      };
    case 'PullRequestEvent': {
      const prAction = event.payload?.action || 'updated';
      return {
        type: 'pr',
        label: 'Pull Request',
        description: (<>{prAction.charAt(0).toUpperCase() + prAction.slice(1)} a pull request in <strong>{repoShort}</strong></>),
      };
    }
    case 'PullRequestReviewEvent':
      return {
        type: 'pr',
        label: 'Review',
        description: (<>Reviewed a pull request in <strong>{repoShort}</strong></>),
      };
    case 'DeleteEvent':
      return {
        type: 'create',
        label: 'Delete',
        description: (<>Deleted {event.payload?.ref_type} <strong>{event.payload?.ref}</strong> in <strong>{repoShort}</strong></>),
      };
    case 'ReleaseEvent':
      return {
        type: 'create',
        label: 'Release',
        description: (<>Published release in <strong>{repoShort}</strong></>),
      };
    default:
      return {
        type: 'push',
        label: event.type.replace('Event', ''),
        description: (<>Activity in <strong>{repoShort}</strong></>),
      };
  }
}

export default function ActivityFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="glass-card activity-section">
        <div className="section-header">
          <h3 className="section-title">
            <span className="icon">📡</span> Recent Activity
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          No recent public activity found.
        </p>
      </div>
    );
  }
  
  return (
    <div className="glass-card activity-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">📡</span> Recent Activity
        </h3>
      </div>
      
      <div className="activity-timeline">
        {events.slice(0, 20).map((event, i) => {
          const info = getEventInfo(event);
          return (
            <div key={event.id || i} className={`activity-item ${info.type}`}>
              <div className="activity-type">{info.label}</div>
              <div className="activity-description">{info.description}</div>
              <div className="activity-time">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
