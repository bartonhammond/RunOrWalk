// simple-todos.js

if (Meteor.isClient) {
    var meteorInterval = undefined;
    var first = true;
    var isRun = true;
    var second = 1;
    var minute = 60 * second;
    
    var run = 4 * minute;
    var walk = 1 * minute;
    var countDown = 0;
    
    var figureMinTen = ReactiveVar('0');
    var figureMin = ReactiveVar('0');
    var figureSecTen = ReactiveVar('0');
    var figureSec = ReactiveVar('0');
    var currentActivity = ReactiveVar('run');
    
    if(Meteor.isCordova){
	Meteor.startup(function () {
	    document.addEventListener('backbutton', function(e) {
		if (document.location.pathname ===  "/") {
		    e.preventDefault();
		    Meteor.clearInterval(meteorInterval);
                    navigator.app.exitApp();
		} else {
		    navigator.app.backHistory()
		}
	    },false);
	})
    };
    
    Template.body.helpers({
	activity: function() {
	    return currentActivity.get();
	},
	figure_min_ten: function() {
	    return 'figure-' + figureMinTen.get();
	},
	figure_min: function() {
	    return 'figure-' + figureMin.get();
	},
	figure_sec_ten: function() {
	    return 'figure-' + figureSecTen.get();
	},
	figure_sec: function() {
	    return 'figure-' + figureSec.get();
	}
    });
    
    Template.body.events({
	"click .vibrate": function() {
	    navigator.notification.vibrate(500);
	}
    });
    var getDuration = function() {
	if (isRun) {
	    duration = run;
	} else {
	    duration = walk;
	}
	return duration;
    }

    var TimeCalculator = function(countdown) {
	this.countDown = countDown;
	
	this.tensOfMinutes = Math.floor((this.countDown / 60) / 10);
	this.countDown = this.countDown - (this.tensOfMinutes * 60);
	
	this.minutes = Math.floor(this.countDown / 60);
	this.countDown = this.countDown - (this.minutes * 60)
	
	this.tensOfSeconds = Math.floor(this.countDown / 10);
	this.countDown = this.countDown - (this.tensOfSeconds * 10);
	
	this.seconds = this.countDown;
    }
    
    TimeCalculator.prototype.getTensOfMinutes = function() {
	return this.tensOfMinutes;
    }
    TimeCalculator.prototype.getMinutes = function() {
	return this.minutes;
    }
    TimeCalculator.prototype.getTensOfSeconds = function() {
	return this.tensOfSeconds;
    }
    TimeCalculator.prototype.getSeconds = function(){
	return this.seconds;
    }
    
    var clock = function() {
	if (first) {
	    countDown = getDuration();
	    first = false;
	}
	if (countDown == 0) {
	    if (isRun) {
		navigator.notification.vibrate(1000);
	    } else {
		navigator.notification.vibrate([1000, 500, 1000]);
	    }
	    isRun = !isRun;
	    if (isRun) {
		currentActivity.set('run');
	    } else {
		currentActivity.set('walk');
	    }
	    countDown = getDuration();
	}
	
	var duration = new TimeCalculator(countDown);
	
	figureMinTen.set(duration.getTensOfMinutes());
	
	figureMin.set(duration.getMinutes());

	figureSecTen.set(duration.getTensOfSeconds());
	
	figureSec.set(duration.getSeconds());

	countDown--;
    }
    
   meteorInterval = Meteor.setInterval(clock, 1000);
}
