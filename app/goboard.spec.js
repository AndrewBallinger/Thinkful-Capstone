/* global describe beforeEach module it expect inject */
describe('app', () => {
  var scope;
  
  beforeEach(module('goboardApp'));
  beforeEach(module('index.html'));
  
  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();
    
  }));
  
  it('does not fall over when simply requiring the base namespace', () => {
    expect(scope).toBeTruthy();
  });

  it('does not fall over when simply requiring the index.html', () => {
    expect(scope).toBeTruthy();
  });
});
