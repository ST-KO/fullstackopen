const Persons = ({filteredArray}) => {
    return (
      <div>
        {
          filteredArray.map(person => <p key={person.name}>{person.name} {person.number}</p>)
        }
      </div>
    )
}

export default Persons;