import { Injectable } from '@angular/core';
import { ServiceEntity } from '../entities/service.entity';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate';

declare var MobileTicketAPI: any;

@Injectable()
export class ServiceService {
  constructor(private translate: TranslateService) { }

  public convertToServiceEntities(serviceList): Array<ServiceEntity> {
    let entities: Array<ServiceEntity> = [];
    let serviceEntity: ServiceEntity;
    for (var i = 0; i < serviceList.length; i++) {
      serviceEntity = new ServiceEntity();
      serviceEntity.id = serviceList[i].id;
      serviceEntity.name = serviceList[i].name;
      serviceEntity.estimatedWait = serviceList[i].estimatedWait;
      serviceEntity.waitingTime = serviceList[i].waitingTime;
      serviceEntity.selected = false;
      entities.push(serviceEntity);
    }
    if (serviceList.length == 1) {
      entities[0].selected = true;
    }
    return entities;
  }

  public getServices(callback): void {
    MobileTicketAPI.getServices(
      (serviceList: any) => {
        let serviceEntities = this.convertToServiceEntities(serviceList);
        callback(serviceEntities, false);
      },
      () => {
        callback(null, true);
      });
  }

  setServiceInformation(serviceList: Array<ServiceEntity>): void {
    this.translate.get('service.waiting').subscribe((res: string) => {
      for (var i = 0; i < serviceList.length; i++) {
      let serviceId = serviceList[i].id;
      MobileTicketAPI.getQueueInformation(serviceId,
        (serviceInfo) => {
          for (var i = 0; i < serviceList.length; i++) {
            if (serviceInfo.id === serviceList[i].id) {
              serviceList[i].customersWaiting = serviceInfo.customersWaiting + " " + res;
            }
          }
        },
        () => {

        });
    }
    });
    
  }

}