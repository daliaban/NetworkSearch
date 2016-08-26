# NetworkSearch

The application can be run on Node

1. 'npm install'
2. 'grunt serve'

and can be accessed on port 9000 on localhost

The first page #/index is an overview and lists all searches, using the API - http://c7webtest.azurewebsites.net/searches

The searches could not be sorted as they don't include the INDEX as part of the result, rather the INDEX is the order as they appear.

On clicking on the name of a search, it takes to details page, where is shows the Description od the search and files found.

There is a link to go back to main page.

The search/filter panel lists -

1. Search on the file path. A minimum of 3 characters need to be entered to search. Only \ and alphabets are allowed in the search.
2. Filter by file size. Only integers allowed as size
3. Filter by last used date. Only the Date is used in filter, i.e., the entered date is considered timestamped as 00 hours.

The results per page can be changed between 10, 50 or 100 items per page.

The File Path and Size columns are sortable.

To improve both page load time and correctness, minimum of (10000, search.Count)  files are fetched in the first go, and once all 10000 files are paginated through,
the next 10000 are fetched, used by this API - http://c7webtest.azurewebsites.net/searches/3/results?start=0&size=10000

For search / filter, the remaining files (if any) are fetched, only for the first time and kept in browser memory for that state. Hence, subsequent operations on the same search becomes faster.