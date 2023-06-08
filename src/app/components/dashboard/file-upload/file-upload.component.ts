import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { ServiceDataService } from 'src/app/services/service-data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  data: any[] = [];

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
      this.maxAndMinDeathsPerState(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  maxAndMinDeathsPerState(data:any){
    let maxDeaths = -Infinity;
    let stateWithMaxDeaths = '';
    let minDeaths = Infinity;
    let stateWithMinDeaths = '';

    Object.values(data).forEach((city: any) => {
      const dates = Object.keys(city.dates);
      const lastDate = dates[dates.length - 1];
      const deaths = city.dates[lastDate];

      if (deaths > maxDeaths) {
        maxDeaths = deaths;
        stateWithMaxDeaths = city.Province_State;
      }

      if (deaths < minDeaths) {
        minDeaths = deaths;
        stateWithMinDeaths = city.Province_State;
      }
    });

    console.log(`El estado con mayor acumulado de muertes es ${stateWithMaxDeaths} con un total de ${maxDeaths} muertes.`);
    console.log(`El estado con menor acumulado de muertes es ${stateWithMinDeaths} con un total de ${minDeaths} muertes.`);
  
  }

}
