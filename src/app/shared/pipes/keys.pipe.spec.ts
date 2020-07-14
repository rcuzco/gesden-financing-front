import { TestBed } from '@angular/core/testing';
import { KeysPipe } from './keys.pipe';

const objToTest = { key1: 1, key2: 'value2' };

describe('Keys pipe', () => {
  let keysPipe: KeysPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
    keysPipe = new KeysPipe();
  });

  it('should return keys from object', () => {
    expect(keysPipe.transform(objToTest, [])).toEqual([{ key: 'key1', value: 1 }, { key: 'key2', value: 'value2' } ]);
  });
});
