/* global describe beforeEach module it expect inject */
describe('board', () => {
  var scope, compiled, element;
  
  beforeEach(module('goboardComponents'));
  beforeEach(module('board/board.html'));
  
  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();
    compiled = $compile("<board></board>");
    element = compiled(scope);
    scope.$digest();
  }));
  
  it('does not fall over when simply rendering', () => {
    expect(element).toBeTruthy();
    expect(element.html()).toContain("totally");
  });

});
