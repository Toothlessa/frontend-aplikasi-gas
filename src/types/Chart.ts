export interface ChartState {
  lineChartData: LineChartData[];
  
}

/* -------------------------------
   LINE CHART
--------------------------------*/
export interface LineChartDataset {
  label: string;
  backgroundColor: string;
  data: number[];
}

export interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
}

/* -------------------------------
   POLAR CHART
--------------------------------*/

export interface PolarChartDataset {
  label: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  data: number[];
}

export interface PolarChartData {
  labels: string[];
  datasets: PolarChartDataset[];
}

export interface PolarChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
}