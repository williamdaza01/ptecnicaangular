import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { ServiceDataService } from 'src/app/services/service-data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  data: number[] = [];
  labels: string[] = [];
  chartData!: { datasets: { data: number[]; }[]; labels: string[]; };
  maxDeaths:number = 0;
  minDeaths:number = 0;
  stateWithMaxDeaths = '';
  stateWithMinDeaths = '';

  constructor(private papa: Papa, private service: ServiceDataService) {}

  ngOnInit() {
    this.processData();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.papa.parse(file, {
      complete: async (result: any) => {
        const jsonData: any[] = [];

        for (let i = 1; i < result.data.length; i++) {
          const row = result.data[i];
          const obj: any = {};

          for (let j = 0; j < row.length; j++) {
            obj[result.data[0][j]] = row[j];
          }

          jsonData.push(obj);
        }

        const dataTrans = this.transformCSVData(jsonData);
        try {
          const response = await (await this.service.postData(dataTrans)).toPromise();
          console.log(response);
        } catch (error) {
          console.error(error);
        }

        this.processData();
      },
    });
  }

  transformCSVData(csvData: any[]): any {
    const transformedData: any = {
      data: {},
    };

    csvData.forEach((line) => {
      const uid = line.UID;
      const dates: any = {};

      Object.keys(line).forEach((key) => {
        if (!this.isExcludedKey(key)) {
          dates[key] = parseInt(line[key]);
        }
      });

      const transformedLine = {
        ...line,
        dates,
      };

      transformedData.data[uid] = transformedLine;
    });

    return transformedData;
  }

  isExcludedKey(key: string): boolean {
    const excludedKeys = [
      'UID',
      'iso2',
      'iso3',
      'FIPS',
      'Admin2',
      'Province_State',
      'Country_Region',
      'Lat',
      'Long_',
      'Combined_Key',
      'Population'
    ];

    return excludedKeys.includes(key);
  }

  async processData() {
    try {
      const response = await (await this.service.getData()).toPromise();
      const data = response.data;
      this.getAllDeathsAndStates(data);
      this.maxAndMinDeathsPerState();
    } catch (error) {
      console.error(error);
    }
  }

  maxAndMinDeathsPerState() {
    const maxDeathsIndex = this.data.indexOf(Math.max(...this.data));
    this.stateWithMaxDeaths = this.labels[maxDeathsIndex];
    this.maxDeaths = this.data[maxDeathsIndex];

    const minDeathsIndex = this.data.indexOf(Math.min(...this.data));
    this.stateWithMinDeaths = this.labels[minDeathsIndex];
    this.minDeaths = this.data[minDeathsIndex];
  }

  getAllDeathsAndStates(data: any) {
    this.labels = [];
    this.data = [];

    Object.values(data).forEach((city: any) => {
      const dates = Object.keys(city.dates);
      const lastDate = dates[dates.length - 1];
      const deaths = city.dates[lastDate];

      const existingStateIndex = this.labels.indexOf(city.Province_State);
      if (existingStateIndex !== -1) {
        this.data[existingStateIndex] += deaths;
      } else {
        this.labels.push(city.Province_State);
        this.data.push(deaths);
      }
    });

    this.chartData = {
      datasets: [
        {
          data: this.data,
        },
      ],
      labels: this.labels,
    };
  }
}
