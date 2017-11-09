var dbus = require('dbus-native');


const serviceName = 'org.gnome.Shell.TestHelper';

const interfaceName = serviceName;

const objectPath = '/' + serviceName.replace(/\./g, '/');

// First, connect to the session bus (works the same on the system bus, it's just less permissive)
const sessionBus = dbus.sessionBus();

// Check the connection was successful
if (!sessionBus) {
  throw new Error('Could not connect to the DBus session bus.');
}

/*
	Then request our service name to the bus.
	The 0x4 flag means that we don't want to be queued if the service name we are requesting is already
	owned by another service ;we want to fail instead.
*/
sessionBus.requestName(serviceName, 0x4, (err, retCode) => {
  // If there was an error, warn user and fail
  if (err) {
    throw new Error(
      `Could not request service name ${serviceName}, the error was: ${err}.`
    );
  }

  // Return code 0x1 means we successfully had the name
  if (retCode === 1) {
    console.log(`Successfully requested service name "${serviceName}"!`);
    proceed();
  } else {
    /* Other return codes means various errors, check here
	(https://dbus.freedesktop.org/doc/api/html/group__DBusShared.html#ga37a9bc7c6eb11d212bf8d5e5ff3b50f9) for more
	information
	*/
    throw new Error(
      `Failed to request service name "${serviceName}". Check what return code "${retCode}" means.`
    );
  }
});

// Function called when we have successfully got the service name we wanted
function proceed() {
  let ifaceDesc;
  let iface;

  ifaceDesc = {
    name: interfaceName,
    methods: {
      Execute: [['s', 's'], '', ['test_pattern', 'results_file_path'], ['']],
    }
  };

  iface = {
    Execute: function(test_pattern, results_file_path) {
	if (!results_file_path) { results_file_path = '/tmp/test_results'; }
	var exec = require('child_process').exec, child;
	child = exec('mocha --reporter json ' + test_pattern,
	    function (error, stdout, stderr) {
		var fs = require('fs');
		fs.writeFile(results_file_path, stdout + '\n', function(err) {
		    if(err) {
			return console.log(err);
		    }
		    console.log("Test results saved at " + results_file_path);
		}); 
		console.log('stdout: ' + stdout);
		if (stderr) { console.log('stderr: ' + stderr); }
		if (error !== null) {
		     console.log('exec error: ' + error);
		}
	    });
    }
  };	

  // Now we need to actually export our interface on our object
  sessionBus.exportInterface(iface, objectPath, ifaceDesc);

  // Say our service is ready to receive function calls (you can use `gdbus call` to make function calls)
  console.log('Test interface exposed to DBus, ready to receive function calls!');

}
