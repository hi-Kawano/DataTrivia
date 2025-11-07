const ctx = document.getElementById('myChart').getContext('2d');
let myChart;
let randomBool;
let randomInt;
let numCorrect = 0;
let numWrong = 0;
let data_source;
const num_of_charts = 18;
let history = [];
const memory_length = 10;

const correct_ASCII = `
   ______                                            __ 
  / ____/  ____     _____   _____   ___     _____   / /_
 / /      / __ \\   / ___/  / ___/  / _ \\   / ___/  / __/
/ /___   / /_/ /  / /     / /     /  __/  / /__   / /_  
\\____/   \\____/  /_/     /_/      \\___/   \\___/   \\__/

`;

const wrong_ASCII = `
 _       __                                      __
| |     / /  _____   ____     ____     ____ _   / /
| | /| / /  / ___/  / __ \\   / __ \\   / __ \`/  / / 
| |/ |/ /  / /     / /_/ /  / / / /  / /_/ /  /_/  
|__/|__/  /_/      \\____/  /_/ /_/   \\__, /  (_)   
                                    /____/         
`;

const wrongResponses = ["I was expecting more", "Well, this is embarassing", "Girl...", "You tried your best", "That wasn't intended to be tricky", "It could be worse", "Better luck next time", "That one got you?", "yikes", "Let's move past this hiccup" ]
const correctResponses = ["That one was a freebie", "Ok ok not bad", "You're doing better than expected", "You seem to know your stuff", "Did you look it up?", "Keep this up", "Shockingly doing great!", "I hope these aren't too easy", "Alright, I'll get you next time", "Clever clever clever"]

const retroColors = [
  '#FF00FF', // neon magenta
  '#00FFFF', // cyan
  '#FFFF00', // yellow
  '#00FF00', // lime green
  '#FF0000', // bright red
  '#FFA500', // orange
  '#800080', // purple
  '#00CED1', // dark turquoise
  '#FFD700', // gold
  '#FF69B4', // hot pink
  '#7FFF00', // chartreuse
  '#DC143C', // crimson
  '#8A2BE2', // blue violet
  '#00BFFF', // deep sky blue
  '#0000FF', // electric blue
];

function closeWindow() {
  document.getElementById('retroWindow').style.display = 'none';
  document.getElementById('myChart').style.display = 'none';
  document.getElementById('infoBox').style.display = 'none';
  document.getElementById('actionButtons').style.display = 'none';
}
document.getElementById('icon').addEventListener('click', () => {
  document.getElementById('index').textContent = "Question Label: "
  document.getElementById('startBtn').style.display = 'block';
  document.getElementById('introduction').style.display = 'block';
  document.getElementById('retroWindow').style.display = 'block';
});

async function fetchCSVData(url) {
  const response = await fetch(url);
  const text = await response.text();

  const rows = text.trim().split('\n');
  const labels = [];
  const real_data = [];
  const fake_data = [];

  rows.forEach((row, index) => {
    const [label, value] = row.split(',');
    if (index > 0) { // skip header
      labels.push(label);
      real_data.push(parseFloat(value));
    }
  });

  return { labels, real_data };
}

function mean(list){
  const average = list.reduce((sum, num) => sum + num, 0) / list.length;
  return average
}

function standardDeviation(numbers) {
  const average = mean(numbers)

  const squaredDiffs = numbers.map(val => {
    const diff = val - average;
    return diff * diff;
  });

  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / numbers.length;

  return Math.sqrt(avgSquaredDiff);
}

function generatePercentages(n) {
  const values = Array.from({ length: n }, () => Math.random());
  const total = values.reduce((sum, val) => sum + val, 0);
  return values.map(val => (val / total * 100).toFixed(2)); // rounded to 2 decimals
}

function generateNormalDistribution(average, stdDev, count) {
  const values = [];

  for (let i = 0; i < count; i++) {
    // Box-Muller transform
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Scale and shift
    let value = z * stdDev + average;
    if(value<0){
      value = 0
    };
    values.push(value);
  }

  return values;
}

function generateFakeData(real_data, data_type){
  let fake_data;
  console.log(typeof data_type)
   console.log(data_type)
  switch (data_type) {
    case "quant":
      data_average = mean(real_data)
      data_stdDev = standardDeviation(real_data)
      fake_data = generateNormalDistribution(data_average,data_stdDev,real_data.length)
      console.log("entered 1");
      break;
    case "percent":
      fake_data = generatePercentages(real_data.length)
      console.log("entered 2");
      break;
    default:
      console.log("bad");
  }

  return fake_data
}

function getRetroSubset(n) {
  return retroColors.slice(0, Math.min(n, retroColors.length));
}

function generateConfig(data,labels,chart_type,description){

  colors = getRetroSubset(data.length);

  const config = {
    type: chart_type,
    data: {
      labels: labels,
      datasets: [{
        label: description,
        data: data,
        backgroundColor: retroColors,
        borderColor: '#0000FF', // bright blue border
        borderWidth: 4,
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#00FFFF',
            font: {
              family: 'Comic Sans MS',
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Is this data real❓ 🤔',
          color: '#FF00FF',
          font: {
            family: 'Impact',
            size: 40
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#FFFF00',
            font: {
              family: 'Courier New',
              size: 14
            }
          },
          grid: {
            color: '#00FF00'
          }
        },
        y: {
          ticks: {
            color: '#FFFF00',
            font: {
              family: 'Courier New',
              size: 14
            }
          },
          grid: {
            color: '#00FF00'
          },
        }
      },
      layout: {
        padding: 10
      },
      backgroundColor: '#000000' // simulate black webpage background
    }
  };

  return config
}



async function getContext(url, num) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.trim().split('\n').map(row => row.split(','));
  const index = rows[num][0];
  const department = rows[num][1];
  const chart_type = rows[num][2];
  const description = rows[num][3];
  const data_type = rows[num][4];

  return { index, department, chart_type, description, data_type } ;
}



async function createChart(real,num) {
  const { index, department, chart_type, description, data_type } = await getContext('context.csv', num);
  const { labels, real_data} = await fetchCSVData('data\\'+index + '.csv');
  document.getElementById('index').textContent = "Question Label: " +String(index)
  data_source = department;
  let data;

  if (myChart) {
    myChart.destroy();
  }

  if (real){
    data = real_data
  } else {
    data = generateFakeData(real_data, data_type)
  }

  config = generateConfig(data, labels, chart_type, description)
  myChart = new Chart(ctx, config)


}

function pick_index(){
    do{
    canidate = Math.floor(Math.random() * (num_of_charts))+1
  }while(history.includes(canidate));
  history.push(canidate);
    if (history.length > memory_length) {
      history.shift(); // Remove oldest entry
    }
  return canidate
}

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('actionButtons').style.display = 'block';
  document.getElementById('myChart').style.display = 'block';
  document.getElementById('introduction').style.display = 'none';
  randomBool = Math.random() < 0.5;
  randomInt = pick_index()
  createChart(randomBool,randomInt);
});


document.getElementById('realChartBtn').addEventListener('click', () => {
  document.getElementById('actionButtons').style.display = 'none';
  document.getElementById('infoBox').style.display = 'flex';
  if(randomBool){
    document.getElementById('lemon').textContent = "Data from: " + data_source
    document.getElementById('viewRealData').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    correct();
  }else{
    document.getElementById('viewRealData').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('lemon').textContent = wrongResponses[Math.floor(Math.random() * wrongResponses.length)];
    incorrect();
  }
});

document.getElementById('fakeChartBtn').addEventListener('click', () => {
  document.getElementById('actionButtons').style.display = 'none';
  document.getElementById('infoBox').style.display = 'flex';
  if(randomBool){
    document.getElementById('lemon').textContent = "Data from: " + data_source
    document.getElementById('viewRealData').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    incorrect();
  }else{
    document.getElementById('viewRealData').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('lemon').textContent = correctResponses[Math.floor(Math.random() * correctResponses.length)];
    correct();
  }
});

document.getElementById('viewRealData').addEventListener('click', () => {
  createChart(true,randomInt);
  document.getElementById('lemon').textContent = "Data from: " + data_source
  document.getElementById('viewRealData').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'block';
});

document.getElementById('nextBtn').addEventListener('click', () => {
  document.getElementById('infoBox').style.display = 'none';
  document.getElementById('actionButtons').style.display = 'block';
  document.getElementById('myChart').style.display = 'block';
  document.getElementById('startBtn').style.display = 'none';
  randomBool = Math.random() < 0.5;
  randomInt = pick_index()
  createChart(randomBool,randomInt);
});


function incorrect(){
  document.getElementById('ASCII').style.color = "red";
  document.getElementById('ASCII').textContent = wrong_ASCII;
  answerChartUpdate("incorrect");
}

function correct(){
  document.getElementById('ASCII').style.color = "lime";
  document.getElementById('ASCII').textContent = correct_ASCII;
  answerChartUpdate("correct");
}



const ctx2 = document.getElementById('answerChart').getContext('2d');

 const answerChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: [''], // empty label to suppress axis text
      datasets: [
        {
          label: '', // hide legend label
          data: [1], // correct answers
          backgroundColor: 'rgba(0, 200, 0, 0.8)',
          stack: 'quiz'
        },
        {
          label: '',
          data: [1], // incorrect answers
          backgroundColor: 'rgba(200, 0, 0, 0.8)',
          stack: 'quiz'
        }
      ]
    },
    options: {
      indexAxis: 'y', // makes it horizontal
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        x: {
          display: false,
          stacked: true
        },
        y: {
          display: false,
          stacked: true
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  });

  function answerChartUpdate(state){
    if (state == "correct"){
      if(numCorrect == 0 && numWrong == 0){
        answerChart.data.datasets[1].data = [0];
      }
      numCorrect = 1 + numCorrect
      answerChart.data.datasets[0].data = [numCorrect];
      document.getElementById('score').textContent = "Score: "+String(numCorrect)+"/" + String(numCorrect+numWrong) 
      answerChart.update();

    }else if (state == "incorrect"){
      if(numCorrect == 0 && numWrong == 0){
        answerChart.data.datasets[0].data = [0];
      }
      numWrong = 1 + numWrong
      answerChart.data.datasets[1].data = [numWrong];
      document.getElementById('score').textContent = "Score: "+String(numCorrect)+"/" + String(numCorrect+numWrong)
      answerChart.update();
      answerChart.update();
    }
    return
  };

  function updateClock() {
  const clockEl = document.getElementById('clock');
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format

  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock(); 
