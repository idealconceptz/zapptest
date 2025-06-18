## Getting Started

First, install dependencies and run the development server:

```bash
npm i

and 

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Overview

I opted for SQLite Cloud so no extra setting up required.  
I would normally use Postgres or something and even with SQLite, I'd consider using an ORM if I had more time.  
I haven't bothered with services to call API endpoints purely for convenience, but in a larger project I would remove all hard-coded endpoints from the components & front-end code and keep them all together in a more maintainable format.  

Although I'd assume the SKU is unique for each product, because the data has multiple stores, I'd assume that the sku's in the data could be repeated, i.e. more than one store has the sae SKU's.  

I chose to parse the csv into an array of JSON items client side, as we generally POST items to the server for storing, and the alternative, convert to a buffer and then back again was more complicated.  

I chose to code the upload operation as a server action as again it was simpler, and it likely will only be used in one place in the dashboard.  

With more time, there's more I could do to make it more robust, but I gave myself a time limit.  

## Error Handling
Html forms use basic html validation, with some simple validation for entering a store. For a more robust solution I'd probably use Zod.  
I've also put some simple validation on the API endpoints.  
I've used Toast to ensure errors are seen, and to confirm when data is saved.  