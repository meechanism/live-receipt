# Web Live Receipts View

Notes/Caveats:
- Sample data is from retailer/orders. This going to change, but it was
    the only example data I could get my hands on.
- We do NOT have to use mustache or json. Possible the server might just spit
    out data directly into the template.
    - But if the server can print out json data into a JS variable on the page,
        that would be good too. This will allow the frontend to determine logic
        around images (unless the serverside wants to hande that too) and some
        property conversion (such as orderDate) and currency type.
- The design is *NOT* finalized. Please work with CX team and product to figure
    out next steps. EG: Talk with Tristan (who will work with Hector/Teddy).

# Install and Build

Clone repo and:

```sh
$ npm install
$ npm run build
```

You should see a new file generated `public/index.html` that will contain
the web live receipt view with the example data found in `src/order.json`.
You do not currently need a server to serve this, so you can open the file
in your browser.

Note: there is currently no build watch. EG: everytime you make a change, you
will have to rebuild. :laughing: