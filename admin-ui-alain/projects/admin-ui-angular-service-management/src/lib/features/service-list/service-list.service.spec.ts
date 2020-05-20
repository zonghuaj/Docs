import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ServiceListService} from "./service-list.service";
// import {ServStatus} from "./service-list.entities";
import {NetResult} from "../../services/net-result.entity";

describe('Service-Manage-Service', () => {
  let service: ServiceListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceListService]
    });
    service = TestBed.get(ServiceListService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // it('#should get services\' status successfully', () => {
  //   const mockRes: NetResult<ServStatus[]> = {
  //     "code": 1,
  //     "error": {},
  //     "data": [{"id": 69, "status": 4}, {"id": 70, "status": 4}]
  //   };
  //
  //   service.getStatus([]).subscribe((res: ServStatus[]) => {
  //       expect(res.length).toEqual(2);
  //     }
  //   );
  //   const req = httpMock.expectOne(res => true);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockRes);
  // });
});
