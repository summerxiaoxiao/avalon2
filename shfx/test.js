
var _  = require('lodash')
var v = _.union(
  [
  {header: 'hello', field: 'c_0', sxct: {
    valueMap: {
      a1: 'world',
      a2: 'hel'
    }
    }}
], [
    {header: 'hello2', field: 'c_1'},
    {header: 'hello', field: 'c_0', sxct: {
        valueMap: {
          a1: 'world',
          a2: 'hel'
        }
      }}
  ]
  );
var vv = _.uniq(v)
// console.log(JSON.stringify(vv))

var m = {
  name: 'hello',
  value: 12
}
var mm = {
  name: 'hello2',
  sex: 1
}
// console.log(_.merge(m,mm))
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];

var pp = _.findIndex(users, function(o) { return o.user == 'barney1' })
console.log(pp)

var gg = _.indexOf(['123', '222', '333'], '123')
console.log(gg)


