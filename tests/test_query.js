import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuery, classifyQuery } from '../functions/api/query.js';

test('query normalization is bounded and Unicode normalized', () => {
  assert.equal(normalizeQuery('  Habari   Kenya  '), 'Habari Kenya');
  assert.ok(normalizeQuery('x'.repeat(300)).length <= 240);
});

test('query intent classification', () => {
  assert.equal(classifyQuery('latest Kenya news').intent, 'news');
  assert.equal(classifyQuery('restaurants near Nairobi').intent, 'places');
  assert.equal(classifyQuery('picha za Nairobi').intent, 'images');
});
