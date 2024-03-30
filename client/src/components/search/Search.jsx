import { Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

function Search() {
  return (
    <div className='min-h-screen mt-16'>
      <form className="px-5 md:px-52 py-2">
        <TextInput
          type="text"
          placeholder="Search.."
          rightIcon={AiOutlineSearch}
          className="border-b-2 border-solid border-gray-300"
        />
      </form>
    </div>
  )
}

export default Search