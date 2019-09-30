import * as React from 'react';
import ChartistGraph from 'react-chartist';

// const Visualizations = () => <div>Hello</div>
// export default Visualizations

class Donut extends React.Component {
    render() {
   
      let data :any = {
        series: [10, 20, 50, 20, 5, 50, 15],
        labels: [1, 2, 3, 4, 5, 6, 7]
      }; 
   
      let options : any= {
        donut: true,
        showLabel: true
      };
   
      var type = 'Pie'
   
      return (
        <div>
          <ChartistGraph data={data} options={options} type={type} />
        </div>
      )
    }
  }
  export default Donut