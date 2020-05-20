import {TestBed, inject} from '@angular/core/testing';
import {ServiceMonitorService} from './service-monitor.service';
import {ServiceManageService} from 'app/service-management/service-manage.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('ServiceMonitorService', () => {
  let service: ServiceMonitorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceMonitorService, ServiceManageService]
    });
    service = TestBed.get(ServiceMonitorService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // it('#should get services\' status successfully', () => {
  //   const mockRes: NetResult<any> = {
  //     "code": 1,
  //     "error": {},
  //     "data": [{"id": '69', "status": 4}, {"id": '70', "status": 4}]
  //   };
  //
  //   service.getPodMonitorDatas('').subscribe((res: MonitorResult) => {
  //       // expect(res.length).toEqual(2);
  //     }
  //   );
  //   const req = httpMock.expectOne(res => {
  //     console.log('----------------------------');
  //     console.log('----------------------------');
  //     console.log('----------------------------');
  //     console.log('----------------------------');
  //     console.log('----------------------------');
  //     console.log(res.urlWithParams);
  //     return res.url.includes('api/services/');
  //   });
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockRes);
  // });

  it('#should init chat data', () => {
    const result = service.initChartData();
    expect(result.cpuChartOpt).toBeDefined();
    expect(result.memChartOpt).toBeDefined();
  });

  it('#should transform Response -> Chart Options Entity', () => {
    const mockData = {
      podList: {
        pods: [{
          "objectMeta": {
            "name": "adminfrontend-59c46db8cc-mtgtl",
            "namespace": "micropaas",
            "labels": {"app": "adminfrontend", "pod-template-hash": "1570286477"},
            "creationTimestamp": "2019-04-26T06:01:45Z"
          },
          "typeMeta": {"kind": "pod"},
          "podStatus": {
            "status": "Running",
            "podPhase": "Running",
            "containerStates": [{"running": {"startedAt": "2019-04-26T06:01:46Z"}}]
          },
          "restartCount": 0,
          "metrics": {
            "cpuUsage": 0,
            "memoryUsage": 3031040,
            "cpuUsageHistory": [{"timestamp": "2019-04-26T06:05:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:06:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:07:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:08:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:09:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:10:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:11:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:12:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:13:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:14:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:15:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:16:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:17:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:18:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:19:00Z", "value": 0}],
            "memoryUsageHistory": [{
              "timestamp": "2019-04-26T06:05:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:06:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:07:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:08:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:09:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:10:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:11:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:12:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:13:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:14:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:15:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:16:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:17:00Z",
              "value": 3031040
            }, {"timestamp": "2019-04-26T06:18:00Z", "value": 3031040}, {
              "timestamp": "2019-04-26T06:19:00Z",
              "value": 3031040
            }]
          },
          "warnings": [],
          "nodeName": "192.168.1.36"
        }, {
          "objectMeta": {
            "name": "mpbackend3-76bb665679-thhtg",
            "namespace": "micropaas",
            "labels": {"app": "mpbackend3", "pod-template-hash": "3266221235"},
            "creationTimestamp": "2019-04-26T05:40:13Z"
          },
          "typeMeta": {"kind": "pod"},
          "podStatus": {
            "status": "Running",
            "podPhase": "Running",
            "containerStates": [{"running": {"startedAt": "2019-04-26T05:40:16Z"}}]
          },
          "restartCount": 0,
          "metrics": {
            "cpuUsage": 0,
            "memoryUsage": 499695616,
            "cpuUsageHistory": [{"timestamp": "2019-04-26T06:05:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:06:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:07:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:08:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:09:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:10:00Z",
              "value": 2
            }, {"timestamp": "2019-04-26T06:11:00Z", "value": 2}, {
              "timestamp": "2019-04-26T06:12:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:13:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:14:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:15:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:16:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:17:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:18:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:19:00Z", "value": 0}],
            "memoryUsageHistory": [{
              "timestamp": "2019-04-26T06:05:00Z",
              "value": 499232768
            }, {"timestamp": "2019-04-26T06:06:00Z", "value": 499232768}, {
              "timestamp": "2019-04-26T06:07:00Z",
              "value": 499232768
            }, {"timestamp": "2019-04-26T06:08:00Z", "value": 499232768}, {
              "timestamp": "2019-04-26T06:09:00Z",
              "value": 499232768
            }, {"timestamp": "2019-04-26T06:10:00Z", "value": 499810304}, {
              "timestamp": "2019-04-26T06:11:00Z",
              "value": 499695616
            }, {"timestamp": "2019-04-26T06:12:00Z", "value": 499695616}, {
              "timestamp": "2019-04-26T06:13:00Z",
              "value": 499695616
            }, {"timestamp": "2019-04-26T06:14:00Z", "value": 499695616}, {
              "timestamp": "2019-04-26T06:15:00Z",
              "value": 499695616
            }, {"timestamp": "2019-04-26T06:16:00Z", "value": 499695616}, {
              "timestamp": "2019-04-26T06:17:00Z",
              "value": 499695616
            }, {"timestamp": "2019-04-26T06:18:00Z", "value": 499695616}, {
              "timestamp": "2019-04-26T06:19:00Z",
              "value": 499695616
            }]
          },
          "warnings": [],
          "nodeName": "192.168.1.144"
        }, {
          "objectMeta": {
            "name": "mpbackend-74db8cbbdd-tw92w",
            "namespace": "micropaas",
            "labels": {"app": "mpbackend", "pod-template-hash": "3086476688"},
            "creationTimestamp": "2019-04-26T03:59:00Z"
          },
          "typeMeta": {"kind": "pod"},
          "podStatus": {
            "status": "Running",
            "podPhase": "Running",
            "containerStates": [{"running": {"startedAt": "2019-04-26T03:59:02Z"}}]
          },
          "restartCount": 0,
          "metrics": {
            "cpuUsage": 0,
            "memoryUsage": 464613376,
            "cpuUsageHistory": [{"timestamp": "2019-04-26T06:05:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:06:00Z",
              "value": 1
            }, {"timestamp": "2019-04-26T06:07:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:08:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:09:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:10:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:11:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:12:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:13:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:14:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:15:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:16:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:17:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:18:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:19:00Z", "value": 0}],
            "memoryUsageHistory": [{
              "timestamp": "2019-04-26T06:05:00Z",
              "value": 464596992
            }, {"timestamp": "2019-04-26T06:06:00Z", "value": 464596992}, {
              "timestamp": "2019-04-26T06:07:00Z",
              "value": 464732160
            }, {"timestamp": "2019-04-26T06:08:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:09:00Z",
              "value": 464613376
            }, {"timestamp": "2019-04-26T06:10:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:11:00Z",
              "value": 464613376
            }, {"timestamp": "2019-04-26T06:12:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:13:00Z",
              "value": 464613376
            }, {"timestamp": "2019-04-26T06:14:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:15:00Z",
              "value": 464613376
            }, {"timestamp": "2019-04-26T06:16:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:17:00Z",
              "value": 464613376
            }, {"timestamp": "2019-04-26T06:18:00Z", "value": 464613376}, {
              "timestamp": "2019-04-26T06:19:00Z",
              "value": 464613376
            }]
          },
          "warnings": [],
          "nodeName": "192.168.1.133"
        }, {
          "objectMeta": {
            "name": "adminbackend-556b655d7b-vfpw5",
            "namespace": "micropaas",
            "labels": {"app": "adminbackend", "pod-template-hash": "1126211836"},
            "creationTimestamp": "2019-04-23T03:48:10Z"
          },
          "typeMeta": {"kind": "pod"},
          "podStatus": {
            "status": "Running",
            "podPhase": "Running",
            "containerStates": [{"running": {"startedAt": "2019-04-23T03:48:16Z"}}]
          },
          "restartCount": 0,
          "metrics": {
            "cpuUsage": 0,
            "memoryUsage": 698945536,
            "cpuUsageHistory": [{"timestamp": "2019-04-26T06:05:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:06:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:07:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:08:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:09:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:10:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:11:00Z", "value": 1}, {
              "timestamp": "2019-04-26T06:12:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:13:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:14:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:15:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:16:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:17:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:18:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:19:00Z", "value": 0}],
            "memoryUsageHistory": [{
              "timestamp": "2019-04-26T06:05:00Z",
              "value": 700166144
            }, {"timestamp": "2019-04-26T06:06:00Z", "value": 700715008}, {
              "timestamp": "2019-04-26T06:07:00Z",
              "value": 699875328
            }, {"timestamp": "2019-04-26T06:08:00Z", "value": 700424192}, {
              "timestamp": "2019-04-26T06:09:00Z",
              "value": 700678144
            }, {"timestamp": "2019-04-26T06:10:00Z", "value": 700076032}, {
              "timestamp": "2019-04-26T06:11:00Z",
              "value": 700456960
            }, {"timestamp": "2019-04-26T06:12:00Z", "value": 699637760}, {
              "timestamp": "2019-04-26T06:13:00Z",
              "value": 700014592
            }, {"timestamp": "2019-04-26T06:14:00Z", "value": 699342848}, {
              "timestamp": "2019-04-26T06:15:00Z",
              "value": 699691008
            }, {"timestamp": "2019-04-26T06:16:00Z", "value": 699031552}, {
              "timestamp": "2019-04-26T06:17:00Z",
              "value": 699609088
            }, {"timestamp": "2019-04-26T06:18:00Z", "value": 698929152}, {
              "timestamp": "2019-04-26T06:19:00Z",
              "value": 698945536
            }]
          },
          "warnings": [],
          "nodeName": "192.168.1.24"
        }, {
          "objectMeta": {
            "name": "adminbackend-556b655d7b-vvgh9",
            "namespace": "micropaas",
            "labels": {"app": "adminbackend", "pod-template-hash": "1126211836"},
            "creationTimestamp": "2019-04-23T03:48:10Z"
          },
          "typeMeta": {"kind": "pod"},
          "podStatus": {
            "status": "Running",
            "podPhase": "Running",
            "containerStates": [{"running": {"startedAt": "2019-04-23T03:48:14Z"}}]
          },
          "restartCount": 0,
          "metrics": {
            "cpuUsage": 0,
            "memoryUsage": 696385536,
            "cpuUsageHistory": [{"timestamp": "2019-04-26T06:05:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:06:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:07:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:08:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:09:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:10:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:11:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:12:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:13:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:14:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:15:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:16:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:17:00Z", "value": 0}, {
              "timestamp": "2019-04-26T06:18:00Z",
              "value": 0
            }, {"timestamp": "2019-04-26T06:19:00Z", "value": 0}],
            "memoryUsageHistory": [{
              "timestamp": "2019-04-26T06:05:00Z",
              "value": 696565760
            }, {"timestamp": "2019-04-26T06:06:00Z", "value": 695799808}, {
              "timestamp": "2019-04-26T06:07:00Z",
              "value": 695267328
            }, {"timestamp": "2019-04-26T06:08:00Z", "value": 695627776}, {
              "timestamp": "2019-04-26T06:09:00Z",
              "value": 694923264
            }, {"timestamp": "2019-04-26T06:10:00Z", "value": 695365632}, {
              "timestamp": "2019-04-26T06:11:00Z",
              "value": 695492608
            }, {"timestamp": "2019-04-26T06:12:00Z", "value": 696135680}, {
              "timestamp": "2019-04-26T06:13:00Z",
              "value": 696356864
            }, {"timestamp": "2019-04-26T06:14:00Z", "value": 696717312}, {
              "timestamp": "2019-04-26T06:15:00Z",
              "value": 695906304
            }, {"timestamp": "2019-04-26T06:16:00Z", "value": 696516608}, {
              "timestamp": "2019-04-26T06:17:00Z",
              "value": 696737792
            }, {"timestamp": "2019-04-26T06:18:00Z", "value": 697208832}, {
              "timestamp": "2019-04-26T06:19:00Z",
              "value": 696385536
            }]
          },
          "warnings": [],
          "nodeName": "192.168.1.36"
        }]
      }
    }

    const result = service.processChartData(mockData);
    expect(result.cpuChartOpt).toBeDefined();
    expect(result.cpuChartOpt.series.length).toBe(5);
    expect(result.memChartOpt).toBeDefined();
    expect(result.cpuChartOpt.series.length).toBe(5);
  });
});
