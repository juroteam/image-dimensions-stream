const BaseType = require('../BaseType');

/*
 webp header specification
 https://developers.google.com/speed/webp/docs/riff_container#webp_file_header
 */

module.exports = class WebpType extends BaseType {
  static get bytesToGetMime() {
    return 16;
  }
  
  static _fromBuffer(buffer) {
    const RIFF = buffer.slice(0, 4).toString('utf8');
    const WEBP = buffer.slice(8, 12).toString('utf8');
    const chunkType = buffer.slice(12, 16).toString('utf8');
    if (RIFF === 'RIFF' && WEBP === 'WEBP' && chunkType === 'VP8X') {
      return { type: 'webp' }
    }
    
    return null;    
  }
  
  static get mime() {
    return 'image/webp';
  }

  _findDimensions(buf) {
    if (buf.length < 32) {
      return this.needMore(32);
    }

    const widthMinus1 = Buffer.concat([buf.slice(24, 27), Buffer.alloc(1)]);
    const heightMinus1 = Buffer.concat([buf.slice(27, 30), Buffer.alloc(1)]);
    const width = widthMinus1.readInt32LE()+1;
    const hieght = heightMinus1.readInt32LE()+1;

    return this.createDimensions(width, hieght);
  }

  constructor(...args) {
    super(...args);
    
    this._meta = {};
  } 
};
