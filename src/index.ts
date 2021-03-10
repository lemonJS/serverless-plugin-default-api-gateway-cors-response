import type Serverless from 'serverless';
import type { CloudFormationResource } from 'serverless/plugins/aws/provider/awsProvider';

type StatusCodeRange = '5XX' | '4XX';

class CorsPlugin {
  public hooks = {};

  private logMessages = {
    START: '🚀 Injecting Cors configuration',
    COMPLETE: '🎉 Cors configured successfully',
    FAILED: '🙀 Failed to inject Cors configuration'
  };

  /**
   * Instantiate the class and assign the hooks that
   * Serverless will bind to
   * @public
   * @param {Serverless} serverless 
   */
  public constructor(private serverless: Serverless) {
    this.serverless = serverless;

    this.hooks = {
      'before:package:finalize': this.beforePackageFinalize.bind(this)
    };
  }

  /**
   * Get a list of status code ranges from the custom
   * config of the serverless project
   * @private
   * @return {StatusCodeRange[]}
   */
  private get statusCodes(): StatusCodeRange[] {
    return ['4XX', '5XX'];
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
   * range
   * @private
   * @param {StatusCodeRange} statusCode 
   * @return {CloudFormationResource}
   */
  private buildDefaultResponse(statusCode: StatusCodeRange): CloudFormationResource {
    return {
      Type: 'AWS::ApiGateway::GatewayResponse',
      Properties: {
        ResponseParameters: {
          'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
          'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
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
    this.statusCodes.forEach((statusCode: StatusCodeRange) => {
      const name = `GatewayResponseDefault${statusCode}`;
      this.serverless.service.resources.Resources[name] = this.buildDefaultResponse(statusCode);
    });
  }
}

module.exports = CorsPlugin;
