/* global describe beforeEach module it expect inject */
describe('app', () => {
  var scope;
  
  beforeEach(module('goboardApp'));

  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();
  }));
  
  it('Does not fall over when simply requiring the base namespace', () => {
    expect(scope).toBeTruthy();
  });
});
