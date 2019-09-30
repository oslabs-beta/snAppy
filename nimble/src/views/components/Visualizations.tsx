import * as React from 'react';
import ChartistGraph from 'react-chartist';

// const Visualizations = () => <div>Hello</div>
// export default Visualizations

class Visualizations extends React.Component {
    render() {
   
      let data = {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
        series: [
          [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
        ]
      };
   
      let options = {
        high: 10,
        low: -10,
        axisX: {
          labelInterpolationFnc: function(value: number, index: number) {
            return index % 2 === 0 ? value : null;
          }
        }
      };
   
      var type = 'Bar'
   
      return (
        <div>
          <ChartistGraph data={data} options={options} type={type} />
        </div>
      )
    }
  }
  export default Visualizations;