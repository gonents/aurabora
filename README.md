# AuraBora
Top-notch blazing fast E2E UI and API autmation.

[AuraBora](https://aurabora.com/) is a Web and API testing system based on [Playwright](https://github.com/microsoft/playwright/) framework

## Installation
As easy as clone and install.
Clone the repo to your local machine and run command:
```bash
npm install

```

### .env File
If you run tests locally you can create a `.env` file and add the following:
```bash
ZONE=prod
RETRIES=3
```
AuraBora can run locally with or without the file nor any missing environment variables.  


## Usage
```bash
npx playwright test --project='unitySanity'
```

### Run on a specific Browser
Specify the browser name after the `--project` flag.
```bash
npx playwright test --project=Safari
```
```bash
npx playwright test --project='Microsoft Edge'
```
The supported browsers list is located in `playwright.config.ts` file.

### Run in headed (UI) mode
Use the `--headed` flag to run your tests with the ability to visually see the interacts:
```bash
npx playwright test --project=chromium --headed
```

### Run in Debug mode (developers view with Playwright Inspector)
Use the `--debug` flag to run in debugging mode 
```bash
npx playwright test --project=chromium --debug
```

## Connect to CI (Jenkins or Github Actions)
### Jenkins
Config a Jenkins job and use `Jenkinsfile_run_single_shard` file to run AuraBora on Jenkins.
You can run the job on a Jenkins agent or a dedicated docker.
The Jenkins job uploads the run report and tests videos to S3 bucket by default.

### Github Actions
This will start the tests after a GitHub Deployment went into the success state.
Click on the Actions tab to see the workflows. Here you will see if your tests have passed or failed.


## View Test Report
### Local
By default, the report is opened automatically if some of the tests failed, otherwise you can open it with the following command:
```bash
npx playwright show-report
```

### Jenkins
The report is located in the jenkins job page.
Find the link `report` from the list on the left side, or just add `report` in the end of the url (`../{JOB_NAME}/{BUILD_NUMBER}/report`) 

### Github Actions
In the Artifacts section click on the playwright-report to download your report in the format of a zip file.
Locally opening the report will not work as expected as you need a web server in order for everything to work correctly. First, extract the zip, preferably in a folder that already has Playwright installed. Using the command line change into the directory where the report is and use `npx playwright show-report` followed by the name of the extracted folder. This will serve up the report and enable you to view it in your browser.

Once you have served the report using `npx playwright show-report`, click on the trace icon next to the test's file name as seen in the image above. You can then view the trace of your tests and inspect each action to try to find out why the tests are failing.