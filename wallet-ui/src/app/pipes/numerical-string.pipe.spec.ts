import { NumericalStringPipe } from './numerical-string.pipe';

describe('NumericalStringPipe', () => {
  it('create an instance', () => {
    const pipe = new NumericalStringPipe();
    expect(pipe).toBeTruthy();
  });
});
