import Serverless from 'serverless';
import Service from 'serverless/classes/Service';

export class ServerlessFixture extends Serverless {
  cli = {
    log: jest.fn()
  };

  service = {
    custom: {},
    resources: {
      Resources: {}
    }
  } as Service;
}
