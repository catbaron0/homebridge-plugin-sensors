import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import axios from 'axios';
import { SensorsPlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */

export class Sensors {
  private tempeService: Service;
  private humiService: Service;
  private lightService: Service;

  private tempe = 0.0;
  private light = 0.0;
  private humi = 0.0;


  constructor(
    private readonly platform: SensorsPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // you can create multiple services for each accessory
    this.tempeService = this.accessory.getService(this.platform.Service.TemperatureSensor) || this.accessory.addService(this.platform.Service.TemperatureSensor);
    this.humiService = this.accessory.getService(this.platform.Service.HumiditySensor) || this.accessory.addService(this.platform.Service.HumiditySensor);
    this.lightService = this.accessory.getService(this.platform.Service.LightSensor) || this.accessory.addService(this.platform.Service.LightSensor);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.tempeService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);
    this.tempeService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);
    this.tempeService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers
    // this.tempeService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
    //   .onGet(this.getTempe.bind(this));               // GET - bind to the `getOn` method below

    // this.humiService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
    //   .onGet(this.getHumi.bind(this));       // SET - bind to the 'setBrightness` method below

    // this.lightService.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
    //   .onGet(this.getHumi.bind(this));       // SET - bind to the 'setBrightness` method below

    /**
     * Creating multiple services of the same type.
     *
     * To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
     * when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
     * this.accessory.getService('NAME') || this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE_ID');
     *
     * The USER_DEFINED_SUBTYPE must be unique to the platform accessory (if you platform exposes multiple accessories, each accessory
     * can use the same sub type id.)
     */

    /**
     * Updating characteristics values asynchronously.
     *
     * Example showing how to update the state of a Characteristic asynchronously instead
     * of using the `on('get')` handlers.
     * Here we change update the motion sensor trigger states on and off every 10 seconds
     * the `updateCharacteristic` method.
     *
     */
    setInterval(() => {

      const api_url = this.platform.config.api_url + '/sensors/tphb';
      this.platform.log.info('Reading sensors from:' + api_url);

      axios.get(api_url)
        .then((res) => {
          const data = res.data;
          this.tempeService.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, data.tempe);
          this.humiService.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, data.humi);
          this.lightService.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, data.bright);
        })
        .catch((error) => {
          this.platform.log.error(error);
        });
    }, 10000);
  }

}
