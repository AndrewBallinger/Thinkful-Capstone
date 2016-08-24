/* global describe beforeEach module it expect inject */
describe('space', () => {
  var scope, compiled, element;
  
  beforeEach(module('goboardComponents'));
  beforeEach(module('components/space/space.html'));
  
  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();
    compiled = $compile("<space row='A' column='1'></space>");
    element = compiled(scope);
    scope.$digest();
  }));
  
  it('does not fall over when simply rendering', () => {
    expect(element).toBeTruthy();
    expect(element.html()).toContain("A1");
  });

});
