#!/bin/bash
echo "Nice! Let's mine some Achus together."

npm install

npm install --prefix api

npm install --prefix frontend

npm run build

npm run dev --prefix api