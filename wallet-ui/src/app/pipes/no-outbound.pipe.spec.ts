import { NoOutboundPipe } from './no-outbound.pipe';

describe('NoOutboundPipe', () => {
  it('create an instance', () => {
    const pipe = new NoOutboundPipe();
    expect(pipe).toBeTruthy();
  });
});
