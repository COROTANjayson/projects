import { readable, writable } from 'svelte/store';
import { createTable } from 'svelte-headless-table';
const data = writable([
	{ name: 'Ada Lovelace', age: 21 },
	{ name: 'Barbara Liskov', age: 52 },
	{ name: 'Richard Hamming', age: 38 }
]);

const table = createTable(data);

const columns = table.createColumns([
    table.column({
      header: 'Name',
      accessor: 'name',
    }),
    table.column({
      header: 'Age',
      accessor: 'age',
    }),
  ]);