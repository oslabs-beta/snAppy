import * as React from 'react';
import * as Chart from 'chart.js';

interface Asset {
  name: string;
  size: number;
}

interface Props {
   postBundleStats: Asset[];
}



class DoughnutChart extends React.Component <Props> {
  constructor(props: Props) {
    super(props);
   
  }

  componentDidUpdate() {
    myChart.data.labels = this.props.data.map(d => d.label);
    myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    myChart.update();
  }

  componentDidMount() {
    let chartRef :React.RefObject<any> = React.createRef();
    this.myChart :Chart = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: this.props.data.map(d => d.label),
        datasets: [{
          data: this.props.data.map(d => d.value),
          backgroundColor: this.props.colors
        }]
      }
    });
  }
  
  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default DoughnutChart;
