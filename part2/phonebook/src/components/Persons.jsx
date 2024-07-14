import Button from "./Button";

const Persons = ({filteredArray, deletePerson}) => {
    return (
      <div>
        {
          filteredArray.map(person => 
            <p key={person.name}>
              {person.name} {person.number}
              {" "} 
              <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
            </p>
          )
        }
      </div>
    )
}

export default Persons;