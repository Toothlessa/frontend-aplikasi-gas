interface ChartDataset {
  label: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
}


export const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

export function createPolarChartData(labels: string[], totals: number[]): ChartData {
  return {
    labels,
    datasets: [
      {
        label: 'Total Penjualan',
        backgroundColor: 'rgba(46,191,175,0.2)',
        pointBackgroundColor: '#2EBFAF',
        pointBorderColor: '#2EBFAF',
        pointHoverBackgroundColor: '#2EBFAF',
        pointHoverBorderColor: '#2EBFAF',
        data: totals,
      },
    ],
  };
}

