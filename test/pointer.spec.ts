import * as chai from 'chai';
import jsonPointer from '../src';

const expect = chai.expect;

describe('jsonPointer', () => {
   describe('escape', () => {
      it('none', () => {
         expect(jsonPointer({ a: { b: 1 }}, '/a/b')).to.equal(1);
      })
   });
});