import { Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

function Search() {
  return (
    <Navbar>
  <form className="px-0 py-2 w-screen">
    <TextInput
      type="text"
      placeholder="Search.."
      rightIcon={AiOutlineSearch}
      className="border-b-2 border-solid border-gray-300"
    />
  </form>
</Navbar>

  )
}

export default Search