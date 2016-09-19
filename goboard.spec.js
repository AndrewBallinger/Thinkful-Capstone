/* global describe beforeEach module it expect inject */
describe('goboardApp', () => {
  var scope, compiled, element;

  beforeEach(module('goboardApp'));
  beforeEach(module('index.html'));

  beforeEach(inject(($rootScope, $compile, $templateCache) => {
    scope = $rootScope.$new();
    compiled = $compile($templateCache.get('index.html'));
    element = compiled(scope);
  }));

  it('does not fall over when simply requiring the base namespace', () => {
    expect(scope).toBeTruthy();
  });

  it('does not fall over when simply requiring the index.html', () => {
    expect(element).toBeTruthy();
  });
});
