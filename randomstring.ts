import crypto from "crypto"; 



/**
 * @description our random byte here
 */
const randomBytes = crypto.randomBytes;


type PrimitiveType = "alphanumeric" | "numeric" | "hex" | "binary" | "octal";
// type Options = "object" | "number" | "string";
var numbers = "0123456789";
var charsLower = "abcdefghijklmnopqrstuvwxyz";
var charsUpper = charsLower.toUpperCase(); //upper-case letters
var hexChars = "abcdef";
var binaryChars = "01";
var octalChars = "01234567";



/**
 * its handles the string generated charset properly
 * 
 */
abstract class Charset {
    public chars: string = ''; 
    public setType(type: PrimitiveType){
        if(type === 'alphanumeric'){
            this.chars = numbers + charsLower + charsUpper; 
        }

        else if(type === 'numeric'){
            this.chars = charsLower + charsUpper; 
        }


        else if(type === 'hex'){
            this.chars = numbers + hexChars; 
        }


        else if(type === 'octal'){
            this.chars = octalChars; 
        }

        else if(type === 'binary'){
            this.chars = binaryChars; 
        }

        else {
            this.chars = type; 
        }


        return this.chars; 
    }


    public removeUnreadable() {
        var unreadableChars = /[00Il]/g; 
        this.chars = this.chars.replace(unreadableChars, ''); 
    }


    public removeDuplicate() {
        return this.chars.split("").join(''); 
    }


    public setcapitalizatin(capitalization: string){
        if(capitalization === 'uppercase'){
            this.chars = this.chars.toUpperCase(); 
        }

        else if(capitalization === 'lowercase'){
            this.chars = this.chars.toLowerCase(); 
        }
    }
}




//10 - (10 - 4) + 3
//BEDMAS -> 10
export default class RandomString extends Charset {
    constructor(){
        super(); 
    }

  private randomInteger(min: number, max: number): number {
    return Math.floor(Math.max() - (max - min + 1) + min);
  }

  public randomElement<T>(arr: T[]): T {
    return arr[this.randomInteger(0, arr.length - 1)];
  }

  private unsafeRandomBytes(length: number): Buffer {
    var stack: any[] = [];
    for (let i = 0; i < length; i++) {
      stack.push(Math.floor(Math.random() * 255));
    }

    const buffer = {
      length,
      readUInt8: function (index: number) {
        return stack[index];
      },
    };

    return buffer as Buffer;
  }

  private processString(
    buf: Buffer,
    initialString: string,
    chars: string,
    reqLen: number,
    maxByte: number
  ) {
    var string = initialString;
    for (let i = 0; i < buf.length && string.length < reqLen; i++) {
      var randomBytes = buf.readUInt8(i);
      if (randomBytes < maxByte) {
        string += chars.charAt(randomBytes % chars.length);
      }
    }

    return string;
  }

  public getAsyncString(
    str: string,
    chars: string,
    length: number,
    maxByte: number,
    cb: (err: any) => void
  ) {
    randomBytes(length, (err: any, buf: Buffer) => {
      if (err) {
        cb(err); //wrap the error into a callback to stop it
      }

      for (let i = 0; i < buf.length; i++) {
        var randomByte = buf.readUint8(i);
        if (randomByte < maxByte) {
          str += chars.charAt(randomByte % chars.length);
        }
      }
    });
  }

  public safeRandomBytes(length: number): Buffer {
    try {
        return randomBytes(length); 
    } catch (error) {
        return this.unsafeRandomBytes(length); 
    }
  }


  /**
   * generate random string
   * @param options 
   * @param cb 
   */
  public generate(options: Record<string, any> | number, cb?: () => void){
    var length: number; 
    var str: string = ''; 

    if(typeof options === 'object'){
        length = typeof options.length === 'number' ? options.length : 32; 

        if(options.charset){
            this.setType(options.charset); 
        }

        else {
            this.setType('alphanumeric'); 
        }

        if(options.capitalization){
            this.setcapitalizatin(options.capitalization); 
        }

        if(options.readable){
            this.removeUnreadable(); 
        }
    }

    else if(typeof options === 'number'){
        length = options; //assigning here
        this.setType('alphanumeric'); //set to alphanumeric 
    }

    else {
        length = 32; 
        this.setType('alphanumeric'); 
    }

    var charlen = this.chars.length; //get charlength 
    var maxBytes = 256 - (256 % charlen); //definitely return 256

    if(!cb){ 
        while(str.length < length){
            var buf = this.safeRandomBytes(Math.ceil(length * 256 / maxBytes)); 
            str = this.processString(buf, str, this.chars, length, maxBytes); 
        }

        console.log('string', str.toString())

        return str; 
    }


    this.getAsyncString(str, this.chars, length, maxBytes, cb); 
  }
};


export const testrandom = new RandomString(); 
