import {serviceProxy, GenericService} from '@loopback/service-proxy';

export class Raiden {
  @serviceProxy('raiden')
  // @inject('services.GeoService')
  public raiden: GenericService;
}
