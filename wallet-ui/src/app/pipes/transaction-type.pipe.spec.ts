import { TransationType } from './transaction-type.pipe';

describe('TransationType', () => {
    it('create an instance', () => {
        const pipe = new TransationType();
        expect(pipe).toBeTruthy();
    });
});
