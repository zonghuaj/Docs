import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ServiceTopoService} from "./service-topo.service";
import {NetResult} from "../../services/net-result.entity";

describe('service-manage.service.spec.ts', () => {
  let service: ServiceTopoService;
  let httpMock: HttpTestingController;

  const topo = {
    "nodes": [{"id": "1", "name": "User", "type": "USER", "isReal": false}, {
      "id": "2",
      "name": "user-service",
      "type": "Tomcat",
      "isReal": true
    }, {"id": "3", "name": "192.168.1.239:3306", "type": "Mysql", "isReal": false}, {
      "id": "4",
      "name": "greeting-service",
      "type": "Tomcat",
      "isReal": true
    }, {"id": "7", "name": "contractbackend", "type": "SpringMVC", "isReal": true}, {
      "id": "8",
      "name": "greeting-service-mesh",
      "type": "SpringMVC",
      "isReal": true
    }, {"id": "9", "name": "user-service-mesh", "type": "SpringMVC", "isReal": true}, {
      "id": "10",
      "name": "auth.micropaas.ies:80",
      "type": "Unknown",
      "isReal": false
    }, {"id": "11", "name": "discovery.chinagas:8082", "type": "Unknown", "isReal": false}],
    "calls": [{
      "id": "2_3_33",
      "source": "2",
      "target": "3",
      "callType": "mysql-connector-java",
      "detectPoint": "CLIENT"
    }, {
      "id": "4_2_13",
      "source": "4",
      "target": "2",
      "callType": "SpringRestTemplate",
      "detectPoint": "CLIENT"
    }, {
      "id": "7_3_33",
      "source": "7",
      "target": "3",
      "callType": "mysql-connector-java",
      "detectPoint": "CLIENT"
    }, {
      "id": "7_10_13",
      "source": "7",
      "target": "10",
      "callType": "SpringRestTemplate",
      "detectPoint": "CLIENT"
    }, {
      "id": "7_11_13",
      "source": "7",
      "target": "11",
      "callType": "SpringRestTemplate",
      "detectPoint": "CLIENT"
    }, {
      "id": "8_2_13",
      "source": "8",
      "target": "2",
      "callType": "SpringRestTemplate",
      "detectPoint": "CLIENT"
    }, {
      "id": "8_9_13",
      "source": "8",
      "target": "9",
      "callType": "SpringRestTemplate",
      "detectPoint": "CLIENT"
    }, {
      "id": "9_3_33",
      "source": "9",
      "target": "3",
      "callType": "mysql-connector-java",
      "detectPoint": "CLIENT"
    }, {"id": "1_4_1", "source": "1", "target": "4", "callType": "", "detectPoint": "SERVER"}, {
      "id": "1_7_1",
      "source": "1",
      "target": "7",
      "callType": "",
      "detectPoint": "SERVER"
    }, {"id": "1_2_1", "source": "1", "target": "2", "callType": "", "detectPoint": "SERVER"}, {
      "id": "1_8_1",
      "source": "1",
      "target": "8",
      "callType": "",
      "detectPoint": "SERVER"
    }, {"id": "1_9_1", "source": "1", "target": "9", "callType": "", "detectPoint": "SERVER"}]
  };
  const topoData = {
    "sla": {
      "values": [{"id": "2", "value": 9764}, {"id": "4", "value": 7956}, {
        "id": "7",
        "value": 7761
      }, {"id": "8", "value": 7540}, {"id": "9", "value": 9122}]
    },
    "nodeCpm": {
      "values": [{"id": "2", "value": 0}, {"id": "4", "value": 0}, {"id": "7", "value": 2}, {
        "id": "8",
        "value": 0
      }, {"id": "9", "value": 0}]
    },
    "nodeLatency": {
      "values": [{"id": "2", "value": 5}, {"id": "4", "value": 10}, {
        "id": "7",
        "value": 11494
      }, {"id": "8", "value": 69}, {"id": "9", "value": 38}]
    },
    "cpmS": {
      "values": [{"id": "1_4_1", "value": 0}, {"id": "1_7_1", "value": 2}, {
        "id": "1_2_1",
        "value": 0
      }, {"id": "1_8_1", "value": 0}, {"id": "1_9_1", "value": 0}]
    },
    "latencyS": {"values": []},
    "cpmC": {
      "values": [{"id": "2_3_33", "value": 0}, {"id": "4_2_13", "value": 0}, {
        "id": "7_3_33",
        "value": 2
      }, {"id": "7_10_13", "value": 0}, {"id": "7_11_13", "value": 0}, {
        "id": "8_2_13",
        "value": 0
      }, {"id": "8_9_13", "value": 0}, {"id": "9_3_33", "value": 0}]
    },
    "latencyC": {
      "values": [{"id": "2_3_33", "value": 0}, {"id": "4_2_13", "value": 7}, {
        "id": "7_3_33",
        "value": 0
      }, {"id": "7_10_13", "value": 586}, {"id": "7_11_13", "value": 127247}, {
        "id": "8_2_13",
        "value": 197
      }, {"id": "8_9_13", "value": 60}, {"id": "9_3_33", "value": 0}]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceTopoService]
    });
    service = TestBed.get(ServiceTopoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('#should get topo successfully', () => {
    const mockRes: NetResult<any> = {
      code: 1,
      error: {},
      data: topo
    };

    const start = new Date();
    const end = new Date();
    service.getTopo(start, end).subscribe((res: any) => {
        expect(res.nodes.length).toEqual(9);
      }
    );
    const req = httpMock.expectOne(res => true);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('#should get topo data successfully', () => {
    const mockRes: NetResult<any> = {
      code: 1,
      error: {},
      data: topoData
    };

    const start = new Date();
    const end = new Date();
    service.getTopoData(start, end, {}).subscribe((res: any) => {
        expect(res.sla.values.length).toEqual(5);
      }
    );
    const req = httpMock.expectOne(res => true);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('should get full ids', () => {
    const fullIds = service.getFullIds(topo);
    expect(fullIds.ids.length).toBe(9);
    expect(fullIds.idsC.length).toBe(8);
    expect(fullIds.idsS.length).toBe(5);
  });

  it('should get duration in MINUTE(same day)', () => {
    const start = new Date('2019-06-01 10:00:00');
    const end = new Date('2019-06-01 10:01:11');
    const {duration} = service.getDuration(start, end);
    expect(duration.start).toBe('2019-06-01 1000');
    expect(duration.end).toBe('2019-06-01 1001');
    expect(duration.step).toBe('MINUTE');
  });

  it('should get duration in DAY(different day)', () => {
    const start = new Date('2019-06-01 10:00:00');
    const end = new Date('2019-06-02 10:01:11');
    const {duration} = service.getDuration(start, end);
    expect(duration.start).toBe('2019-06-01');
    expect(duration.end).toBe('2019-06-02');
    expect(duration.step).toBe('DAY');
  });

  it('should return correct value with existing id', () => {
    const id_2 = service.findValue(topoData.sla.values, '2');
    expect(id_2).toBe(9764);
  });

  it('should return null with id doesnt exist', () => {
    const id_9999 = service.findValue(topoData.sla.values, 9999);
    expect(id_9999).toBe(null);
  });

  it('should return sla divided by 100', () => {
    const sla = service.getSla(5566);
    expect(sla).toBe(55.66);
  });

  it('should return NaN sla', () => {
    const sla = service.getSla('abc');
    expect(sla).toBe('abc');
  });

  it('should return chart time day by day', () => {
    const start = new Date('2019-06-01 10:00:00');
    const end = new Date('2019-06-05 12:34:56');

    const times = service.getChartTime(start, end, 5);
    expect(times.length).toBe(5);
    expect(times[0]).toBe('2019-06-01');
  });

  it('should return chart time min by min', () => {
    const start = new Date('2019-06-01 10:00:00');
    const end = new Date('2019-06-01 12:34:56');

    const times = service.getChartTime(start, end, 5);
    expect(times.length).toBe(5);
    expect(times[4]).toBe('06-01 14');
  });

  it('should return correct values of array', () => {
    const values = [{value: 1}, {value: 2}];
    const res = service.getChartData(values);
    expect(res[0]).toBe(1);
    expect(res.length).toBe(2);
  });
});
