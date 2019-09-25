// src/index.js

// Logic states;
const HIGH = 1;
const LOW = 0;

class SpiBitBang {
  /**
   * Constructor.
   *
   * @param {*} gpio            GPIO channel instances.
   * @param {*} gpio.data       MOSI/MISO (optional).
   * @param {*} gpio.mosi       MOSI (optional).
   * @param {*} gpio.miso       MISO (optional).
   * @param {*} gpio.clock      CLK.
   * @param {*} gpio.chipSelect CS.
   *
   * @param {*} options         Options to override default settings - see below.
   */
  constructor(gpio, options) {
    this.settings = {
      // Settings comptible with spi-device.

      // Placeholders for spi-device settings that have not yet been implemented.
      mode: 0,
      chipSelectHigh: false,
      lsbFirst: false,
      threeWire: false,
      loopback: false,
      noChipSelect: false,
      ready: false,
      bitsPerWord: 8,
      maxSpeedHz: 0,

      // Allow override in the options.
      ...options,
    };

    // Set the IO channels.
    /* eslint-disable-next-line object-curly-newline */
    const { clock, data, mosi, miso, chipSelect } = gpio;
    this.mosi = mosi || data;
    this.miso = miso || data;
    this.clock = clock;
    this.chipSelect = chipSelect;
  }

  async write(data) {
    const write = (bit) => {
      // Currently only mode 0 supported.
      this.clock.writeSync(LOW);
      this.mosi.writeSync((bit && 1) || 0);
      this.clock.writeSync(HIGH);
    };

    // Select the chip.
    this.chipSelect.writeSync(LOW);

    // Write each byte.
    for (let i = 0; i < data.length; i += 1) {
      // Currently only MSB first implemented.
      const byte = data[i];
      write(byte & 128);
      write(byte & 64);
      write(byte & 32);
      write(byte & 16);
      write(byte & 8);
      write(byte & 4);
      write(byte & 2);
      write(byte & 1);
    }

    // Latch the data.
    this.chipSelect.writeSync(HIGH);
    return data.length;
  }

  writeSync(data) {
    const write = (bit) => {
      // Currently only mode 0 supported.
      this.clock.writeSync(LOW);
      this.mosi.writeSync((bit && 1) || 0);
      this.clock.writeSync(HIGH);
    };

    // Select the chip.
    this.chipSelect.writeSync(LOW);

    // Write each byte.
    for (let i = 0; i < data.length; i += 1) {
      // Currently only MSB first implemented.
      const byte = data[i];
      write(byte & 128);
      write(byte & 64);
      write(byte & 32);
      write(byte & 16);
      write(byte & 8);
      write(byte & 4);
      write(byte & 2);
      write(byte & 1);
    }

    // Latch the data.
    this.chipSelect.writeSync(HIGH);
    return data.length;

  }
}

module.exports = SpiBitBang;
