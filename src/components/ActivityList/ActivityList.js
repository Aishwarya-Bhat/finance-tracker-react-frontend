import React from 'react';
import './ActivityList.css';

function ActivityList({ activities }) {
  return (
    <ul className="activity-list">
      {activities.map((activity) => (
        <li key={activity.id} className="activity-item">
          <span>{activity.description}</span>
          <span className={activity.amount < 0 ? 'expense' : 'income'}>
            ${activity.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ActivityList;
