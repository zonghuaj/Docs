import {NetError, NetResult} from "../services/net-result.entity";
import {processResult} from "./services.util";

describe('service-utils', () => {

  beforeEach(() => {
  });


  it('#processResult() process error result', (done) => {
    const mockResult: NetResult<string> = {
      code: 0,
      error: {message: 'failed!'},
      data: ''
    };

    processResult<string>(mockResult).subscribe(res => 0,
      (err: NetError) => {
        expect(err.message).toBe('failed!');
        done();
      });
  });

});
