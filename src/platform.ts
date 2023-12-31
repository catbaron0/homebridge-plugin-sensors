import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { Sensors } from './platformAccessory';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class SensorsPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  discoverDevices() {

    // EXAMPLE ONLY
    // A real plugin you would discover accessories from the local network, cloud services
    // or a user-defined array in the platform config.
    const sensors = {
      sensorId: 'tempe-sensor-id',
      displayName: 'Temperature Sensor',
    };

    // Init tempe-sensor
    const device = sensors;
    const uuid = this.api.hap.uuid.generate(device.sensorId);
    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

    if (existingAccessory) {
      this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
      new Sensors(this, existingAccessory);

    } else {
      this.log.info('Adding new accessory:', device.displayName);
      const accessory = new this.api.platformAccessory(device.displayName, uuid);
      accessory.context.device = device;

      // create the accessory handler for the newly create accessory
      // this is imported from `platformAccessory.ts`
      new Sensors(this, accessory);

      // link the accessory to your platform
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

    }

    // Init tempe-sensor
    // device = sensors.humi
    // uuid = this.api.hap.uuid.generate(device.sensorId);
    // existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

    // if (existingAccessory) {
    //     this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
    //     new HumiditySensor(this, existingAccessory);

    // } else {
    //     this.log.info('Adding new accessory:', device.displayName);
    //     const accessory = new this.api.platformAccessory(device.displayName, uuid);
    //     accessory.context.device = device;

    //     // create the accessory handler for the newly create accessory
    //     // this is imported from `platformAccessory.ts`
    //     new HumiditySensor(this, accessory);

    //     // link the accessory to your platform
    //     this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

    // }


    // Init tempe-sensor
    // device = sensors.light
    // // uuid = this.api.hap.uuid.generate(device.sensorId);
    // // existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

    // // if (existingAccessory) {
    // //     this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
    // //     new LightSensor(this, existingAccessory);

    // // } else {
    // //     this.log.info('Adding new accessory:', device.displayName);
    // //     const accessory = new this.api.platformAccessory(device.displayName, uuid);
    // //     accessory.context.device = device;

    // //     // create the accessory handler for the newly create accessory
    // //     // this is imported from `platformAccessory.ts`
    // //     new LightSensor(this, accessory);

    // //     // link the accessory to your platform
    // //     this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);

    // // }
  }
}
