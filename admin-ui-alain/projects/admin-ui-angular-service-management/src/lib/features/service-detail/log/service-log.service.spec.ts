import {TestBed, inject} from '@angular/core/testing';
import {ServiceManageService} from 'app/service-management/service-manage.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {NetResult} from "../../../services/net-result.entity";
import {ServLogService} from "./service-log.service";
import {Log, Replicas} from "./log.entities";

describe('ServLogService', () => {
  let service: ServLogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServLogService, ServiceManageService]
    });
    service = TestBed.get(ServLogService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // it('#should get service log successfully', () => {
  //   const mockRes: NetResult<Log[]> = {
  //     code: 1,
  //     error: {},
  //     data: [
  //       {
  //         "timestamp": "2019-05-06T06:42:16.976484398Z",
  //         "content": "2019-05-06 06:42:16,959 INFO 68 [egg:loader] Use middleware: securities"
  //       },
  //       {
  //         "timestamp": "2019-05-06T06:42:16.976487098Z",
  //         "content": "2019-05-06 06:42:16,959 INFO 68 [egg:loader] Use middleware: i18n"
  //       }]
  //   };
  //
  //   service.getServiceLog('', '').subscribe((res: Log[]) => {
  //       expect(res.length).toEqual(2);
  //     }
  //   );
  //   const req = httpMock.expectOne(res => true);
  //   expect(req.request.method).toBe('POST');
  //   req.flush(mockRes);
  // });
  //
  // it('#should process log data successfully', () => {
  //   const logs: Log[] = [
  //     {
  //       "timestamp": "2019-05-06T06:42:16.976484398Z",
  //       "content": "2019-05-06 06:42:16,959 INFO 68 [egg:loader] Use middleware: securities"
  //     },
  //     {
  //       "timestamp": "2019-05-06T06:42:16.976487098Z",
  //       "content": "2019-05-06 06:42:16,959 INFO 68 [egg:loader] Use middleware: i18n"
  //     }];
  //
  //   const result = service.processLogData(logs);
  //   expect(new Date(result[0].time).getTime())
  //     .toBe(new Date('2019-05-06T06:42:16.976484398Z').getTime());
  // });

  it('#should get containers successfully', () => {
    const mockRes: NetResult<Replicas> = {
      "code": 1,
      "error": {},
      "data": {
        "containerNames": ["mpjavabackend"],
        "podNames": ["mpjavabackend-9b548b74c-glzcj"]
      }
    };

    service.getContainers('').subscribe((res: Replicas) => {
        expect(res.containerNames[0]).toEqual('mpjavabackend');
      }
    );
    const req = httpMock.expectOne(res => true);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });
});
