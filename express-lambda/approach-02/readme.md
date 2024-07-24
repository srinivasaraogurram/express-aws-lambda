#  Express.js REST API into AWS Lambda functions using AWS SAM 


### Step-by-Step Approach

#### 1. Understand the Express.js App
First, ensure you have a clear understanding of your existing Express.js app. Typically, it will have routes defined in a single file or across multiple files.

Example Express.js app (`app.js`):

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/users', (req, res) => {
    res.send('GET /users');
});

app.post('/users', (req, res) => {
    res.send('POST /users');
});

app.get('/users/:id', (req, res) => {
    res.send(`GET /users/${req.params.id}`);
});

app.put('/users/:id', (req, res) => {
    res.send(`PUT /users/${req.params.id}`);
});

app.delete('/users/:id', (req, res) => {
    res.send(`DELETE /users/${req.params.id}`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
```

#### 2. Set Up AWS SAM
Install AWS SAM CLI if you haven't already:

```bash
pip install aws-sam-cli
```

Initialize a new AWS SAM project:

```bash
sam init
```

Choose a template, typically "AWS Quick Start Templates" and "nodejs14.x".

#### 3. Create Lambda Functions for Each Endpoint
For each endpoint in your Express.js app, create a separate Lambda function.

**Example folder structure:**

```
express-to-sam/
│
├── template.yaml
└── src/
    ├── getUsers/
    │   └── app.js
    ├── postUser/
    │   └── app.js
    ├── getUserById/
    │   └── app.js
    ├── putUser/
    │   └── app.js
    └── deleteUser/
        └── app.js
```

#### 4. Write Lambda Function Code
Each `app.js` in the respective folders should handle the specific route logic.

**Example `getUsers/app.js`:**

```javascript
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify('GET /users')
    };
};
```

**Example `postUser/app.js`:**

```javascript
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify('POST /users')
    };
};
```

#### 5. Define API Gateway and Lambda Functions in SAM Template
Your `template.yaml` should define the API Gateway and map each route to its corresponding Lambda function.

**Example `template.yaml`:**

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Description: Sample REST API

Resources:
  GetUsersFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: src/getUsers/app.handler
      Runtime: nodejs14.x
      Events:
        GetUsers:
          Type: Api
          Properties:
            Path: /users
            Method: get

  PostUserFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: src/postUser/app.handler
      Runtime: nodejs14.x
      Events:
        PostUser:
          Type: Api
          Properties:
            Path: /users
            Method: post

  GetUserByIdFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: src/getUserById/app.handler
      Runtime: nodejs14.x
      Events:
        GetUserById:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: get

  PutUserFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: src/putUser/app.handler
      Runtime: nodejs14.x
      Events:
        PutUser:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: put

  DeleteUserFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: src/deleteUser/app.handler
      Runtime: nodejs14.x
      Events:
        DeleteUser:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: delete
```

#### 6. Deploy the SAM Application
Build and deploy your SAM application:

```bash
sam build
sam deploy --guided
```


