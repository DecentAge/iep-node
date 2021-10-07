import { HasMessagePipe } from './has-message.pipe';

describe('HasMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new HasMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
