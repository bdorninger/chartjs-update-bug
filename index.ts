// Import stylesheets
import { ChartConfiguration, ChartData, ScatterDataPoint } from 'chart.js';
import Chart from 'chart.js/auto';
import './style.css';

let updateRequested = false;

let initialPoints = [
  { x: 10, y: 20 },
  { x: 15, y: 19 },
];
let points = [
  { x: 10, y: 20 },
  { x: 15, y: 19 },
  { x: 17, y: 12 },
  { x: 50, y: 9 },
  { x: 50, y: 9 },
  { x: 50, y: 9 },
];

const data: ChartData<'line'> = {
  datasets: [
    {
      type: 'line',
      label: 'Dataset 1',
      data: initialPoints,
      borderColor: '#ff00ff',
      backgroundColor: '#000000',
    },
  ],
};
//
const config: ChartConfiguration<'line'> = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    onClick: (ev, elems, ch) => {
      console.log(`chart-clicked`);
      const mev = ev.native as MouseEvent;
      const curPoints = ch.data.datasets[0].data as ScatterDataPoint[];
      if (mev.altKey && curPoints.length < points.length) {
        ch.data.datasets[0].data = points;
      } else {
        const newpoints = curPoints.map((p) => ({
          y: p.y, // + Math.random() * (Math.random() >= 0.5 ? 1 : -1),
          x: p.x + (mev.ctrlKey ? -1 : 0) + (mev.shiftKey ? 1 : 0),
        }));
        //  points = newpoints;
        ch.data.datasets[0].data = newpoints;
      }
      requestChartUpdate(ch, 'normal');
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        min: 0,
        max: 25,
      },
      x: {
        type: 'linear',
        beginAtZero: true,
        min: 0,
        max: 50,
        bounds: 'ticks',
        position: 'right',
        reverse: false,
        // grid: gridOptions,
        title: {
          text: 'unknown',
          align: 'center',
          padding: 5,
          display: true,
        },

        grace: '5%',
      },
    },
    animation: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  },
};
 
const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');
const myChart = new Chart<'line'>(ctx, config);

// this is code from our app to throttle update requests, as we show multiple curves with rapidly changing data
function requestChartUpdate(
  chart: Chart,
  updateMode?:
    | 'resize'
    | 'reset'
    | 'none'
    | 'hide'
    | 'show'
    | 'normal'
    | 'active'
) {
  if (updateRequested) {
    return;
  }
  updateRequested = true;

  // causes browsers to complain on slower systems and/or higher load
  // Alternative: queueMicroTask, but that would make the app less reactive on heavy load
  // Apart from that, chart.js uses rqAF already internally (only if animations = true), so I doubt the usefulness of this approach
  requestAnimationFrame(() => {
    chart.update(updateMode);
    resetUpdateFlag();
  });
}

function resetUpdateFlag() {
  updateRequested = false;
}

setTimeout(() => {
  myChart.data.datasets[0].data = points;
  requestChartUpdate(myChart);
}, 2000);
