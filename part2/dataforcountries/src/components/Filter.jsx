const Filter = ({country, handleFilter}) => {
    return (
      <form>
        find countries <input value={country} onChange={handleFilter} />
      </form>
    )
}