import { IsSyncPipe } from './is-sync.pipe';

describe('IsSyncPipe', () => {
  it('create an instance', () => {
    const pipe = new IsSyncPipe();
    expect(pipe).toBeTruthy();
  });
});
