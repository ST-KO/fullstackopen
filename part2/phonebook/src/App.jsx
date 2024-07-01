import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = (event) => {
    event.preventDefault();

    // Look for duplications and add new datas to persons array only if there isn't any duplication
    const name = persons.find(person => person.name === newName);
    if(!name) {
      const personObject = {
        name: newName,
        number: newPhoneNumber
      }
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewPhoneNumber('');
    } else {
      alert(`${newName} is already added to phonebook.`)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  }

  const handleFilter = (event) => {
    setFilter(event.target.value);
  }

  const filteredArray = filter ?
    persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : 
    persons

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter filter={filter} handleFilter={handleFilter} />
      
      <h3>Add a new</h3>
      
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newPhoneNumber={newPhoneNumber} 
        handlePhoneNumberChange={handlePhoneNumberChange}
      />
      
      <h3>Numbers</h3>
      
      <Persons filteredArray={filteredArray} />
    </div>
  )
}

export default App