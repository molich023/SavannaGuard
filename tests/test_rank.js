import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreDocument } from '../functions/api/rank.js';

test('title match outranks weak body match', () => {
  const a = scoreDocument({title:'Kenya technology news', content:'other'}, 'Kenya technology');
  const b = scoreDocument({title:'Other story', content:'Kenya technology'}, 'Kenya technology');
  assert.ok(a > b);
});

test('African relevance receives a bounded boost', () => {
  const a = scoreDocument({title:'Kenya agriculture', content:''}, 'agriculture');
  const b = scoreDocument({title:'Agriculture', content:''}, 'agriculture');
  assert.ok(a > b);
});

test('spam score reduces rank', () => {
  const clean = scoreDocument({title:'Kenya security', content:''}, 'Kenya');
  const spam = scoreDocument({title:'Kenya security', content:'', spam_score:10}, 'Kenya');
  assert.ok(clean > spam);
});
