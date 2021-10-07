import { QuantToAmountPipe } from './quant-to-amount.pipe';

describe('QuantToAmountPipe', () => {
  it('create an instance', () => {
    const pipe = new QuantToAmountPipe();
    expect(pipe).toBeTruthy();
  });
});
