/**
 * Custom functionality written by Michael Vaganov, while learning Node.js and JavaScript
 * MIT License.
 * @module mvaganov
 */
// var mvaganov = require("./mvaganov");
 
var url = require("url");

/**
 * add functionality to the String implementation.... pretty sweet that JavaScript can do this
 */
function addToStrings()
{	"use strict";
	if (typeof String.prototype.startsWith !== 'function')
	{
		String.prototype.startsWith = function (str){
			return this.substring(0, str.length) === str; //this.slice(0, str.length) === str;
		}
	}
	if (typeof String.prototype.replaceAll !== 'function')
	{
		/**
		 * @param {string} str1
		 * @param {string} str2
		 * @param {(boolean|null)} ignore ignore case?
		 * @return {string} a new string, a copy of this one, with all instances of str1 replaced with str2.
		 */
		String.prototype.replaceAll = function(str1, str2, ignore)
		{
			return this.replace(new RegExp(
				str1.replace(
					/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"
				),
				(ignore?"gi":"g")),
				(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2
			);
		}
	}
	if (typeof String.prototype.indexOfOneOfThese !== 'function')
	{
		/**
		 * @param {Array<String>} listOfDelimeters possible string delimeters that are being sought after
		 * @param {number=} start where to start looking in the string
		 * @return {Array<number>} [index that has one of these first, which delimeter was actually found here]. 
		 * if none of these exist, returns [this.length, -1]
		 * return[0] is the index
		 * return[1] is the index of the delimeter that was found
		 */
		String.prototype.indexOfOneOfThese = function (listOfDelimeters, start)
		{
			var bestIndex = this.length;
			var foundDelimeter = -1;
			if(start == null) start = 0;
			for(var i = 0; i < listOfDelimeters.length; ++i)
			{
				var index = this.indexOf(listOfDelimeters[i], start);
				if(index >= 0 && index < bestIndex)
				{
					foundDelimeter  = i;
					bestIndex = index;
				}
			}
			return [bestIndex, foundDelimeter];
		}
	}
	if (typeof String.prototype.splitByOneOfThese !== 'function')
	{
		/**
		 * @param {Array<String>} listOfDelimeters possible string delimeters that are being sought after
		 * @param {Number} maxSplits how many times to split. will split from left to right. -1 means no limit
		 * @return {Array<String>} as split, except with multiple delimeter tokens
		 */
		String.prototype.splitByOneOfThese = function (listOfDelimeters, maxSplits)
		{
			if(maxSplits == null) maxSplits = -1;
			var splitted = [], index = 0, whereToSplit, segment, splitCount = 0;
			for(var i = 0; index < this.length; ++i)
			{
				if(maxSplits >= 0 && splitCount >= maxSplits)
				{
					whereToSplit = [this.length, -1];
				}
				else
				{
					whereToSplit = this.indexOfOneOfThese(listOfDelimeters, index);
				}
				segment = this.slice(index, whereToSplit[0]);
				//console.log("("+index+", "+whereToSplit[0]+"... "+whereToSplit[1]+") ="+segment);
				splitCount++;
				if(segment.length > 0)
				{
					splitted.push(segment);
				}
				index = whereToSplit[0];
				if(whereToSplit[1] != -1)
				{
					index += listOfDelimeters[whereToSplit[1]].length;
				}
			}
			return splitted;
		}
	}
	if (typeof String.prototype.splitIntoTable !== 'function')
	{
		/**
		 * @param {Array<String>} listOfEntryDelimeters example: {@code ["{", "}", ","]}
		 * @param {Array<String>} listOfAssignmentDelimeters example: {@code ["=",":"]}
		 * @return {Object<String,String>} a key/value pair table. see {@link String#prototype#parseCookies} as an example
		 */
		String.prototype.splitIntoTable = function (listOfEntryDelimeters, listOfAssignmentDelimeters)
		{
			// first, split by entry delimeters
			var entries = this.splitByOneOfThese(listOfEntryDelimeters);
			// then split in half by the assignment delimeter
			var table = {};
			for(var i = 0; i < entries.length; ++i)
			{
				var pair = entries[i].splitByOneOfThese(listOfAssignmentDelimeters, 1);
				if(pair.length > 1)
				{
					table[pair[0]] = pair[1];
				}
				else
				{
					table[pair[0]] = null;
				}
			}
			return table;
		}
	}
	if (typeof String.prototype.parseCookies !== 'function')
	{
		/**
		 * @return {Map<String,String>} a table of cookies parameters, assuming this is formatted like an html cookie.
		 */
		String.prototype.parseCookies = function ()
		{
			return this.splitIntoTable([";", " "], ["=", ":"]);
		}
	}
	if (typeof String.prototype.getTimestamp !== 'function')
	{
		String.prototype.getTimestamp = function()
		{
			return new Date(parseInt(this.toString().slice(0,8), 16)*1000);
		}
	}
}
addToStrings();

/** a list of all of the modules this machine can access, built by the command line "npm ls --json" */
var npmListing = null;
var processStarted = false;
function gatherNpmListing() {
	if(processStarted) return;
	processStarted = true;
	// try to get other installed modules from the npm command line tool
	require("child_process").exec("npm ls --json", 
		function(err, stdout, stderr) {
			if (err) return console.log(err)
			npmListing = JSON.parse(stdout);
			// add the libraries to the npmListing
			function addTheModuleToThisListing(npmListing, moduleName)
			{
				console.log(moduleName);
				if(moduleName != null)
				{
					try{
						npmListing["module"] = require(moduleName);
					}catch(err){
						npmListing["module"] = err;
						//console.log("couldn't load "+moduleName);
					}
				}
				if(npmListing["dependencies"])
				{
					for(var d in npmListing.dependencies)
					{
						addTheModuleToThisListing(npmListing.dependencies[d], d);
					}
				}
				// after the root is done, print.
				if(moduleName == null)
				{
					printReflectionInConsole(npmListing, "npmListing", 3);
				}
			}(npmListing); // call the function right after defining it
		}
	);
}

/** @param {Object} obj print an object as a JSON string, including function code */
function toJSONWithFuncs(obj)
{
	Object.prototype.toJSON = function()
	{
		var sobj = {}, i;
		for (i in this) 
			if (this.hasOwnProperty(i))
				sobj[i] = typeof this[i] == 'function' ? this[i].toString() : this[i];
		return sobj;
	};
	var str = JSON.stringify(obj);
	delete Object.prototype.toJSON;
	return str;
}

/** how deep a tree to show when including the HTML traversal of JavaScriptObjects @type Number */
var maxIndentLevel = 0;
/** if true, will spam the server's console whenever {@link #createReflectedHtmlForJso} is called @type Boolean */
var printInConsole = false;//true;
var showPrivateVariables = true;
var javaScriptObjectTraversalParameter = "jso";

/**
 * creates a simple directory traversal interface using anchor tags 
 * @param {?} obj which object is being traversed (can be any type, including null)
 * @param {?String=} pathStr the path (through parent objects) taken to get here (optional, can be null)
 * @param {Number=} indentLevel used to properly indent, and prevent infinite recursion. limited by {@link #maxIndentLevel} (optional)
 * @return {String} the HTML script that will allow traversal. the key parameter is {@link javaScriptObjectTraversalParameter}
 */
function createReflectedHtmlForJso(obj, pathStr, indentLevel)
{	"use strict";
	var indentation = "", i = 0, j = 0, props = [], functions = [], childText = [], nChildTexts = 0, key, strResult = "";
	// default arguments
	if ( typeof pathStr === 'undefined')		pathStr = "";
	if ( typeof indentLevel === 'undefined')	indentLevel = 0;
	// write the "path" at the top
	if(indentLevel == 0)
	{
		strResult = "\n<h1>@ ";
		var arr = pathStr.split(".");
		for(i = 0; i < arr.length; ++i)
		{
			if(i > 0) strResult += ".";
			strResult += "<a href=\"/?"+javaScriptObjectTraversalParameter+"=";
			for(j = 0; j < i; ++j)
			{
				strResult += arr[j] + ".";
			}
			strResult += arr[i] + "\">"+arr[i]+"</a>";
		}
		strResult += "</h1>\n";
	}
	// for debug output in the console...
	if(printInConsole)
		for(i=0; i < indentLevel; i++)
			indentation = indentation.concat("    ");
	// reflect a JS functions
	if(typeof obj === 'function')
	{
		strResult += "<pre>"+obj.toString()+"</pre>";
		if(printInConsole) console.log(obj.toString());
	}
	// reflect simple types
	else if(typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean')
	{
		strResult += "<b>"+(typeof obj)+"</b> = "+obj+"\n";
		if(printInConsole) console.log((typeof obj)+" = "+obj);
	}
	// reflect objects
	else if(typeof obj === 'object')
	{
		// null objects don't need all of this processing
		if(obj != null)
		{
			// asks an object for all of it's members
			for(key in obj)
			{
				if(obj.hasOwnProperty(key) && (showPrivateVariables || !key.startsWith('_')))
				{
					if(typeof obj[key] !== 'function')
					{
						if(printInConsole) console.log(indentation+key+" : "+typeof obj[key]+" = "+obj[key]);
						props.push(key);
						if(typeof obj[key] === 'object' 
						&& indentLevel < maxIndentLevel)
						{
							var childStr;
							if(obj[key] == null)
								childStr = "";
							else
								childStr = createReflectedHtmlForJso(obj[key], pathStr+"."+key, indentLevel+1);
							if(indentLevel < maxIndentLevel)
							{
								childText[nChildTexts] = childStr;
								nChildTexts += 1;
							}
						}
					}
					else
					{
						functions.push(key);
					}
				}
			}
			strResult += "<ul>"
			j = 0;
			// print child elements
			for(i = 0; i < props.length; ++i)
			{
				key = props[i];
				strResult += "<li><a href=\"/?"+javaScriptObjectTraversalParameter+"="+pathStr+"."+key+"\">"+key+"</a> : <b>"+(typeof obj[key])+"</b> = <i>"+obj[key]+"</i>";
				// include members from the first tier of child objects
				if(typeof obj[key] === 'object' && obj[key] != null)
				{
					strResult += "["+Object.keys(obj[key]).length+"]";
					if(indentLevel < maxIndentLevel)
					{
						strResult += childText[j];
						j++;
					}
				}
				strResult += "\n";
			}
			for(i = 0; i < functions.length; ++i)
			{
				key = functions[i];
				var codestr = obj[key].toString();
				codestr = codestr.slice(0, codestr.indexOf('{'));
				if(printInConsole) console.log(indentation+key+" : "+typeof obj[key]+" = "+codestr);
				codestr = codestr.replaceAll(" ", "&nbsp");
				codestr = codestr.replaceAll("\n", "<br>");
				strResult += "<li><a href=\"/?"+javaScriptObjectTraversalParameter+"="+pathStr+"."+key+"\">"+key+"</a> : <font face=\"courier\">"+codestr+"</font>\n";
			}
			strResult += "</ul>";
		}
		else
		{
			strResult += "<b>null</b>";
		}
	}
	else
	{
		strResult += "unknown JavaScriptObject<pre>"+obj+"</pre>";
		if(printInConsole) console.log("unknown type ("+(typeof obj)+"): "+obj);
	}
	return strResult;
}

/**
 * @nosideeffects
 * @param {?Object=} obj what object to print out
 * @param {?String=} name how to label this object when printing in the console
 * @param {Number=} depth how many children deep to print out. if null, {@link #maxIndentLevel} is used.
 */
 function printReflectionInConsole(obj, name, depth)
{
	if(name != null)
	{
		console.log("[["+name+"]]");
	}
	var oldMax = maxIndentLevel;
	if(depth != null)
	{
		maxIndentLevel = depth;
	}
	printInConsole = true;
	createReflectedHtmlForJso(obj);
	printInConsole = false;
	if(oldMax != maxIndentLevel)
	{
		maxIndentLevel = oldMax;
	}
}

function jsoNavigation(nameToEvaluate, localVariables)
{
	var whatObjectToLookAt = null;
	var explicitlyNull = false;
	var strOutput = "";
	var jso = localVariables;
	if(nameToEvaluate != null && nameToEvaluate !== "")
	{
		try{
			//whatObjectToLookAt = eval(nameToEvaluate); // breaks if member has a strange character in the name
			var p = nameToEvaluate.split('.');
			var cursor = eval(p[0]);
			for(var i = 1; i < p.length; ++i)
			{
				cursor = cursor[p[i]];
			}
			whatObjectToLookAt = cursor;
			//console.log("found <"+nameToEvaluate+">");
			explicitlyNull = true;
		}catch(err){
			console.log("couldn't parse \""+nameToEvaluate+"\" : "+err);
		}
	}
	//console.log(whatObjectToLookAt+" "+explicitlyNull)
	if(whatObjectToLookAt == null && !explicitlyNull)
	{
		strOutput += "<a href=\"/?"+javaScriptObjectTraversalParameter+
			"=jso\">jso</a><br>\n";
		//console.log(strOutput);
	}
	else
	{
		var reflectedString = createReflectedHtmlForJso(whatObjectToLookAt, nameToEvaluate);
		strOutput += reflectedString;
	}
	return strOutput;
}

 /**
 * @param request {HTTPRequest} the HTTP request
 * @param request {HTTPResponse} the HTTP response
 */
 function jsoNavHtml(request, response)
{
	extraVariables = ["./mvaganov", "./router", "./helloserver", "./requesthandler", "./db",
		// "formidable", "express"
		// "http", "fs", "sys", "util", "querystring" // these are in process.moduleLoadList
		];
	// get native modules from 'process'
	var i;
	var loadListModules = process.moduleLoadList;
	var nativeModleLabel = "NativeModule ";
	var entry;
	for(i = 0; i < loadListModules.length; ++i)
	{
		entry = loadListModules[i];
		if(entry.startsWith(nativeModleLabel))
		{
			extraVariables.push(entry.slice(nativeModleLabel.length, entry.length));
		}
	}
	// load the basic (known) modules up...
	var localVariables = [];
	for(i = 0; i < extraVariables.length; ++i)
	{
		var str = extraVariables[i];
		var name = str;
		if(name.startsWith("./"))
		{
			name = name.slice(2, name.length);
		}
		var loadedModule;
		try
		{
			loadedModule = require(str);
		}
		catch(err)
		{
			loadedModule = "ERROR: could not load module."
		}
		localVariables[name] = loadedModule;
	}
	// add the global process, and the request/response of this HTTP event
	localVariables["process"] = process;
	localVariables["request"] = request;
	localVariables["response"] = response;
	// try to get other installed modules from the npm command line tool
	gatherNpmListing();
	if(npmListing != null)
	{
		localVariables["npmListing"] = npmListing;
	}

	//var q = querystring.parse(request.url);
	var parsedURL = url.parse(request.url);
	var fullpath = parsedURL.path;
	var argsIndex = fullpath.indexOfOneOfThese(['?', '&'])[0];
	//var pathname = fullpath.slice(0, argsIndex);
	var pathargs = fullpath.slice(argsIndex+1, fullpath.length);
	var arguments = pathargs.splitIntoTable(["&", "?"], ["="]);
	//printReflectionInConsole(arguments, "---ARGUMENTS---");
	var nameToEvaluate = arguments[javaScriptObjectTraversalParameter];
	if(nameToEvaluate != null)
	{
		return jsoNavigation(nameToEvaluate, localVariables);
	}
	return "";
}

function jsoNav(request, response, next)
{
	var htmlOutput = jsoNavHtml(request, response);
	if(htmlOutput && htmlOutput.length > 0)
	{
		response.setHeader("Content-Type", "text/html");
		response.write(htmlOutput);
		response.end();
	}
	else
	{
		next();
	}
}

/** TODO reasearch the following

* for a game loop on the server: http://nodejs.org/api/globals.html#globals_settimeout_cb_ms

* for heavy lifty C code, call exec:
function execCbPageTest()
{
	var exec = require("child_process").exec;
	exec("dir", 
		function resultCallBack(error, stdout, stderr)
		{
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			stdout = stdout.toString();
			stdout = stdout.replaceAll("<", "&lt");
			stdout = stdout.replaceAll(">", "&gt");
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<pre>"+stdout+"</pre>");
			router.writeHtmlComponents(response, htmlComponentsToAdd);
			response.end();
		}
	);
}

* learn more about Express via this tutorial: http://expressjs.com/guide.html

* define object prototypes by using the prototype keyword, or __proto__ (would that work?)

* events, and event emitters http://www.sitepoint.com/nodejs-events-and-eventemitter/

* https://npmjs.org/browse/keyword/middleware/0/
  * gauth Middleware component to authenticate users through their Google account
  * authenticated ensure a request is authenticated

* JSDocs used by Google:
  https://developers.google.com/closure/compiler/docs/js-for-compiler#tags
  http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Comments#Comments

  
* modules to check out
  socket.io - real-time network communication
  request - simplified http reqeust client. has authentication, and other cool stuff?
  grunt - large scale automation
  mocha - testing framework
  async - more powerful asynchronous tools & structures for node.js
  mongoose - ORM (object relational managed) database
  passport - simple authentication for node.js

* modules that seem bad
  redis - big fancy data structure store... like a global variables crutch?
*/
exports.jsoNav = jsoNav;
exports.jsoNavHtml = jsoNavHtml;
exports.printReflectionInConsole = printReflectionInConsole;
exports.logjso = printReflectionInConsole;
exports.toJSONWithFuncs = toJSONWithFuncs;