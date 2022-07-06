### Chart.js 3.7.1 update problem with changing data

Edit on [Stackblitz](https://stackblitz.com/edit/typescript-w1ahqk).

Context: Simple line chart with point objects, fixed scales (min, max)

An update of dataset's data with additional points causes chart.js to synchronously create empty PointElement instances (buildOrUpdateElements)

Subsequently, LineController checks for visible points (getStartAndCountOfVisiblePoints). If added points lie on or beyond an axis' bounds, previously created PointElement instances remain uninitialized.

If then the user interacts with the chart (hover / click), an Error is thrown, as evaluation functions (e.g. for displaying tooltips) try to access a PointElement's options, which are undefined.

**Error in /turbo_modules/chart.js@3.7.1/dist/chart.js (9319:84)**
**Cannot read properties of undefined (reading 'hitRadius')**

This is causing the chart / app to crash.

Steps to reproduce:

- Start the app
- Wait for 2 secs until data is updated
- Interact with the chart --> Error is thrown
