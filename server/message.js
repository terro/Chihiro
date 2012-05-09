var redis, clients;

exports.init = function(_redis, _clients) {
    redis    = _redis;
    clients  = _clients;
    return {
        sendMessage:      sendMessage,
        createTopic:      createTopic,
        getTopicInfo:     getTopicInfo,
        subscribeTopic:   subscribeTopic,
        sendTopicMessage: sendTopicMessage,
        draw:             draw,
        getTopics:        getTopics
    };
}

// send text message to a user
// TODO: offline messages
function sendMessage(data) {
    var socket = this;
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.hget('users:' + uid, 'nickname', function (err, nickname) {
            if (!nickname) return;
            if (data.uid in clients) {
                clients[data.uid].emit('messages', {
                    from: uid,
                    nickname: nickname,
                    time: data.time,
                    message: data.msg
                });
                redis.sadd('messages:' + data.uid, uid + '|' + data.time + '|' + data.msg);
                console.log('message to:' + data.uid, nickname + '|' + uid + '|' + data.time + '|' + data.msg);
            } else {
                redis.sadd('offline_messages:' + data.uid, uid + '|' + data.time + '|' + data.msg);
                console.log('offline message to:' + data.uid, nickname + '|' + uid + '|' + data.time + '|' + data.msg);
            }
        });
    });
}

// Create a topic with members
function createTopic(data, callback) {
    var socket = this;
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        if (!data.nickname || !data.members || !data.intro) return;
        redis.incr('topics_id', function (err, id){
            redis.set('topics:' + id + ':nickname', data.nickname);
            redis.set('topics:' + id + ':intro', data.intro);
            data.members.push(uid);
            redis.sadd('topics:' + id + ':members', data.members);
            for (iuid in data.members) {
                var userid = data.members[iuid];
                redis.sadd('user_topics:' + userid, id);
                if (userid in clients) {
                    clients[userid].get('redis', function (err, redisp) {
                        redisp.subscribe('topic:' + id);
                        redisp.subscribe('draw:' + id);
                    });
                }
            }
            callback({err: 0, id: id});
            console.log('new topic ' + data.nickname + ' is created.');
        });
    });
}

// Get a topic information
function getTopicInfo(id, callback, socket) {
    if (!socket) socket = this;
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.get('topics:' + id + ':nickname', function (err, nickname) {
            if (nickname) {
                redis.get('topics:' + id + ':intro', function (err, intro) {
                    redis.smembers('topics:' + id + ':members', function (err, members) {
                        if (!members) {
                            callback({err: 0, nickname: nickname, intro: intro, id: id, members: []});
                        }
                        var names = new Array();
                        var length = members.length;
                        for (var i in members) {
                            redis.hget('users:' + members[i], 'nickname', function (err, nname) {
                                names.push(nname);
                                if (!--length) {
                                    callback({err: 0, nickname: nickname, intro: intro, id: id, members: names});
                                }
                            });
                        }
                    });
                });
            }
            else callback({err:1, msg: '未找到该讨论组'});
        });
    });
}

function getTopics(callback) {
    var socket = this;
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.smembers('user_topics:' + uid, function (err, ids) {
            var topics = new Array();
            var length = ids.length;
            for (i in ids) {                
                getTopicInfo(ids[i], function (t) {
                    delete t.err;
                    topics.push(t);
                    if (!--length) {
                        callback(topics);
                    }
                }, socket);
            }
        });
    });
}

// Subscribe a topic
function subscribeTopic(id) {
    var socket = this;
    socket.get('uid', function (err, uid) {
        redis.sadd('topics:' + id + ':members', uid);
        redis.sadd('user_topics:' + uid, id);  
    });
}

function sendTopicMessage(data) {
    var socket = this;
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.publish('topic:' + data.id, JSON.stringify({uid: uid, msg: data.msg}));
    });
}

function draw(data) {
    redis.publish('draw:' + data.id, JSON.stringify([data.px, data.py, data.x, data.y]));
}

function clear(id) {
    redis.publish('draw:' + id, '\'clear\'');
}