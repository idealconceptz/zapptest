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
I haven't bothered with services to call API endpoint purely for convenience, but in a larger project I would remove all hard-coded enpoints from the components & front-end code and keep them all together in a more maintainable format.

## Error Handling
Html forms use basic html validation, with some simple validation for entering a store. For a more robust solution I'd use Zod.
I've also put some simple validation on the API endpoints.
I've used Toast to ensure errors are seen, and to confirm when data is saved.