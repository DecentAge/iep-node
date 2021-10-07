import { AmountToDecimalPipe } from './amount-to-decimal.pipe';

describe('AmountToDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new AmountToDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
