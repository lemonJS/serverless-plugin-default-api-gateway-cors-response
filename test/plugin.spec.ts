import CorsPlugin from '../src/plugin';
import { ServerlessFixture } from './__fixtures__/serverless';

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
    it('logs to the serverless cli', () => {
      const serverless = new ServerlessFixture();
      const plugin = new CorsPlugin(serverless);

      plugin.hooks['before:package:finalize']();
      expect(serverless.cli.log).toHaveBeenCalledTimes(2);
    });

    it('adds the Cors resources to the config', () => {
      const serverless = new ServerlessFixture();
      const plugin = new CorsPlugin(serverless);

      plugin.hooks['before:package:finalize']();
      expect(serverless.service.resources.Resources).toContainAllKeys([
        'GatewayResponseDefault4XX',
        'GatewayResponseDefault5XX'
      ]);
    });
  });
});
