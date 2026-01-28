// Header component - displays the course name
const Header = (props) => {
  return <h1>{props.course}</h1>
}

// Part component - displays part name and exercises
const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

// Content component - renders all parts
const Content = (props) => {
  return (
    <div>
      <Part name={props.part1} exercises={props.exercises1} />
      <Part name={props.part2} exercises={props.exercises2} />
      <Part name={props.part3} exercises={props.exercises3} />
    </div>
  )
}

// Total component - displays total number of exercises
const Total = (props) => {
  return (
    <p>Number of exercises {props.total}</p>
  )
}

// App component - main application
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1}
        exercises1={exercises1}
        part2={part2}
        exercises2={exercises2}
        part3={part3}
        exercises3={exercises3}
      />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
