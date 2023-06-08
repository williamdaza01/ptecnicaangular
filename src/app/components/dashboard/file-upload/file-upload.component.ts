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
  chartData!: { datasets: { data: number[] }[]; labels: string[] };
  maxDeahts: number = 0;
  minDeahts: number = 0;
  stateWithMaxDeaths: string = '';
  stateWithMinDeaths: string = '';

  constructor(private papa: Papa, private service: ServiceDataService) {}

  ngOnInit() {
    this.proccesData();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.papa.parse(file, {
      complete: async (result: any) => {
        const headers = result.data[0];
        const jsonData: any[] = [];

        for (let i = 1; i < result.data.length; i++) {
          const row = result.data[i];
          const obj: any = {};

          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }

          jsonData.push(obj);
        }

        const dataTrans = this.transformCSVData(jsonData);
        (await this.service.postData(dataTrans)).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );
        this.proccesData();
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
        if (
          key !== 'UID' &&
          key !== 'iso2' &&
          key !== 'iso3' &&
          key !== 'FIPS' &&
          key !== 'Admin2' &&
          key !== 'Province_State' &&
          key !== 'Country_Region' &&
          key !== 'Lat' &&
          key !== 'Long_' &&
          key !== 'Combined_Key' &&
          key !== 'Population'
        ) {
          dates[key] = parseInt(line[key]);
        }
      });
      console.log(line);

      const transformedLine = {
        iso2: line.iso2,
        iso3: line.iso3,
        FIPS: line.FIPS,
        Admin2: line.Admin2,
        Province_State: line.Province_State,
        Country_Region: line.Country_Region,
        Lat: line.Lat,
        Long_: line.Long_,
        Combined_Key: line.Combined_Key,
        Population: line.Population,
        dates,
      };

      transformedData.data[uid] = transformedLine;
    });

    return transformedData;
  }

  async proccesData() {
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
    let maxDeaths = -Infinity;
    let stateWithMaxDeaths = '';
    let minDeaths = Infinity;
    let stateWithMinDeaths = '';

    const maxDeathsIndex = this.data.indexOf(Math.max(...this.data));
    stateWithMaxDeaths = this.labels[maxDeathsIndex];
    maxDeaths = this.data[maxDeathsIndex];

    const minDeathsIndex = this.data.indexOf(Math.min(...this.data));
    stateWithMinDeaths = this.labels[minDeathsIndex];
    minDeaths = this.data[minDeathsIndex];

    this.maxDeahts = maxDeaths;
    this.minDeahts = minDeaths;
    this.stateWithMaxDeaths = stateWithMaxDeaths;
    this.stateWithMinDeaths = stateWithMinDeaths;
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
