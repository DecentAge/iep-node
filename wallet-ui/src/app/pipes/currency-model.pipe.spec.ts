import { CurrencyModelPipe } from './currency-model.pipe';

describe('CurrencyModelPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyModelPipe();
    expect(pipe).toBeTruthy();
  });
});
