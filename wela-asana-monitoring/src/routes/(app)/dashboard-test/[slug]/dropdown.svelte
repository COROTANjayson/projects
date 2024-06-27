<!-- Dropdown.svelte -->
<script lang="ts">
	import { onMount } from "svelte";

    export let classProp = 'w-[200px]';
    export let buttonClass = '';

    let isOpen = false;
    const toggleDropdown = () => {
      isOpen = !isOpen;
    }

    let buttonId:string
    let dropdownID:string
    
    const handleClickOutside = (event:any) => {
        const button:any = document.getElementById(buttonId);
        const dropdown:any = document.getElementById(dropdownID);
        if (isOpen && !button.contains(event.target) && !dropdown.contains(event.target)) {
            isOpen = false;
        }
    }
    onMount(() => {
      const randomMilliseconds = Math.floor(Math.random() * (24 * 60 * 60 * 1000)); // Random milliseconds between 0 and 1 day
      buttonId = "button-"+randomMilliseconds
      dropdownID = "dropdown-"+randomMilliseconds
      document.addEventListener('click', handleClickOutside);
      // Listen for clicks outside the dropdown to close it
      document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
   
  </script>
  
  <div class={"relative " + classProp }>
    <button
        id={buttonId}
        class={"focus:outline-none "+buttonClass }
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        on:click={toggleDropdown}
    >
        <slot></slot>
    </button>
  
    {#if isOpen}
      <div
        id={dropdownID}
       class="w-full absolute z-10 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <slot name="dropdown-content"></slot>
      </div>
    {/if}
  </div>
  
  <style>
    /* Add your custom styles here */
    /* Tailwind CSS classes are used directly in the template */
  </style>