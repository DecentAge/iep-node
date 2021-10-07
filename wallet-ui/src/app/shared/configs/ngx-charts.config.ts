import * as shape from 'd3-shape';
//Bar Chart

export var barChartView: any[] = [550, 400];

// options
export var barChartShowXAxis = true;
export var barChartShowYAxis = true;
export var barChartGradient = false;
export var barChartShowLegend = false;
export var barChartShowXAxisLabel = true;
export var barChartXAxisLabel = 'Country';
export var barChartShowYAxisLabel = true;
export var barChartYAxisLabel = 'Population';

export var barChartColorScheme = {
    domain: ['#009DA0', '#FF8D60', '#FF586B', '#AAAAAA']
};

//Pie CHart

export var pieChartView: any[] = [550, 400];

// options
export var pieChartShowLegend = true;

export var pieChartColorScheme = {
    domain: [
        '#009DA0',
        '#FF586B',
        '#64FFDA',
        '#FF8D60',
        '#0ABC76',
        '#F3931B',
        '#4A148C',
        '#FF7A4E',
        '#66BB6A',
        '#E72D45'
    ]
};

// pie
export var pieChartShowLabels = true;
export var pieChartExplodeSlices = false;
export var pieChartDoughnut = false;
export var pieChartGradient = true;

//Line Charts

export var lineChartView: any[] = [550, 400];

// options
export var lineChartShowXAxis = true;
export var lineChartShowYAxis = true;
export var lineChartGradient = false;
export var lineChartShowLegend = false;
export var lineChartShowXAxisLabel = true;
export var lineChartXAxisLabel = 'Country';
export var lineChartShowYAxisLabel = true;
export var lineChartYAxisLabel = 'Population';

export var lineChartColorScheme = {
    domain: ['#009DA0', '#FF8D60', '#FF586B', '#AAAAAA']
};

// line, area
export var lineChartAutoScale = true;
export var lineChartLineInterpolation = shape.curveBasis;

//Area Charts
export var areaChartView: any[] = [550, 400];

// options
export var areaChartShowXAxis = true;
export var areaChartShowYAxis = true;
export var areaChartGradient = false;
export var areaChartShowLegend = false;
export var areaChartShowXAxisLabel = true;
export var areaChartXAxisLabel = 'Country';
export var areaChartShowYAxisLabel = true;
export var areaChartYAxisLabel = 'Population';

export var areaChartColorScheme = {
    domain: ['#FF8D60', '#FF586B', '#1CBCD8', '#AAAAAA']
};

// line, area
export var areaChartAutoScale = true;

export var areaChartLineInterpolation = shape.curveBasis;

