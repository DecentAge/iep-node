import { IsEnabledPipe } from './is-enabled.pipe';

describe('IsEnabledPipe', () => {
  it('create an instance', () => {
    const pipe = new IsEnabledPipe();
    expect(pipe).toBeTruthy();
  });
});
