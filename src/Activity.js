import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Activity = () => {
  const [course, setCourse] = useState([]);

  useEffect(() => {
    // Fetch data from Django API
    axios.get('http://127.0.0.1:8000/activity/')
      .then(response => {
        setCourse(response.data);
        console.log("Response:..................",response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  console.log("Activity:..................",course);
  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {course.map(eachCourse => (
          <li key={eachCourse.course_id}>
            <h2>Activyity ID: {eachCourse.activityID}</h2>
            <p>Activity Type: {eachCourse.activityType}</p>
            <p>userID: {eachCourse.userID}</p>
            {/* <p>Dept_name: {eachCourse.dept_name}</p> */}

            {/* <p>Added on: {new Date(eachCourse.created_at).toLocaleString()}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activity;
