<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  // import('./$types').LayoutData
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  console.log(2222, 'data from layout', data);
  // Create a store and update it when necessary...
  // const csv = writable();
  // $: csv.set('this is a test');

  // ...and add it to the context for child components to access
  // setContext('csv', csv);
</script>

<svelte:head>
  <title>{$page.data.title || 'Hello world'}</title>
</svelte:head>

<slot />

<style>
  :global(body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    font-family: Hack, Arial, Helvetica, sans-serif;
  }

  :global(.button) {
    align-items: center;
    background-color: #0a66c2;
    border: 0;
    border-radius: 100px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: inline-flex;
    font-family: -apple-system, system-ui, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen,
      'Oxygen Sans', Cantarell, 'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Lucida Grande',
      Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 20px;
    max-width: 480px;
    min-height: 40px;
    min-width: 0px;
    overflow: hidden;
    padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    touch-action: manipulation;
    transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s,
      box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    width: fit-content;
  }

  :global(.button:hover),
  :global(.button:focus) {
    background-color: #16437e;
    color: #ffffff;
  }

  :global(.button:active) {
    background: #09223b;
    color: rgb(255, 255, 255, 0.7);
  }

  :global(.button:disabled) {
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.3);
  }
</style>
