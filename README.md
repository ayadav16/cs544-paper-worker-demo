Name:		Apoorv Yadav
B-Number:	B00977654
Email:		ayadav7@binghamton.edu

CS544 Paper
Topic: Web Worker


Steps to run:

1. Clone the Repo:
```
git clone 
```

2. Install the dependencies
```
npm ci
```

3. Run the server:
```
npm start
```

### Objective:
Via this demo, we aim to demonstrate the functionality of worker threads. We are delegating calculations to the worker thread while keeping the main thread available to the user for interation. As expected, when we generated high number of random numbers,
we can see responsive web page as opposed to using main thread for every task.

### Project Structure
Apart from the index.html and index.js, we have three worker files as below:
1. bellWorker.js
    It is used to create the worker object that takes a number as message and generates 1-D array of random numbers. The numbers are constrained to not repeat more than a specific times.
2. bellStatsWorker.js
    It is used to calculate mean and standard deviation of the array which is plotted in bell chart and histogram plot.
3. scatterWorker.js
    It is used to create the worker object that takes a number as message and generates array of unique random points.

### References:
1. Web Workers Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
2. HighCharts library: https://www.highcharts.com
3. Bulma CSS: https://bulma.io
4. Bell Curve, STD points plot code inspired from: https://www.highcharts.com/docs/chart-and-series-types/bell-curve-series