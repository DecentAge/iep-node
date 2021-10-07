import { Injectable } from '@angular/core';

declare var PassPhraseGenerator: any;

import "app/crypto/passphrasegenerator.js";

@Injectable()
export class CryptoWrapperService {

  constructor() { }

  generatePassPhrase(){
    return PassPhraseGenerator.generatePassPhrase();
  }
}
