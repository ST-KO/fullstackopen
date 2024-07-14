import Button from "./Button";

const PersonForm = ({addPerson, newName, handleNameChange, newPhoneNumber, handlePhoneNumberChange}) => {
    return (
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newPhoneNumber} onChange={handlePhoneNumberChange} />
        </div>
        <div>
          <Button name={"add"} />
        </div>
      </form>
    )
}

export default PersonForm;