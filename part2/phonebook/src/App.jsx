import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');

  const getAllPersons = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response);
      })
  }
  useEffect(() => {
    getAllPersons();
  }, []);


  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhoneNumber
    }
    // Look for duplications and add new datas to persons array only if there isn't any duplication
    const name = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
    const number = persons.find(person => person.number === newPhoneNumber);
    if(!name) {
      personService
        .createPerson(personObject)
        .then(response => {
          setPersons(persons.concat(response));
          setNewName('');
          setNewPhoneNumber('');
        })
     
    } else if(name && !number) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService
          .updatePerson(name.id, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id === name.id ? response : person));
            setNewName('');
            setNewPhoneNumber('');
          })
      }
    }
    else {
      alert(`${newName} is already added to phonebook.`)
    }
  }

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete ${name}`)){
      personService
        .deletePerson(id)
        setPersons(persons.filter(person => person.id !== id))
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
      
      <Persons filteredArray={filteredArray} deletePerson={deletePerson} />
    </div>
  )
}

export default App