import type Serverless from 'serverless';
import type { CloudFormationResource } from 'serverless/plugins/aws/provider/awsProvider';
import { assign, join } from 'lodash';

type StatusCodeRange = '5XX' | '4XX';

interface Hooks {
  'before:package:finalize': VoidFunction;
}

interface Options {
  origin: string;
  headers: string | string[];
  statusCodeRanges: StatusCodeRange[];
}

class CorsPlugin {
  public hooks: Hooks = {
    'before:package:finalize': this.beforePackageFinalize.bind(this)
  };

  private logMessages = {
    START: '🚀 Injecting Cors configuration',
    COMPLETE: '🎉 Cors configured successfully',
    FAILED: '🙀 Failed to inject Cors configuration'
  };

  private defaultOptions: Options = {
    origin: '*',
    headers: '*',
    statusCodeRanges: ['5XX', '4XX']
  };

  /**
   * Instantiate the class and assign the hooks that
   * Serverless will bind to
   * @public
   * @param {Serverless} serverless 
   */
  public constructor(private serverless: Serverless) {
    this.serverless = serverless;
  }

  /**
   * Get the combined options object from the defaults
   * and the serverless custom config
   * @private
   * @return {Options}
   */
  private get options(): Options {
    return assign(
      this.defaultOptions,
      this.serverless.service.custom['default-api-gateway-cors-response']
    );
  }

  /**
   * Handle the 'before:package:finalize' lifecycle event
   * @private
   * @return {void}
   */
  private beforePackageFinalize(): void {
    try {
      this.serverless.cli.log(this.logMessages.START);
      this.process();
      this.serverless.cli.log(this.logMessages.COMPLETE);
    } catch(error) {
      this.serverless.cli.log(this.logMessages.FAILED);
      this.serverless.cli.log(error);
    }
  }
  
  /**
   * Build the block of Cloudformation to add the default
   * Api Gateway Response using the provided status code
   * range and origin
   * @private
   * @param {StatusCodeRange} statusCode 
   * @return {CloudFormationResource}
   */
  private buildDefaultResponse(statusCode: StatusCodeRange): CloudFormationResource {
    return {
      Type: 'AWS::ApiGateway::GatewayResponse',
      Properties: {
        ResponseParameters: {
          'gatewayresponse.header.Access-Control-Allow-Origin': `'${this.options.origin}'`,
          'gatewayresponse.header.Access-Control-Allow-Headers': `'${join(this.options.headers, ', ')}'`
        },
        ResponseType: `DEFAULT_${statusCode}`,
        RestApiId: {
          Ref: 'ApiGatewayRestApi'
        }
      }
    };
  }

  /**
   * Process the serverless lifecycle event by appending
   * the Cloudformation templates to the Resources block
   * @private
   * @return {void}
   */
  private process(): void {
    this.options.statusCodeRanges.forEach((statusCode: StatusCodeRange) => {
      const name = `GatewayResponseDefault${statusCode}`;
      this.serverless.service.resources.Resources[name] = this.buildDefaultResponse(statusCode);
    });
  }
}

// A bit weird but it's what Serverless requires
export = CorsPlugin;
