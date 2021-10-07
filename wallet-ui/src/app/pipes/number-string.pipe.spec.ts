import { NumberStringPipe } from './number-string.pipe';

describe('NumberStringPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberStringPipe();
    expect(pipe).toBeTruthy();
  });
});
