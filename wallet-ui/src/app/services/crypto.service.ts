import { Injectable } from '@angular/core';
import { CryptoWrapperService } from './crypto-wrapper.service';
import {unescape} from 'querystring';

declare var PassPhraseGenerator: any;
declare var CryptoJS: any;
declare var converters: any;
declare var curve25519_:any;
declare var BigInteger:any;
declare var pako:any;
declare var curve25519:any;
declare var rsAddress:any;
declare var SHA256_init:any;
declare var SHA256_write:any;
declare var SHA256_finalize:any;

// import "app/crypto/passphrasegenerator.js";
// import "app/crypto/sha256.js";
// import "app/crypto/converters.js";
// import "app/crypto/curve25519_.js";
// import "app/crypto/jsbn.js";
// import "app/crypto/pako.js";
// import "app/crypto/curve25519.js";
// import "app/crypto/rsaddress.js";
// import "app/crypto/jssha256.js";

@Injectable()
export class CryptoService {

  constructor() { }

  generatePassPhrase = function () {
    return PassPhraseGenerator.generatePassPhrase();
  }

  curve25519_clamp(curve) {
      curve[0] &= 0xFFF8;
      curve[15] &= 0x7FFF;
      curve[15] |= 0x4000;
      return curve;
  }

  simpleHash(b1, b2) {
      var sha = CryptoJS.algo.SHA256.create();
      sha.update(converters.byteArrayToWordArray(b1));
      if (b2) {
          sha.update(converters.byteArrayToWordArray(b2));
      }
      var hash = sha.finalize();
      return converters.wordArrayToByteArrayImpl(hash, false);
  }

  getPrivateKey(secretPhrase) {
      var bytes = this.simpleHash(converters.stringToByteArray(secretPhrase), false);
      return converters.shortArrayToHexString(this.curve25519_clamp(converters.byteArrayToShortArray(bytes)));
  }

  getSharedSecret(key1, key2) {
      return converters.shortArrayToByteArray(
          curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2),
              null));
  }

  getSharedKey(privateKey, publicKey, nonce) {
      var sharedSecret = this.getSharedSecret(privateKey, publicKey);
      for (var i = 0; i < 32; i++) {
          sharedSecret[i] ^= nonce[i];
      }
      return this.simpleHash(sharedSecret, false);
  }

  getRandomValues(nonce) {
      if (window.crypto) {
          window.crypto.getRandomValues(nonce);
      } else {
          // window.msCrypto.getRandomValues(nonce);
      }
      return nonce;
  }

  toByteArray(long) {
      // we want to represent the input as a 8-bytes array
      var byteArray = [0, 0, 0, 0];

      for ( var index = 0; index < byteArray.length; index ++ ) {
          var byte = long & 0xff;
          byteArray [ index ] = byte;
          long = (long - byte) / 256 ;
      }

      return byteArray;
  }

  byteArrayToBigInteger(byteArray) {
      var value = new BigInteger('0', 10);
      for (var i = byteArray.length - 1; i >= 0; i--) {
          value = value.multiply(new BigInteger('256', 10)).add(new BigInteger(byteArray[i].toString(10), 10));
      }
      return value;
  }

  getUtf8Bytes (str) {
      var utf8 = unescape(encodeURIComponent(str));
      var arr = [];
      for (var i = 0; i < utf8.length; i++) {
          arr[i] = utf8.charCodeAt(i);
      }
      return arr;
  }

  encryptMessage(msgStrg, senderSecretHex, receiverPublicKey) {

    var secret = converters.hexStringToString(senderSecretHex);

    var senderPrivateKeyBytes = converters.hexStringToByteArray(this.getPrivateKey(secret));
    var receiverPublicKeyBytes = converters.hexStringToByteArray(receiverPublicKey);

    var sharedKey = this.getSharedSecret(senderPrivateKeyBytes, receiverPublicKeyBytes);
    var nonce = this.getRandomValues(new Uint8Array(32));

    var msgBytes = converters.stringToByteArray(msgStrg);
    var msgCompressed = pako.gzip(new Uint8Array(msgBytes));
    var msgWordArray = converters.byteArrayToWordArray(msgCompressed);

    for (var i = 0; i < 32; i++) {
        sharedKey[i] ^= nonce[i];
    }

    var key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
    var tmp = this.getRandomValues(new Uint8Array(16));
    var iv = converters.byteArrayToWordArray(tmp);
    var encrypted = CryptoJS.AES.encrypt(msgWordArray, key, {iv: iv});
    var ivOut = converters.wordArrayToByteArray(encrypted.iv);
    var ciphertextOut = converters.wordArrayToByteArray(encrypted.ciphertext);

    var data = ivOut.concat(ciphertextOut);

    return {
        'nonce': converters.byteArrayToHexString(nonce), 'data': converters.byteArrayToHexString(data)
    };

  }

  decryptMessage(msgHex, nonceHex, recieverSecretHex, senderPublicKey) {

      var secret = converters.hexStringToString(recieverSecretHex);
      var recieverPrivateKeyBytes = converters.hexStringToByteArray(this.getPrivateKey(secret));
      var senderPublicKeyBytes = converters.hexStringToByteArray(senderPublicKey);

      var nonce = converters.hexStringToByteArray(nonceHex);
      var sharedKey = this.getSharedSecret(recieverPrivateKeyBytes, senderPublicKeyBytes);

      var ivCiphertext = converters.hexStringToByteArray(msgHex);

      if (ivCiphertext.length < 16 || ivCiphertext.length % 16 !== 0) {
          console.log('Invalid Ciphertext');
      }

      var iv = converters.byteArrayToWordArray(ivCiphertext.slice(0, 16));
      var ciphertext = converters.byteArrayToWordArray(ivCiphertext.slice(16));

      var key;
      if (nonce) {
          for (var i = 0; i < 32; i++) {
              sharedKey[i] ^= nonce[i];
          }
          key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
      } else {
          key = converters.byteArrayToWordArray(sharedKey);
      }

      var encrypted = CryptoJS.lib.CipherParams.create({
          ciphertext: ciphertext,
          iv: iv,
          key: key
      });

      var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
          iv: iv
      });

      var compressedPlaintext = converters.wordArrayToByteArray(decrypted);

      var binData = new Uint8Array(compressedPlaintext);
      var msgString = converters.byteArrayToString(pako.inflate(binData));

      return msgString;

  };


  getAccountDetails(secret) {
      var accountDetails = {
        publicKey:'',
        accountId:'',
        accountRs:''
      };
      accountDetails.publicKey = this.secretPhraseToPublicKey(secret);
      accountDetails.accountId = this.publicKeyToAccountId(accountDetails.publicKey);
      accountDetails.accountRs = this.accountIdToAccountRS(accountDetails.accountId);
      return accountDetails;
  };

  secretPhraseToPublicKey(secretPhrase) {

      var secretPhraseBytes = converters.stringToByteArray(secretPhrase);
      var digest = this.simpleHash(secretPhraseBytes, false);
      return converters.byteArrayToHexString(curve25519.keygen(digest).p);

  };

  getBlockTime(epoch) {
    return Math.floor(Date.now() / 1000) - epoch;
  };

  generateToken(message, secretHex, publicKey, epoch) {
      var messageBytes = this.getUtf8Bytes(message);
      var pubKeyBytes = converters.hexStringToByteArray( publicKey );
      var token = pubKeyBytes;

      var tsb = [];
      var ts = epoch;
      tsb[0] = ts & 0xFF;
      tsb[1] = (ts >> 8) & 0xFF;
      tsb[2] = (ts >> 16) & 0xFF;
      tsb[3] = (ts >> 24) & 0xFF;

      messageBytes = messageBytes.concat(pubKeyBytes, tsb);
      token = token.concat(tsb, converters.hexStringToByteArray(
                this.signatureHex(   converters.byteArrayToHexString(messageBytes) , secretHex) ));

      var buf = '';
      for (var ptr = 0; ptr < 100; ptr += 5) {
          var nbr = [];
          nbr[0] = token[ptr] & 0xFF;
          nbr[1] = token[ptr+1] & 0xFF;
          nbr[2] = token[ptr+2] & 0xFF;
          nbr[3] = token[ptr+3] & 0xFF;
          nbr[4] = token[ptr+4] & 0xFF;
          var number = this.byteArrayToBigInteger(nbr);
          if (number < 32) {
              buf += '0000000';
          } else if (number < 1024) {
              buf += '000000';
          } else if (number < 32768) {
              buf += '00000';
          } else if (number < 1048576) {
              buf += '0000';
          } else if (number < 33554432) {
              buf += '000';
          } else if (number < 1073741824) {
              buf += '00';
          } else if (number < 34359738368) {
              buf += '0';
          }
          buf +=number.toString(32);
      }
      return buf;
  };

  secretPhraseToPrivateKey(secretPhrase) {
      return converters.stringToHexString(secretPhrase);
  };

  secretPhraseFromPrivateKey(privateKey) {
      return converters.hexStringToString(privateKey);
  };

  // _hash(){
  //     var init = SHA256_init;
  //     var update = SHA256_write;
  //     var getBytes = SHA256_finalize;
  // }

  publicKeyToAccountId(publicKey) {
      var hex = converters.hexStringToByteArray(publicKey);

      SHA256_init();
      SHA256_write(hex);

      var account = SHA256_finalize();

      account = converters.byteArrayToHexString(account);

      var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

      var accountId = this.byteArrayToBigInteger(slice).toString();

      return accountId;

  };

  accountIdToAccountRS(accountId) {

      var address = new rsAddress();

      if (address.set(accountId)) {
          return address.toString();
      } else {
          return '';
      }
  };

  signatureHex(unsignedHex, privateHex) {

      var unsignedBytes = converters.hexStringToByteArray(unsignedHex);
      var secretPhraseBytes = converters.hexStringToByteArray(privateHex);

      var digest = this.simpleHash(secretPhraseBytes, false);
      var s = curve25519.keygen(digest).s;
      var m = this.simpleHash(unsignedBytes, false);
      var x = this.simpleHash(m, s);
      var y = curve25519.keygen(x).p;
      var h = this.simpleHash(m, y);
      var v = curve25519.sign(h, x, s);

      return converters.byteArrayToHexString(v.concat(h));

  };

  signTransactionHex(unsignedHex, signatureHex) {

      var payload = unsignedHex.substr(0, 192) + signatureHex + unsignedHex.substr(320);

      return payload;
  };
}
