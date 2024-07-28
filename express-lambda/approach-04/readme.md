
# Flight Application with CRUD Operations in Express.js and AWS SAM

## Step 1: Setting up the Express.js Application

1. **Create a project directory:**

    ```bash
    mkdir flight-app
    cd flight-app
    ```

2. **Initialize the Node.js project:**

    ```bash
    npm init -y
    ```

3. **Install dependencies:**

    ```bash
    npm install express aws-sdk
    ```

4. **Create the project structure:**

    ```bash
    mkdir src
    touch src/index.js
    ```

5. **Create the Express.js application in `src/index.js`:**

    ```javascript
    const express = require('express');
    const app = express();
    const port = 3000;

    app.use(express.json());

    let flights = [];

    // Create a flight
    app.post('/flights', (req, res) => {
        const flight = req.body;
        flights.push(flight);
        res.status(201).send(flight);
    });

    // Read all flights
    app.get('/flights', (req, res) => {
        res.send(flights);
    });

    // Read a flight by id
    app.get('/flights/:id', (req, res) => {
        const flight = flights.find(f => f.id === parseInt(req.params.id));
        if (!flight) return res.status(404).send('Flight not found');
        res.send(flight);
    });

    // Update a flight by id
    app.put('/flights/:id', (req, res) => {
        const flight = flights.find(f => f.id === parseInt(req.params.id));
        if (!flight) return res.status(404).send('Flight not found');

        Object.assign(flight, req.body);
        res.send(flight);
    });

    // Delete a flight by id
    app.delete('/flights/:id', (req, res) => {
        const flightIndex = flights.findIndex(f => f.id === parseInt(req.params.id));
        if (flightIndex === -1) return res.status(404).send('Flight not found');

        const deletedFlight = flights.splice(flightIndex, 1);
        res.send(deletedFlight);
    });

    app.listen(port, () => {
        console.log(`Flight app listening at http://localhost:${port}`);
    });
    ```

6. **Create `package.json`:**

    Ensure your `package.json` includes the following scripts:

    ```json
    {
      "name": "flight-app",
      "version": "1.0.0",
      "main": "src/index.js",
      "scripts": {
        "start": "node src/index.js"
      },
      "dependencies": {
        "express": "^4.17.1",
        "aws-sdk": "^2.953.0"
      }
    }
    ```

## Step 2: Adding AWS SAM Template

1. **Create an AWS SAM template file:**

    ```bash
    touch template.yaml
    ```

2. **Add the following content to `template.yaml`:**

    ```yaml
    AWSTemplateFormatVersion: '2010-09-09'
    Transform: 'AWS::Serverless-2016-10-31'
    Resources:
      CreateFlightFunction:
        Type: 'AWS::Serverless::Function'
        Properties:
          Handler: src/index.createFlight
          Runtime: nodejs14.x
          Events:
            CreateFlight:
              Type: Api
              Properties:
                Path: /flights
                Method: post

      ReadFlightsFunction:
        Type: 'AWS::Serverless::Function'
        Properties:
          Handler: src/index.readFlights
          Runtime: nodejs14.x
          Events:
            ReadFlights:
              Type: Api
              Properties:
                Path: /flights
                Method: get

      ReadFlightFunction:
        Type: 'AWS::Serverless::Function'
        Properties:
          Handler: src/index.readFlight
          Runtime: nodejs14.x
          Events:
            ReadFlight:
              Type: Api
              Properties:
                Path: /flights/{id}
                Method: get

      UpdateFlightFunction:
        Type: 'AWS::Serverless::Function'
        Properties:
          Handler: src/index.updateFlight
          Runtime: nodejs14.x
          Events:
            UpdateFlight:
              Type: Api
              Properties:
                Path: /flights/{id}
                Method: put

      DeleteFlightFunction:
        Type: 'AWS::Serverless::Function'
        Properties:
          Handler: src/index.deleteFlight
          Runtime: nodejs14.x
          Events:
            DeleteFlight:
              Type: Api
              Properties:
                Path: /flights/{id}
                Method: delete
    ```

## Step 3: Convert Handlers for AWS Lambda

1. **Modify `src/index.js` to separate the handlers:**

    ```javascript
    const express = require('express');
    const app = express();
    app.use(express.json());

    let flights = [];

    const createFlight = (req, res) => {
        const flight = req.body;
        flights.push(flight);
        res.status(201).send(flight);
    };

    const readFlights = (req, res) => {
        res.send(flights);
    };

    const readFlight = (req, res) => {
        const flight = flights.find(f => f.id === parseInt(req.params.id));
        if (!flight) return res.status(404).send('Flight not found');
        res.send(flight);
    };

    const updateFlight = (req, res) => {
        const flight = flights.find(f => f.id === parseInt(req.params.id));
        if (!flight) return res.status(404).send('Flight not found');

        Object.assign(flight, req.body);
        res.send(flight);
    };

    const deleteFlight = (req, res) => {
        const flightIndex = flights.findIndex(f => f.id === parseInt(req.params.id));
        if (flightIndex === -1) return res.status(404).send('Flight not found');

        const deletedFlight = flights.splice(flightIndex, 1);
        res.send(deletedFlight);
    };

    app.post('/flights', createFlight);
    app.get('/flights', readFlights);
    app.get('/flights/:id', readFlight);
    app.put('/flights/:id', updateFlight);
    app.delete('/flights/:id', deleteFlight);

    module.exports = {
        createFlight,
        readFlights,
        readFlight,
        updateFlight,
        deleteFlight
    };

    if (require.main === module) {
        const port = 3000;
        app.listen(port, () => {
            console.log(`Flight app listening at http://localhost:${port}`);
        });
    }
    ```

## Step 4: Packaging and Deploying to AWS

1. **Create the zip file:**

    ```bash
    zip -r flight-app.zip .
    ```

2. **Deploying with AWS SAM:**

- **Install AWS SAM CLI:**
  Follow the instructions [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

- **Build and package the application:**

    ```bash
    sam build
    sam package --output-template-file packaged.yaml --s3-bucket YOUR_S3_BUCKET_NAME
    ```

- **Deploy the application:**

    ```bash
    sam deploy --template-file packaged.yaml --stack-name flight-app --capabilities CAPABILITY_IAM
    ```

## Step 5: Instructions for Execution and Deployment

1. **Clone the repository:**

    ```bash
    git clone YOUR_REPOSITORY_URL
    cd flight-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run locally:**

    ```bash
    npm start
    ```

4. **Deploy to AWS:**

    ```bash
    sam build
    sam package --output-template-file packaged.yaml --s3-bucket YOUR_S3_BUCKET_NAME
    aws s3 rm 
    sam package --output-template-file packaged.yaml --s3-bucket expressjs-to-aws-lambda
    sam deploy --template-file packaged.yaml --stack-name flight-app --capabilities CAPABILITY_IAM
    ```
