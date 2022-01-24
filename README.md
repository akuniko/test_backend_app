# code assignment

> I would like you to create a website that shows data collected by the Economist website (https://www.economist.com/). The data should be provided by an API infrastructure.

# Features

- [x] Show in a website a list of articles from the Economist website
- [x] Create an authentication system with a simple signup and login setup
- [x] Create an API infrastructure that gives back the list of article and single article information (only to logged-in
  users)

# Description

App has 4 endpoints:

- POST /api/auth/signup with body `{ username, password }`--> create new unique user and return jwt
- POST /api/auth/login with body `{ username, password }` --> authenticate user and return jwt
- GET /api/articles --> returns list of articles scrapped from economist website
- GET /api/articles/:base64Url --> returns article details

## Dependencies

- express web framework for node
- mongoDB to persistence user credentials
- puppeteer to scrapped articles
- passport to handle authorization

# TODO

- [x] add prettier
- [x] add ESlint
- [ ] add formatting before a commit eg. Husky
- [ ] add tests eg. jest
- [ ] add logger eg. Winston
- [ ] add request log eg. Morgan
- [ ] add CI/CD scripts
- [ ] add cache for articles
- [ ] add docker to be able to run app out of the box with db
- [ ] add API docs eg. swagger
