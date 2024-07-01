import React from 'react';

const Header = ({heading}) => {
    return (
        <h1>{heading}</h1>
    )
}

const TotalExercises = ({parts}) => {
    const totalExercisese = parts.reduce((sum, part) => sum + part.exercises, 0)
    
    return (
        <p><b>total of {totalExercisese} exercises</b></p>
    )
}

const Content = ({name, exercises}) => {
    return (
        <p>{name} {exercises}</p>
    )
}

const Course = ({courses}) => {
  return (
    <div>
        <Header heading={courses.name} />
        {
            courses.parts.map(course => 
                <Content key={course.id} name={course.name} exercises={course.exercises} />
            )
        }
        <TotalExercises parts={courses.parts} />
    </div>
  );
};

export default Course;