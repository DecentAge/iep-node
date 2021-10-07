import { LedgerTxTypesPipe } from './ledger-tx-types.pipe';

describe('LedgerTxTypesPipe', () => {
  it('create an instance', () => {
    const pipe = new LedgerTxTypesPipe();
    expect(pipe).toBeTruthy();
  });
});
