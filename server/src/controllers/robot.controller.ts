import {serviceProxy, GenericService} from '@loopback/service-proxy';

export class Robot {
  @serviceProxy('robot')
  public robot: GenericService;
}
