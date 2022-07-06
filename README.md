### Chart.js 3.7.1 update problem with changing data

Context: Simple line chart with point objects, fixed scales (min, max)

An update of dataset's data with additional points causes chart.js to synchronously create empty PointElement instances (buildOrUpdateElements)

Subsequently, LineController checks for visible points (getStartAndCountOfVisiblePoints). If added points lie on or beyond an axis' bounds, previously created PointElement instances remain uninitialized.

If then the user interacts with the chart (hover / click), an Error is thrown, as evaluation functions (e.g. for displaying tooltips) try to access a PointElement's options, which are undefined.

This is causing the chart / app to crash.

Steps to reproduce:

- Start the app
- Wait for 2 secs until data is updated
- Interact with the chart --> Error is thrown
