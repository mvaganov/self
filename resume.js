var resumeFilename = "resume.md"
var intermediateFile = resumeFilename+"_";
var resumeOutput = "resume.pdf"


//console.log("Converting resume to pdf...");

var markdownpdf = require("markdown-pdf")
  , split = require("split")
  , through = require("through")
  , duplexer = require("duplexer")
  , fs = require('fs')
  , mvaganov = require("./mvaganov")
  
function doTheThing(filename, outputfilename) {
	fs.readFile(filename, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var filteredOutput = "";
		var defines = {};
		var cursor = -1, end, lastGoodIndex = 0;
		var commentStart = "<!---";
		var commentEnd = "-->"
		var preprocState = -1;
		var preprocessInclude = false, nextpreprocessInclude = -1;
		var activeMacro = -1, nextActiveMacro = -1
		do {
			var found = data.indexOf(commentStart, cursor+1);
			if(found >= 0) {
				// find the end of the comment
				end = data.indexOf(commentEnd, found+commentStart.length)
				if(end < 0) {
					console.log("could not find \"" + commentEnd + "\", to match after \"" + commentStart + "\" at character "+found);
					return;
				}
				// process that comment, especially if it has a preprocessor macro in it
				var subSection = data.substr(found+commentStart.length, end-(found+commentStart.length));
				var macros = ["#define", "#ifdef", "#ifndef", "#endif"]
				var findMacro = subSection.indexOfOneOfThese(macros)
				var macroIndex = findMacro[0]
				var macroChoice = findMacro[1]
				// according to the macro that was found
				switch(macroChoice)
				{
				// #define
				case 0:
					// find the name of the variable being defined
					var startIndex = macroIndex + macros[macroChoice].length;
					var defineVar = subSection.substr(startIndex, subSection.length-startIndex)
					var tokens = defineVar.split(" ");
					var variableDefined = null;
					for(var i = 0; i < tokens.length; ++i) {
						tokens[i] = tokens[i].trim();
						if(tokens[i].length > 0) {
							if(variableDefined == null) {
//								console.log("defined \""+tokens[i]+"\"");
								defines[tokens[i]] = true;
								variableDefined = tokens[i];
							} else {
								// store the value of the variable
								defines[variableDefined] = ""
								for(var a = i; a < tokens.length; ++a) {
									defines[variableDefined] += tokens[a];
								}
//								console.log("\""+variableDefined+"\" = "+defines[variableDefined]);
								break;
							}
						}
					}
					break;
				// #ifdef
				case 1:
				// #ifndef
				case 2:
					// for conditional code, find the variable that acts as the condition
					var startIndex = macroIndex + macros[macroChoice].length;
					var defineVar = subSection.substr(startIndex, subSection.length-startIndex)
					var variableDefined = null;
					for(var i = 0; i < tokens.length; ++i) {
						tokens[i] = tokens[i].trim();
						if(tokens[i].length > 0) {
							if(variableDefined == null) {
								defines[tokens[i]] = true;
								variableDefined = tokens[i];
								break;
							}
						}
					}
					// evaluate the condition based on the condition type, and prepare to use it after the non-comment text is finished processing
					nextActiveMacro = macroChoice;
					if(macroChoice == 1) {
						nextpreprocessInclude = defines[variableDefined] != null;
					} else if(macroChoice == 2) {
						nextpreprocessInclude = defines[variableDefined] == null;
					}
//					console.log("PREPROCESSOR "+macros[macroChoice]+" "+variableDefined+" : "+nextpreprocessInclude);
					break;
				// #endif
				case 3:
					// after the non-comment text is processed based on this macro, forget about the macro.
					nextActiveMacro = 0;
//					console.log("ending " + macros[activeMacro] +" after next text is processed");
					break;
				// anything in comments should be included based on the activeMacro and preprocessInclude variable
				default:
//					console.log(activeMacro+" "+preprocessInclude);
					if(activeMacro == 1 || activeMacro == 2 && preprocessInclude == true) {
//						console.log("//+ \""+subSection+"\"");
						filteredOutput += subSection.trim()
					} else {
//						console.log("//- \""+subSection+"\"");
					}
				}
//				console.log("REGULAR "+activeMacro+" "+macros[activeMacro]+" "+variableDefined+" "+preprocessInclude);
				var dataToAdd = data.substr(lastGoodIndex, found-lastGoodIndex);
				var shownAddition = dataToAdd;
				if(shownAddition.length > 10) {
					shownAddition = shownAddition.substr(0,10)+"...";
				}
				if((activeMacro != 1 && activeMacro != 2) || preprocessInclude) {
//					console.log("+ \""+shownAddition+"\"");
					filteredOutput += dataToAdd
				} else {
//					console.log("- \""+shownAddition+"\"");
				}
				lastGoodIndex = end + commentEnd.length;
				cursor = lastGoodIndex-1;
				if(nextActiveMacro != -1)
				{
					activeMacro = nextActiveMacro;
					preprocessInclude = nextpreprocessInclude;
					nextActiveMacro = -1;
				}
			} else {
				filteredOutput += data.substr(lastGoodIndex, data.length-lastGoodIndex)
			}
		} while(found >= 0);
//		console.log(filteredOutput);

		fs.writeFile(intermediateFile, filteredOutput, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log(intermediateFile+" was created");
				markdownpdf() // {preProcessMd: preProcessMd} )
				  .from(intermediateFile)
				  .to(resumeOutput, function () { console.log("Done") })
			}
		}); 
	});
	
}

doTheThing(resumeFilename, intermediateFile)

