describe('Plugins/Utils', function() {

  var ready = false;

  beforeEach(function() {
    runs(function() {
      ready = false;
      testModule({ name: "utils", requires: ['plugins.utils'] }).defines(function() {
        ready = true;
      });
    });

    waitsFor(function() {
      return ready;
    }, "Waiting for module", 500);
  });

  it('Array.prototype.first', function() {
    expect([1, 2, 3].first()).toBe(1);
    expect([].first()).toBeUndefined();
  });

  it('Number.prototype.between', function() {
    var x = 10;
    expect(x.between(5, 15)).toBe(true);
    expect(x.between(-1, 10)).toBe(false);
    expect(x.between(0, 9)).toBe(false);

    x = 1.5;
    expect(x.between(1.5, 2.3)).toBe(true);
    expect(x.between(-1, 10)).toBe(true);
    expect(x.between(1.6, 9)).toBe(false);
  });

  it('Array.prototype.first', function() {
    expect([1, 2, 3].first()).toBe(1);
    expect([].first()).toBeUndefined();
  });

  it('Array.prototype.last', function() {
    expect([1, 2, 3].last()).toBe(3);
    expect([].last()).toBeUndefined();
  });

  it('gg.utils.trim', function() {
    var x = '  test   ';
    expect(gg.utils.trim(x)).toBe('test');
    expect(gg.utils.trim(x, 'y')).toBe('  test   ');

    x = 'abctestbbb';
    expect(gg.utils.trim(x, 'abc')).toBe('test');
  });

  it('gg.utils.ltrim', function() {
    var x = '  test   ';
    expect(gg.utils.ltrim(x)).toBe('test   ');
    expect(gg.utils.ltrim(x, 'y')).toBe('  test   ');

    x = 'abctestbbb';
    expect(gg.utils.ltrim(x, 'abc')).toBe('testbbb');
    expect(gg.utils.ltrim(x)).toBe('abctestbbb');
  });

  it('gg.utils.rtrim', function() {
    var x = '  test   ';
    expect(gg.utils.rtrim(x)).toBe('  test');
    expect(gg.utils.rtrim(x, 'y')).toBe('  test   ');

    x = 'abctestbbb';
    expect(gg.utils.rtrim(x, 'abc')).toBe('abctest');
    expect(gg.utils.rtrim(x)).toBe('abctestbbb');
  });

  it('gg.utils.humanize', function() {
    var x = 'testString_whichIsHard_to_read';
    expect(gg.utils.humanize(x)).toBe('Test string which is hard to read');

    x = 'another test';
    expect(gg.utils.humanize(x)).toBe('Another test');
  });

  it('gg.utils.formatMasked', function() {
    expect(gg.utils.formatMasked(1.5, '#.##', true)).toBe('1.50');
    expect(gg.utils.formatMasked(1.5, '#.##', false)).toBe('1.5');
    expect(gg.utils.formatMasked(1.58, '##.##', true)).toBe('1.58');
    expect(gg.utils.formatMasked(1.58, '##.#', true)).toBe('1.6');
    expect(gg.utils.formatMasked(1.5, '#')).toBe('2');
    expect(gg.utils.formatMasked(1234.5, '#.#', true, true)).toBe('1,234.5');
    expect(gg.utils.formatMasked(1234.5, '#.#', true, false)).toBe('1234.5');
    expect(gg.utils.formatMasked(1234, '####', true, true)).toBe('1,234');
    expect(gg.utils.formatMasked(1234, '####', true, false)).toBe('1234');
  });

  it('gg.utils.randomMasked', function() {
    var x = 0;
    expect(true).toBe(true);
  });

  it('gg.utils.randomInRange', function() {
    for (var i = 0; i < 1000; i++)
      expect(gg.utils.randomInRange(1, 5).between(1, 5)).toBe(true);
    for (i = 0; i < 1000; i++)
      expect(gg.utils.randomInRange(-5, 5).between(-5, 5)).toBe(true);
  });

  it('gg.utils.randomInSet', function() {
    var x = 0;
    expect(true).toBe(true);
  });

  it('gg.utils.randomChance', function() {
    var x = 0;
    expect(true).toBe(true);
  });

  it('gg.utils.format', function() {
    expect(gg.utils.format('{0} {0} test {2} and {1}', 'Yes', 7, 10)).toBe('Yes Yes test 10 and 7');
    expect(gg.utils.format('nothing')).toBe('nothing');
  });
});