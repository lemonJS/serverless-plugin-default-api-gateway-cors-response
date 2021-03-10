import CorsPlugin from '../src/plugin';
import { ServerlessFixture } from './__fixtures__/serverless';
import { CloudFormationResource } from 'serverless/plugins/aws/provider/awsProvider';

describe('CorsPlugin', () => {
  describe('constructor', () => {
    const serverless = new ServerlessFixture();
    const plugin = new CorsPlugin(serverless);

    it('instantiates without errors', () => {
      expect(plugin).toBeInstanceOf(CorsPlugin);
    });

    it('exposes a list of Serverless hooks', () => {
      expect(plugin.hooks).toBeObject();
    });
  });

  describe('beforePackageFinalize', () => {
    describe('when no custom configuration is used', () => {
      const serverless = new ServerlessFixture();
      const plugin = new CorsPlugin(serverless);

      plugin.hooks['before:package:finalize']();

      it('adds the resources for both the default status codes', () => {
        const resourceKeys = Object.keys(serverless.service.resources.Resources);
        expect(resourceKeys).toIncludeAllMembers([
          'GatewayResponseDefault4XX',
          'GatewayResponseDefault5XX'
        ]);
      });

      it('sets the default origin', () => {
        const resources: CloudFormationResource[] = Object.values(serverless.service.resources.Resources);

        for (const resource of resources) {
          expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Origin']).toEqual("'*'");
        }
      });

      it('sets the default headers', () => {
        const resources: CloudFormationResource[] = Object.values(serverless.service.resources.Resources);

        for (const resource of resources) {
          expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Headers']).toEqual("'*'");
        }
      });
    });

    describe('when a custom configuration is used', () => {
      describe('when a partial config is provided', () => {
        const serverless = new ServerlessFixture();

        serverless.service.custom['default-api-gateway-cors-response'] = {
          statusCodeRanges: ['4XX']
        };

        const plugin = new CorsPlugin(serverless);

        plugin.hooks['before:package:finalize']();

        it('uses the provided values', () => {
          const resourceKeys = Object.keys(serverless.service.resources.Resources);
          expect(resourceKeys).toEqual(['GatewayResponseDefault4XX']);
        });

        it('uses the defaults for everything else', () => {
          const resources: CloudFormationResource[] = Object.values(serverless.service.resources.Resources);

          for (const resource of resources) {
            expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Origin']).toEqual("'*'");
            expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Headers']).toEqual("'*'");
          }
        });
      });

      describe('when a complete config is provided', () => {
        const serverless = new ServerlessFixture();

        serverless.service.custom['default-api-gateway-cors-response'] = {
          origin: 'http://localhost',
          headers: ['Accept', 'Authorization'],
          statusCodeRanges: ['5XX']
        };

        const plugin = new CorsPlugin(serverless);

        plugin.hooks['before:package:finalize']();

        it('sets the correct status code ranges', () => {
          const resourceKeys = Object.keys(serverless.service.resources.Resources);
          expect(resourceKeys).toEqual(['GatewayResponseDefault5XX']);
        });

        it('sets the correct origin', () => {
          const resources: CloudFormationResource[] = Object.values(serverless.service.resources.Resources);

          for (const resource of resources) {
            expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Origin']).toEqual("'http://localhost'");
          }
        });

        it('sets the correct headers', () => {
          const resources: CloudFormationResource[] = Object.values(serverless.service.resources.Resources);

          for (const resource of resources) {
            expect(resource.Properties['ResponseParameters']['gatewayresponse.header.Access-Control-Allow-Headers']).toEqual("'Accept, Authorization'");
          }
        });
      });
    });
  });
});
