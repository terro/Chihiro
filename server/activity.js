﻿var db,
    redis,
    clients,
    socket;
    
exports.init = function(_db, _redis, _clients, _socket) {
    db       = _db;
    redis    = _redis;
    clients  = _clients;
    socket   = _socket;
    return {
        addActivity:             addActivity,
        removeActivity:          removeActivity,
        updateActivityDetails:   updateActivityDetails,
        participateActivity:     participateActivity,
        unparticipateActivity:   unparticipateActivity
        findActivityByInterests: findActivityByInterests,
        findActivityByLocation:  findActivityByLocation
    };
}

function addActivity(activity, callback) {
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        activity.creator_id = uid;
        // set in mongo
        db.activities.insert(activity, {
            safe: true      // Check if insert is successful
        }, function (err, objects) {
            if (err) {
                callback({err: 1, msg: '添加活动失败'});
            } else {
                // set in redis
                var activity = objects[0];
                for (key in activity)
                    redis.hset('activities:' + activity._id, key, activity[key]);
                callback({err: 0, msg: '添加活动成功'});
            }
        });
    });
}

function removeActivity(activity_id) {
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.hgetall('activities:' + activity_id, function (err, activity) {
            if (!activity) {
                
            } else {
                
            }
        });
    });
}

function updateActivityDetails(activity) {
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.hget('activities:' + activity._id, 'creator_id', function(err, cid) {
            if (uid != cid) return;
            // set in mongo
            db.activities.update({'_id': db.ObjectId(activity._id)}, {$set: activity});
            // set in redis
            for (key in activity)
                redis.hset('activities:' + activity._id, key, activity[key]);
        });
    });
}

function participateActivity(activity) {
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.sadd('activity_participants:' + activity._id, uid);
    });
}

function unparticipateActivity(activity) {
    socket.get('uid', function (err, uid) {
        if (!uid) return;
        redis.srem('activity_participants:' + activity._id, uid);
    });
}

// data includes: title, ordertype.
function findActivityByTitle(data, callback) {
    
}

// data includes: ordertype.
function findActivityByLocation(data, callback) {
    
}