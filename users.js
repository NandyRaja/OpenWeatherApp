var records = [
    { id: 1, username: 'jack', token: 'deee81da-dba9-4a41-8e99-7d5bea5fca9c', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', token: '202ce19a-ebf8-4a44-ad64-9ffd41a6aec0', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
  , { id: 2, username: 'john', token: 'ea7419ee-038a-4e44-849c-0466ade96e37', displayName: 'John', emails: [ { value: 'john@example.com' } ] }
  , { id: 2, username: 'mike', token: '5d1f71fd-9d1b-4f68-a789-69eb390f3aa5', displayName: 'Mike', emails: [ { value: 'mike@example.com' } ] }
  , { id: 2, username: 'Alen', token: '809eacdc-ed3f-41c7-87c6-4180ad82b9bf', displayName: 'Alen', emails: [ { value: 'alen@example.com' } ] }
];

exports.findByToken = function(token, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.token === token) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
